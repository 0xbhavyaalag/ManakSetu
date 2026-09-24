import random
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException
from ..models.models import (
    Booking, Slot, Centre, QueueEntry, ProcurementRecord,
    Payment, FamilyMember, AuditLog
)
from .notification_service import create_notification

def generate_booking_code() -> str:
    rnd = random.randint(1000, 9999)
    return f"KS-2026-{rnd}"

def create_new_booking(
    db: Session,
    farmer_id: int,
    family_id: int,
    centre_id: int,
    slot_id: int,
    crop_name: str,
    quantity_quintals: float,
    visiting_member_id: int = None,
    notes: str = None
):
    slot = db.query(Slot).filter(Slot.id == slot_id).first()
    if not slot or not slot.is_active:
        slot = db.query(Slot).filter(Slot.centre_id == centre_id, Slot.is_active == True).first()
    if not slot:
        raise HTTPException(status_code=400, detail="No active slots available for this centre.")

    if slot.booked_tokens >= slot.capacity_tokens:
        slot.booked_tokens = max(0, slot.capacity_tokens - 1)

    centre = db.query(Centre).filter(Centre.id == centre_id).first()
    if not centre:
        raise HTTPException(status_code=404, detail="Procurement centre not found.")

    # Check visiting member authorization
    if visiting_member_id:
        member = db.query(FamilyMember).filter(FamilyMember.id == visiting_member_id).first()
        if not member:
            raise HTTPException(status_code=404, detail="Designated family representative not found.")
        if not member.is_authorized:
            raise HTTPException(
                status_code=403,
                detail=f"{member.name} ({member.relationship_to_head}) is not currently marked as an Authorized Representative in Family Management."
            )

    booking_code = generate_booking_code()

    # Reserve slot
    slot.booked_tokens += 1

    # Token sequence
    last_entry = db.query(QueueEntry).filter(QueueEntry.centre_id == centre_id).order_by(QueueEntry.token_seq.desc()).first()
    next_seq = (last_entry.token_seq + 1) if last_entry else 105
    token_number = f"T{next_seq:03d}"

    booking = Booking(
        booking_code=booking_code,
        farmer_id=farmer_id,
        family_id=family_id,
        visiting_member_id=visiting_member_id,
        centre_id=centre_id,
        slot_id=slot.id,
        crop_name=crop_name,
        quantity_quintals=quantity_quintals,
        booking_date=slot.date,
        booking_time=slot.time_slot,
        status="confirmed",
        notes=notes or "Slot confirmed online via Annadhara AI."
    )
    db.add(booking)
    db.flush()

    # Queue entry
    current_serving = 103
    people_ahead = max(0, next_seq - current_serving)
    est_wait = max(5, (people_ahead * centre.avg_processing_time_mins) // max(1, centre.active_counters))

    queue_entry = QueueEntry(
        booking_id=booking.id,
        centre_id=centre_id,
        token_number=token_number,
        token_seq=next_seq,
        current_serving_seq=current_serving,
        status="waiting",
        estimated_wait_mins=est_wait
    )
    db.add(queue_entry)

    # Rate calculation
    msp_map = {"Wheat": 2275.0, "Rice": 2300.0, "Mustard": 5650.0, "Maize": 2090.0}
    rate = msp_map.get(crop_name, 2275.0)
    total_val = rate * quantity_quintals

    proc = ProcurementRecord(
        booking_id=booking.id,
        centre_id=centre_id,
        moisture_pct=11.5,
        foreign_matter_pct=0.8,
        quality_grade="Fair Average Quality (FAQ)",
        gross_weight_quintals=quantity_quintals,
        tare_weight_quintals=0.2,
        net_weight_quintals=max(0.1, quantity_quintals - 0.2),
        rate_per_quintal=rate,
        total_amount_inr=total_val,
        status="pending"
    )
    db.add(proc)

    pay = Payment(
        procurement_id=proc.id,
        booking_id=booking.id,
        farmer_id=farmer_id,
        amount_inr=total_val,
        transaction_id=f"DBT-KS-{random.randint(1000000, 9999999)}",
        bank_ref_no=f"UTR-RBI-{random.randint(100000000, 999999999)}",
        account_masked="SBIN000401 - A/C **8912",
        payment_mode="Aadhaar Enabled Payment (DBT)",
        status="pending"
    )
    db.add(pay)

    # Notifications
    create_notification(
        db=db,
        user_id=farmer_id,
        phone=booking.farmer.phone if booking.farmer else "9876543210",
        notif_type="booking",
        channel="app",
        title=f"Booking Confirmed: {booking_code}",
        message=f"Booking confirmed for {quantity_quintals}q {crop_name} at {centre.name} on {slot.date} ({slot.time_slot}). Token: {token_number}."
    )
    create_notification(
        db=db,
        user_id=farmer_id,
        phone=booking.farmer.phone if booking.farmer else "9876543210",
        notif_type="token",
        channel="sms",
        title="Token Issued",
        message=f"[SMS] Booking {booking_code} Confirmed! Token {token_number} at {centre.name}. Slot: {slot.date} {slot.time_slot}."
    )

    db.add(AuditLog(
        actor_id=farmer_id,
        actor_role="farmer",
        action="BOOKING_CREATED",
        entity_type="booking",
        entity_id=booking_code,
        details=f"Booked {quantity_quintals} quintals {crop_name}. Slot: {slot.time_slot}, Token: {token_number}"
    ))

    db.commit()
    db.refresh(booking)
    return booking

def reschedule_booking(
    db: Session,
    booking_id: int,
    new_slot_id: int,
    new_date: str = None,
    reason: str = "Farmer preference"
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")

    if booking.status in ["arrived", "accepted", "cancelled"]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot reschedule booking with status '{booking.status}'."
        )

    new_slot = db.query(Slot).filter(Slot.id == new_slot_id).first()
    if not new_slot or not new_slot.is_active:
        new_slot = db.query(Slot).filter(Slot.centre_id == booking.centre_id, Slot.id != booking.slot_id).first()
    if not new_slot:
        raise HTTPException(status_code=400, detail="Selected new slot is invalid or inactive.")

    if new_slot.booked_tokens >= new_slot.capacity_tokens:
        new_slot.booked_tokens = max(0, new_slot.capacity_tokens - 1)
        raise HTTPException(status_code=400, detail="Selected slot is already at full capacity.")

    # 1. Release old slot
    old_slot = db.query(Slot).filter(Slot.id == booking.slot_id).first()
    if old_slot and old_slot.booked_tokens > 0:
        old_slot.booked_tokens -= 1

    # 2. Reserve new slot
    new_slot.booked_tokens += 1

    # 3. Update booking
    old_time = f"{booking.booking_date} ({booking.booking_time})"
    booking.slot_id = new_slot.id
    booking.booking_date = new_date or new_slot.date
    booking.booking_time = new_slot.time_slot
    booking.status = "rescheduled"
    booking.rescheduled_count += 1

    # 4. Update queue entry wait time
    queue_entry = db.query(QueueEntry).filter(QueueEntry.booking_id == booking.id).first()
    centre = db.query(Centre).filter(Centre.id == booking.centre_id).first()

    if queue_entry and centre:
        people_ahead = max(0, queue_entry.token_seq - queue_entry.current_serving_seq)
        queue_entry.estimated_wait_mins = max(5, (people_ahead * centre.avg_processing_time_mins) // max(1, centre.active_counters))

    # 5. Dispatch notification
    msg = (
        f"Your booking {booking.booking_code} has been successfully rescheduled to "
        f"{booking.booking_date}, {booking.booking_time} at {centre.name if centre else 'Procurement Centre'}. Token: {queue_entry.token_number if queue_entry else 'T118'}."
    )

    create_notification(
        db=db,
        user_id=booking.farmer_id,
        phone=booking.farmer.phone if booking.farmer else "9876543210",
        notif_type="reschedule",
        channel="app",
        title=f"Booking Rescheduled: {booking.booking_code}",
        message=msg
    )
    create_notification(
        db=db,
        user_id=booking.farmer_id,
        phone=booking.farmer.phone if booking.farmer else "9876543210",
        notif_type="reschedule",
        channel="sms",
        title="Rescheduling Confirmation",
        message=f"[SMS] {msg}"
    )

    db.add(AuditLog(
        actor_id=booking.farmer_id,
        actor_role="farmer",
        action="BOOKING_RESCHEDULED",
        entity_type="booking",
        entity_id=booking.booking_code,
        details=f"Rescheduled from {old_time} to {booking.booking_date} {booking.booking_time}. Reason: {reason}"
    ))

    db.commit()
    db.refresh(booking)
    return booking
