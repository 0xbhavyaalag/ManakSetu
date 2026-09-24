from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import Centre
from ..schemas.schemas import CentreOut, CentreRecommendation
from ..services.recommendation import get_smart_recommendations, get_centre_live_queue, calculate_waiting_time

router = APIRouter(prefix="/centres", tags=["Centres"])

@router.get("", response_model=List[CentreOut])
def list_centres(crop_name: Optional[str] = None, db: Session = Depends(get_db)):
    centres = db.query(Centre).all()
    out = []
    for c in centres:
        live_q = get_centre_live_queue(db, c.id)
        est_wait = calculate_waiting_time(live_q, c.avg_processing_time_mins, c.active_counters)
        supported_crops = [cc.crop_name for cc in c.crops if cc.is_active]
        if crop_name and crop_name not in supported_crops:
            continue
        out.append({
            "id": c.id,
            "code": c.code,
            "name": c.name,
            "location": c.location,
            "district": c.district,
            "state": c.state,
            "distance_km": c.distance_km,
            "daily_capacity_quintals": c.daily_capacity_quintals,
            "active_counters": c.active_counters,
            "avg_processing_time_mins": c.avg_processing_time_mins,
            "crowd_threshold": c.crowd_threshold,
            "opening_hours": c.opening_hours,
            "current_status": "crowded" if live_q >= c.crowd_threshold else c.current_status,
            "current_queue": live_q,
            "estimated_wait_mins": est_wait,
            "supported_crops": supported_crops,
            "slots": c.slots
        })
    return out

@router.get("/recommendations", response_model=List[CentreRecommendation])
def get_recommendations(crop: str = Query("Wheat"), db: Session = Depends(get_db)):
    return get_smart_recommendations(db, crop_name=crop)

@router.get("/{centre_id}", response_model=CentreOut)
def get_centre_details(centre_id: int, db: Session = Depends(get_db)):
    c = db.query(Centre).filter(Centre.id == centre_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Centre not found.")
    live_q = get_centre_live_queue(db, c.id)
    est_wait = calculate_waiting_time(live_q, c.avg_processing_time_mins, c.active_counters)
    return {
        "id": c.id,
        "code": c.code,
        "name": c.name,
        "location": c.location,
        "district": c.district,
        "state": c.state,
        "distance_km": c.distance_km,
        "daily_capacity_quintals": c.daily_capacity_quintals,
        "active_counters": c.active_counters,
        "avg_processing_time_mins": c.avg_processing_time_mins,
        "crowd_threshold": c.crowd_threshold,
        "opening_hours": c.opening_hours,
        "current_status": "crowded" if live_q >= c.crowd_threshold else c.current_status,
        "current_queue": live_q,
        "estimated_wait_mins": est_wait,
        "supported_crops": [cc.crop_name for cc in c.crops if cc.is_active],
        "slots": c.slots
    }
