from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import QueueEntry, Centre, Booking
from ..schemas.schemas import QueueStatusOut
from ..services.queue_service import get_queue_status_for_booking, advance_centre_queue

router = APIRouter(prefix="/queue", tags=["Queue"])

@router.get("/{booking_id}", response_model=QueueStatusOut)
def get_booking_queue_status(booking_id: int, db: Session = Depends(get_db)):
    status = get_queue_status_for_booking(db, booking_id)
    if not status:
        raise HTTPException(status_code=404, detail="Queue entry for booking not found.")
    return status

@router.get("/centre/{centre_id}")
def get_centre_queue_overview(centre_id: int, db: Session = Depends(get_db)):
    centre = db.query(Centre).filter(Centre.id == centre_id).first()
    if not centre:
        raise HTTPException(status_code=404, detail="Centre not found.")

    entries = db.query(QueueEntry).filter(
        QueueEntry.centre_id == centre_id,
        QueueEntry.status.in_(["waiting", "serving"])
    ).order_by(QueueEntry.token_seq.asc()).all()

    current_entry = next((e for e in entries if e.status == "serving"), entries[0] if entries else None)

    return {
        "centre_id": centre.id,
        "centre_name": centre.name,
        "current_token": current_entry.token_number if current_entry else "T103",
        "current_serving_seq": current_entry.current_serving_seq if current_entry else 103,
        "active_counters": centre.active_counters,
        "total_waiting": len(entries),
        "avg_processing_time": centre.avg_processing_time_mins,
        "is_overcrowded": len(entries) >= centre.crowd_threshold,
        "tokens": [
            {
                "id": e.id,
                "token_number": e.token_number,
                "status": e.status,
                "farmer_name": e.booking.farmer.full_name if e.booking and e.booking.farmer else "Farmer",
                "crop": e.booking.crop_name if e.booking else "Wheat",
                "quantity": e.booking.quantity_quintals if e.booking else 50.0,
                "estimated_wait_mins": e.estimated_wait_mins
            }
            for e in entries[:15]
        ]
    }

@router.post("/centre/{centre_id}/call-next")
def operator_call_next(centre_id: int, db: Session = Depends(get_db)):
    success = advance_centre_queue(db, centre_id)
    if not success:
        raise HTTPException(status_code=400, detail="Could not advance queue for centre.")
    return {"success": True, "message": "Queue advanced successfully. Dispatched SMS alerts."}
