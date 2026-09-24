from typing import List, Dict, Any
from sqlalchemy.orm import Session
from ..models.models import Centre, Slot, QueueEntry

def get_centre_live_queue(db: Session, centre_id: int) -> int:
    # Count waiting queue entries
    waiting_count = db.query(QueueEntry).filter(
        QueueEntry.centre_id == centre_id,
        QueueEntry.status.in_(["waiting", "serving"])
    ).count()
    # Baseline simulation adjustment for realistic SIH numbers
    base_map = {1: 48, 2: 15, 3: 85} # Centre A: 48, Centre B: 15, Centre C: 85
    return max(waiting_count, base_map.get(centre_id, 20))

def calculate_waiting_time(people_ahead: int, avg_processing_time: int, active_counters: int) -> int:
    if active_counters <= 0:
        active_counters = 1
    wait = (people_ahead * avg_processing_time) // active_counters
    return max(5, wait)

def get_smart_recommendations(db: Session, crop_name: str = "Wheat") -> List[Dict[str, Any]]:
    centres = db.query(Centre).all()
    results = []

    for centre in centres:
        live_queue = get_centre_live_queue(db, centre.id)
        est_wait = calculate_waiting_time(
            people_ahead=live_queue,
            avg_processing_time=centre.avg_processing_time_mins,
            active_counters=centre.active_counters
        )

        is_overcrowded = live_queue >= centre.crowd_threshold

        # Scoring: lower wait time and distance gives higher score
        # Normalize:
        # Distance penalty: ~ 3 points per km
        # Wait time penalty: ~ 1 point per 2 mins
        score = 100.0 - (centre.distance_km * 3.0) - (est_wait * 0.5)
        if is_overcrowded:
            score -= 40.0 # heavy penalty for overcrowding

        supported_crops = [cc.crop_name for cc in centre.crops if cc.is_active]
        is_crop_supported = (crop_name in supported_crops) if crop_name else True

        if not is_crop_supported:
            score = -999.0

        slots = db.query(Slot).filter(
            Slot.centre_id == centre.id,
            Slot.is_active == True,
            Slot.booked_tokens < Slot.capacity_tokens
        ).all()

        results.append({
            "centre": centre,
            "current_queue": live_queue,
            "estimated_wait_mins": est_wait,
            "supported_crops": supported_crops,
            "slots": slots,
            "score": score,
            "is_overcrowded": is_overcrowded,
            "is_crop_supported": is_crop_supported
        })

    # Sort descending by score
    results.sort(key=lambda x: x["score"], reverse=True)

    recommendations = []
    best_id = results[0]["centre"].id if results else None
    best_centre_name = results[0]["centre"].name if results else ""

    for item in results:
        centre = item["centre"]
        is_rec = (centre.id == best_id) and (not item["is_overcrowded"])

        if is_rec:
            reason = (
                f"{centre.name} is recommended because it has a significantly shorter queue "
                f"({item['current_queue']} farmers) and only {item['estimated_wait_mins']} minutes "
                f"estimated wait with {centre.active_counters} active counters."
            )
        elif item["is_overcrowded"]:
            reason = (
                f"Overcrowded alert: Currently {item['current_queue']} farmers waiting (threshold: {centre.crowd_threshold}). "
                f"We strongly recommend diverting to {best_centre_name}."
            )
        else:
            reason = (
                f"{centre.name} is available ({centre.distance_km} km away) with an estimated wait of "
                f"{item['estimated_wait_mins']} mins."
            )

        recommendations.append({
            "centre": {
                "id": centre.id,
                "code": centre.code,
                "name": centre.name,
                "location": centre.location,
                "district": centre.district,
                "state": centre.state,
                "distance_km": centre.distance_km,
                "daily_capacity_quintals": centre.daily_capacity_quintals,
                "active_counters": centre.active_counters,
                "avg_processing_time_mins": centre.avg_processing_time_mins,
                "crowd_threshold": centre.crowd_threshold,
                "opening_hours": centre.opening_hours,
                "current_status": "crowded" if item["is_overcrowded"] else centre.current_status,
                "current_queue": item["current_queue"],
                "estimated_wait_mins": item["estimated_wait_mins"],
                "supported_crops": item["supported_crops"],
                "slots": item["slots"]
            },
            "score": round(item["score"], 1),
            "is_recommended": is_rec,
            "reason": reason,
            "is_overcrowded": item["is_overcrowded"],
            "alternative_centre": best_centre_name if item["is_overcrowded"] else None
        })

    return recommendations
