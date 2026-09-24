from datetime import datetime, timezone
from sqlalchemy.orm import Session
from ..models.models import QueueEntry, Booking, Centre, Notification, AuditLog
from .notification_service import create_notification

def get_queue_status_for_booking(db: Session, booking_id: int):
    entry = db.query(QueueEntry).filter(QueueEntry.booking_id == booking_id).first()
    if not entry:
        return None

    centre = db.query(Centre).filter(Centre.id == entry.centre_id).first()
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    people_ahead = max(0, entry.token_seq - entry.current_serving_seq)
    avg_time = centre.avg_processing_time_mins if centre else 6
    counters = centre.active_counters if centre and centre.active_counters > 0 else 3
    est_wait = max(5, (people_ahead * avg_time) // counters) if people_ahead > 0 else 0

    return {
        "booking_id": booking.id,
        "booking_code": booking.booking_code,
        "token_number": entry.token_number,
        "token_seq": entry.token_seq,
        "current_token": f"T{entry.current_serving_seq:03d}",
        "current_serving_seq": entry.current_serving_seq,
        "people_ahead": people_ahead,
        "estimated_wait_mins": est_wait,
        "active_counters": counters,
        "average_processing_time": avg_time,
        "centre_name": centre.name if centre else "Procurement Centre",
        "centre_code": centre.code if centre else "",
        "status": entry.status,
        "is_overcrowded": people_ahead >= (centre.crowd_threshold if centre else 80),
        "last_updated": "Just now"
    }

def advance_centre_queue(db: Session, centre_id: int):
    centre = db.query(Centre).filter(Centre.id == centre_id).first()
    if not centre:
        return None

    # Advance all queue entries for this centre
    entries = db.query(QueueEntry).filter(
        QueueEntry.centre_id == centre_id,
        QueueEntry.status == "waiting"
    ).all()

    for entry in entries:
        entry.current_serving_seq += 1
        people_ahead = max(0, entry.token_seq - entry.current_serving_seq)
        if people_ahead == 0:
            entry.status = "serving"
            entry.estimated_wait_mins = 0
            # Send immediate alert
            create_notification(
                db=db,
                user_id=entry.booking.farmer_id if entry.booking else None,
                phone=entry.booking.farmer.phone if (entry.booking and entry.booking.farmer) else "9876543210",
                notif_type="queue",
                channel="sms",
                title="Your Token is Being Served Now!",
                message=f"[SMS] Token {entry.token_number}: Please report immediately to Counter {centre.active_counters} at {centre.name}."
            )
        else:
            entry.estimated_wait_mins = max(5, (people_ahead * centre.avg_processing_time_mins) // max(1, centre.active_counters))

    cur_seq = entries[0].current_serving_seq if entries else 0
    db.add(AuditLog(
        actor_id=None,
        actor_role="operator",
        action="CALL_NEXT_TOKEN",
        entity_type="centre_queue",
        entity_id=str(centre_id),
        details=f"Centre {centre.name} advanced queue. Current serving: T{cur_seq:03d}"
    ))
    db.commit()
    return True
