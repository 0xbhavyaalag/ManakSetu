from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import Booking, User, FamilyMember, QueueEntry
from ..schemas.schemas import BookingCreate, BookingOut, RescheduleRequest
from ..services.booking_service import create_new_booking, reschedule_booking

router = APIRouter(prefix="/bookings", tags=["Bookings"])

def serialize_booking(b: Booking, db: Session) -> dict:
    visiting_name = "Self (Ramesh Kumar)"
    visiting_rel = "Self"
    is_auth = True

    if b.visiting_member:
        visiting_name = b.visiting_member.name
        visiting_rel = b.visiting_member.relationship_to_head
        is_auth = b.visiting_member.is_authorized

    q = b.queue_entry
    people_ahead = max(0, q.token_seq - q.current_serving_seq) if q else 0
    est_wait = q.estimated_wait_mins if q else 0

    return {
        "id": b.id,
        "booking_code": b.booking_code,
        "farmer_id": b.farmer_id,
        "farmer_name": b.farmer.full_name if b.farmer else "Ramesh Kumar",
        "farmer_phone": b.farmer.phone if b.farmer else "9876543210",
        "family_code": b.family.family_code if b.family else "F101",
        "visiting_member_name": visiting_name,
        "visiting_member_relationship": visiting_rel,
        "is_representative_authorized": is_auth,
        "centre_id": b.centre_id,
        "centre_name": b.centre.name if b.centre else "Procurement Centre",
        "slot_id": b.slot_id,
        "time_slot": b.booking_time,
        "crop_name": b.crop_name,
        "quantity_quintals": b.quantity_quintals,
        "booking_date": b.booking_date,
        "booking_time": b.booking_time,
        "status": b.status,
        "token_number": q.token_number if q else "T118",
        "current_token": f"T{q.current_serving_seq:03d}" if q else "T103",
        "people_ahead": people_ahead,
        "estimated_wait_mins": est_wait,
        "payment_status": b.payment.status if b.payment else "pending",
        "total_amount_inr": b.payment.amount_inr if b.payment else (b.quantity_quintals * 2275.0)
    }

@router.get("", response_model=List[BookingOut])
def list_bookings(farmer_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Booking)
    if farmer_id:
        query = query.filter(Booking.farmer_id == farmer_id)
    bookings = query.order_by(Booking.id.desc()).all()
    return [serialize_booking(b, db) for b in bookings]

@router.get("/{booking_id}", response_model=BookingOut)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    b = db.query(Booking).filter(Booking.id == booking_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found.")
    return serialize_booking(b, db)

@router.post("", response_model=BookingOut)
def create_booking(req: BookingCreate, db: Session = Depends(get_db)):
    # Default to demo farmer Ramesh Kumar (ID 1) and Family F101
    farmer = db.query(User).filter(User.phone == "9876543210").first()
    farmer_id = farmer.id if farmer else 1

    booking = create_new_booking(
        db=db,
        farmer_id=farmer_id,
        family_id=1,
        centre_id=req.centre_id,
        slot_id=req.slot_id,
        crop_name=req.crop_name,
        quantity_quintals=req.quantity_quintals,
        visiting_member_id=req.visiting_member_id,
        notes=req.notes
    )
    return serialize_booking(booking, db)

@router.patch("/{booking_id}/reschedule", response_model=BookingOut)
def reschedule(booking_id: int, req: RescheduleRequest, db: Session = Depends(get_db)):
    booking = reschedule_booking(
        db=db,
        booking_id=booking_id,
        new_slot_id=req.new_slot_id,
        new_date=req.new_date,
        reason=req.reason
    )
    return serialize_booking(booking, db)

@router.delete("/{booking_id}")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    b = db.query(Booking).filter(Booking.id == booking_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found.")
    b.status = "cancelled"
    if b.slot and b.slot.booked_tokens > 0:
        b.slot.booked_tokens -= 1
    if b.queue_entry:
        b.queue_entry.status = "cancelled"
    db.commit()
    return {"success": True, "message": f"Booking {b.booking_code} cancelled successfully."}
