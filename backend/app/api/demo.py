from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db, Base, engine
from ..services.seed_data import init_seed_data
from ..models.models import Booking, QueueEntry, ProcurementRecord, Payment, Slot

router = APIRouter(prefix="/demo", tags=["Demo Simulation Mode"])

@router.post("/reset")
def reset_demo_database(db: Session = Depends(get_db)):
    # Drop all and re-seed clean SIH demo state
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    init_seed_data(db)
    return {
        "success": True,
        "message": "Annadhara AI demo database reset to default pristine SIH 2026 state."
    }

@router.post("/step/{step_number}")
def execute_demo_step(step_number: int, db: Session = Depends(get_db)):
    # Helper to advance demo states programmatically
    booking = db.query(Booking).filter(Booking.id == 1).first()
    if not booking:
        init_seed_data(db)
        booking = db.query(Booking).filter(Booking.id == 1).first()

    step_info = {"step": step_number, "action": "", "description": ""}

    if step_number in [1, 2, 3]:
        step_info["action"] = "FARMER_CONTEXT_LOADED"
        step_info["description"] = "Farmer Ramesh Kumar (F101) & Rahul Kumar (Authorized Son) verified."

    elif step_number == 11:
        # Dynamic Reschedule
        new_slot = db.query(Slot).filter(Slot.centre_id == 2, Slot.time_slot == "02:00 PM").first()
        if new_slot:
            booking.slot_id = new_slot.id
            booking.booking_time = "02:00 PM"
            booking.status = "rescheduled"
            db.commit()
        step_info["action"] = "RESCHEDULED"
        step_info["description"] = "Booking KS-2026-1025 rescheduled to 02:00 PM."

    elif step_number == 14:
        # Mark arrived
        booking.status = "arrived"
        db.commit()
        step_info["action"] = "ARRIVED"
        step_info["description"] = "Farmer marked as Arrived at Centre B gate."

    elif step_number == 15:
        # Quality check passed
        booking.status = "quality_checked"
        if booking.procurement_record:
            booking.procurement_record.status = "quality_passed"
            booking.procurement_record.moisture_pct = 11.2
        db.commit()
        step_info["action"] = "QUALITY_CHECK_COMPLETED"
        step_info["description"] = "FAQ Quality inspection completed (Moisture: 11.2% - Passed)."

    elif step_number == 16:
        # Weighing complete
        booking.status = "weighed"
        if booking.procurement_record:
            booking.procurement_record.status = "weighed"
            booking.procurement_record.net_weight_quintals = 49.8
            booking.procurement_record.total_amount_inr = 113295.0
        db.commit()
        step_info["action"] = "WEIGHING_COMPLETED"
        step_info["description"] = "Weighbridge gross weight measured. Net: 49.8 Quintals."

    elif step_number == 17:
        # Accept procurement
        booking.status = "accepted"
        if booking.procurement_record:
            booking.procurement_record.status = "accepted"
        db.commit()
        step_info["action"] = "PROCUREMENT_ACCEPTED"
        step_info["description"] = "Procurement formally accepted by Mandi Operator."

    elif step_number in [18, 19, 20]:
        # Payment released
        booking.status = "accepted"
        if booking.payment:
            booking.payment.status = "paid"
        db.commit()
        step_info["action"] = "PAYMENT_RELEASED"
        step_info["description"] = "DBT Payment of ₹1,13,295 credited directly to farmer account via Aadhaar."

    return {
        "success": True,
        "step": step_number,
        "step_info": step_info,
        "booking_status": booking.status if booking else "confirmed",
        "payment_status": booking.payment.status if (booking and booking.payment) else "pending"
    }
