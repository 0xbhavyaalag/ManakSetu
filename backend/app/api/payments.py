from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import Payment, Booking, AuditLog
from ..services.notification_service import create_notification

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.get("/{booking_id}")
def get_payment_details(booking_id: int, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.booking_id == booking_id).first()
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")

    if not payment:
        amount = booking.quantity_quintals * 2275.0
        payment = Payment(
            booking_id=booking.id,
            farmer_id=booking.farmer_id,
            amount_inr=amount,
            transaction_id="DBT-KS-9082341",
            bank_ref_no="UTR-RBI-882910394",
            account_masked="SBIN000401 - A/C **8912",
            status="pending"
        )
        db.add(payment)
        db.commit()
        db.refresh(payment)

    return {
        "id": payment.id,
        "booking_id": booking.id,
        "booking_code": booking.booking_code,
        "crop_name": booking.crop_name,
        "quantity_quintals": booking.quantity_quintals,
        "amount_inr": payment.amount_inr,
        "status": payment.status,
        "transaction_id": payment.transaction_id,
        "bank_ref_no": payment.bank_ref_no,
        "account_masked": payment.account_masked,
        "payment_mode": payment.payment_mode,
        "paid_at": payment.paid_at.isoformat() if payment.paid_at else None
    }

@router.patch("/{booking_id}/release")
def release_payment(booking_id: int, status: str = "paid", db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.booking_id == booking_id).first()
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not payment or not booking:
        raise HTTPException(status_code=404, detail="Payment record not found.")

    payment.status = status
    if status == "paid":
        payment.paid_at = datetime.now(timezone.utc)
        booking.status = "accepted"

        create_notification(
            db=db,
            user_id=booking.farmer_id,
            phone=booking.farmer.phone if booking.farmer else "9876543210",
            notif_type="payment",
            channel="app",
            title="DBT Payment Successful!",
            message=f"₹{int(payment.amount_inr):,} credited to your bank account via DBT. Ref: {payment.transaction_id}."
        )
        create_notification(
            db=db,
            user_id=booking.farmer_id,
            phone=booking.farmer.phone if booking.farmer else "9876543210",
            notif_type="payment",
            channel="sms",
            title="Annadhara Payment Credit Alert",
            message=f"[SMS] Dear Kisan, Rs {int(payment.amount_inr):,} has been credited to A/C **8912 for Wheat procurement. UTR: {payment.bank_ref_no}."
        )

        db.add(AuditLog(
            actor_id=None,
            actor_role="admin",
            action="PAYMENT_RELEASED",
            entity_type="payment",
            entity_id=payment.transaction_id,
            details=f"DBT Payment of INR {payment.amount_inr} marked as {status}."
        ))

    db.commit()
    return {"success": True, "status": payment.status, "transaction_id": payment.transaction_id}
