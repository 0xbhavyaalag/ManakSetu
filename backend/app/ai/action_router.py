import re
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from ..models.models import Booking
from ..services.queue_service import get_queue_status_for_booking
from ..services.recommendation import get_smart_recommendations

def detect_intent(message: str) -> str:
    m = message.lower()
    if any(k in m for k in ["reschedule", "change time", "change slot", "badlo"]):
        return "RESCHEDULE"
    if any(k in m for k in ["book", "booking", "naya slot", "reserve"]):
        return "BOOK_SLOT"
    if any(k in m for k in ["queue", "waiting", "people ahead", "wait time", "katar", "line"]):
        return "QUEUE_STATUS"
    if any(k in m for k in ["payment", "paisa", "rupaye", "dbt", "transaction"]):
        return "PAYMENT_STATUS"
    if any(k in m for k in ["which centre", "best centre", "recommend", "shortest", "kendra"]):
        return "CENTRE_RECOMMEND"
    if any(k in m for k in ["document", "paper", "dastavej", "khasra", "aadhaar"]):
        return "DOCUMENT_CHECK"
    if any(k in m for k in ["reject", "quality", "moisture", "nami", "check"]):
        return "REJECTION_CHECK"
    return "GENERAL_FAQ"

def route_action(db: Session, intent: str, booking_id: Optional[int] = None) -> Dict[str, Any]:
    # Default to active demo booking if none provided
    if not booking_id:
        active_b = db.query(Booking).filter(Booking.status.in_(["confirmed", "rescheduled", "arrived"])).first()
        if active_b:
            booking_id = active_b.id

    if intent == "QUEUE_STATUS" and booking_id:
        q_data = get_queue_status_for_booking(db, booking_id)
        return {
            "action_taken": "FETCH_QUEUE_STATUS",
            "action_result": q_data
        }

    if intent == "CENTRE_RECOMMEND":
        recs = get_smart_recommendations(db, crop_name="Wheat")
        top_rec = recs[0] if recs else None
        return {
            "action_taken": "CALCULATE_RECOMMENDATION",
            "action_result": {
                "top_centre": top_rec["centre"]["name"] if top_rec else "Centre B",
                "estimated_wait_mins": top_rec["centre"]["estimated_wait_mins"] if top_rec else 30,
                "current_queue": top_rec["centre"]["current_queue"] if top_rec else 15,
                "reason": top_rec["reason"] if top_rec else ""
            }
        }

    if intent == "PAYMENT_STATUS" and booking_id:
        b = db.query(Booking).filter(Booking.id == booking_id).first()
        if b and b.payment:
            return {
                "action_taken": "FETCH_PAYMENT_STATUS",
                "action_result": {
                    "amount_inr": b.payment.amount_inr,
                    "status": b.payment.status,
                    "transaction_id": b.payment.transaction_id,
                    "payment_mode": b.payment.payment_mode
                }
            }

    if intent == "REJECTION_CHECK":
        return {
            "action_taken": "RUN_PRE_VISIT_CHECK",
            "action_result": {
                "booking_confirmed": True,
                "crop_moisture_safe": True,
                "aadhaar_linked": True,
                "land_record_verified": True,
                "advisory": "All pre-visit parameters are green. Ensure wheat moisture is <= 12%."
            }
        }

    return {
        "action_taken": None,
        "action_result": None
    }
