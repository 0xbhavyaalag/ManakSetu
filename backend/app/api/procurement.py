from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import ProcurementRecord, Booking, AuditLog, Payment
from ..schemas.schemas import ProcurementUpdateStatus
from ..services.notification_service import create_notification

router = APIRouter(prefix="/procurement", tags=["Procurement Timeline"])

@router.get("/{booking_id}")
def get_procurement_details(booking_id: int, db: Session = Depends(get_db)):
    proc = db.query(ProcurementRecord).filter(ProcurementRecord.booking_id == booking_id).first()
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")

    stages = [
        {"id": "confirmed", "title": "Booking Confirmed", "completed": True, "active": False},
        {"id": "arrived", "title": "Farmer Arrived", "completed": booking.status in ["arrived", "verified", "quality_checked", "weighed", "accepted"], "active": booking.status == "arrived"},
        {"id": "verified", "title": "Document & Rep Verification", "completed": booking.status in ["verified", "quality_checked", "weighed", "accepted"], "active": booking.status == "verified"},
        {"id": "quality_checked", "title": "Quality Check (FAQ)", "completed": booking.status in ["quality_checked", "weighed", "accepted"], "active": booking.status == "quality_checked"},
        {"id": "weighed", "title": "Weighing Scale", "completed": booking.status in ["weighed", "accepted"], "active": booking.status == "weighed"},
        {"id": "accepted", "title": "Procurement Accepted", "completed": booking.status == "accepted", "active": booking.status == "accepted"},
        {"id": "payment_completed", "title": "Payment Completed", "completed": (booking.payment.status == "paid" if booking.payment else False), "active": (booking.payment.status == "processing" if booking.payment else False)}
    ]

    return {
        "booking_id": booking.id,
        "booking_code": booking.booking_code,
        "crop_name": booking.crop_name,
        "current_status": booking.status,
        "stages": stages,
        "record": {
            "moisture_pct": proc.moisture_pct if proc else 11.5,
            "foreign_matter_pct": proc.foreign_matter_pct if proc else 0.8,
            "quality_grade": proc.quality_grade if proc else "Grade A FAQ",
            "gross_weight": proc.gross_weight_quintals if proc else booking.quantity_quintals,
            "net_weight": proc.net_weight_quintals if proc else (booking.quantity_quintals - 0.2),
            "rate_per_quintal": proc.rate_per_quintal if proc else 2275.0,
            "total_amount_inr": proc.total_amount_inr if proc else (booking.quantity_quintals * 2275.0),
            "rejection_reason": proc.rejection_reason if proc else None
        }
    }

@router.patch("/{booking_id}/status")
def update_procurement_stage(booking_id: int, req: ProcurementUpdateStatus, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")

    proc = db.query(ProcurementRecord).filter(ProcurementRecord.booking_id == booking_id).first()
    booking.status = req.status

    if proc:
        if req.moisture_pct is not None:
            proc.moisture_pct = req.moisture_pct
        if req.foreign_matter_pct is not None:
            proc.foreign_matter_pct = req.foreign_matter_pct
        if req.gross_weight_quintals is not None:
            proc.gross_weight_quintals = req.gross_weight_quintals
            proc.net_weight_quintals = max(0.1, req.gross_weight_quintals - proc.tare_weight_quintals)
            proc.total_amount_inr = proc.net_weight_quintals * proc.rate_per_quintal
        if req.rejection_reason:
            proc.rejection_reason = req.rejection_reason

        proc.status = req.status

    # Trigger notifications
    title_map = {
        "arrived": "Farmer Gate Entry Confirmed",
        "verified": "Representative & Documents Verified",
        "quality_checked": f"Quality Check Passed (Moisture: {proc.moisture_pct if proc else 11.5}%)",
        "weighed": f"Gross Weighing Complete ({proc.net_weight_quintals if proc else 49.8}q Net)",
        "accepted": "Produce Formally Accepted! Payment Initiated.",
        "rejected": "Procurement Rejected Due to Quality Non-Compliance"
    }

    create_notification(
        db=db,
        user_id=booking.farmer_id,
        phone=booking.farmer.phone if booking.farmer else "9876543210",
        notif_type="procurement",
        channel="app",
        title=title_map.get(req.status, f"Procurement Update: {req.status}"),
        message=f"Status for {booking.crop_name} (Booking {booking.booking_code}) changed to '{req.status.upper()}' at {booking.centre.name}."
    )

    db.add(AuditLog(
        actor_id=None,
        actor_role="operator",
        action=f"STAGE_{req.status.upper()}",
        entity_type="procurement",
        entity_id=booking.booking_code,
        details=f"Operator advanced procurement stage to {req.status}."
    ))

    db.commit()
    return {"success": True, "new_status": req.status}
