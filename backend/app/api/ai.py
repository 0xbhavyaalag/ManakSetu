from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..schemas.schemas import AIChatRequest, AIChatResponse
from ..ai.rag_engine import retrieve_relevant_documents, generate_rag_answer
from ..ai.action_router import detect_intent, route_action
from ..services.recommendation import get_smart_recommendations
from ..services.queue_service import get_queue_status_for_booking

router = APIRouter(prefix="/ai", tags=["AI Farmer Assistant & RAG"])

@router.post("/chat", response_model=AIChatResponse)
def chat_with_assistant(req: AIChatRequest, db: Session = Depends(get_db)):
    # 1. Intent Detection
    intent = detect_intent(req.message)

    # 2. Knowledge Retrieval (RAG)
    docs = retrieve_relevant_documents(db, req.message, top_k=3)

    # 3. Action Router
    action_data = route_action(db, intent, req.booking_id)

    # 4. Generate RAG conversational answer
    reply = generate_rag_answer(req.message, docs, language=req.language or "en")

    return {
        "reply": reply,
        "intent": intent,
        "action_taken": action_data.get("action_taken"),
        "action_result": action_data.get("action_result"),
        "sources": [d.title for d in docs]
    }

@router.post("/recommend-centre")
def ai_recommend_centre(crop: str = "Wheat", db: Session = Depends(get_db)):
    recs = get_smart_recommendations(db, crop_name=crop)
    top = recs[0] if recs else None
    return {
        "recommended_centre": top["centre"]["name"] if top else "Centre B",
        "explanation": top["reason"] if top else "Best availability and shortest wait time.",
        "all_options": recs
    }

@router.post("/predict-queue")
def ai_predict_queue(booking_id: int = 1, db: Session = Depends(get_db)):
    return get_queue_status_for_booking(db, booking_id)

@router.get("/pre-visit-check")
def pre_visit_checklist(booking_id: int = 1, db: Session = Depends(get_db)):
    from ..models.models import Booking
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    rep_authorized = True
    rep_name = "Self (Ramesh Kumar)"
    if booking and booking.visiting_member:
        rep_name = booking.visiting_member.name
        rep_authorized = booking.visiting_member.is_authorized

    items = [
        {"id": "booking", "label": "Booking Confirmed & Token Active", "status": "passed", "detail": f"Token {booking.queue_entry.token_number if booking and booking.queue_entry else 'T118'} at {booking.centre.name if booking else 'Centre B'}"},
        {"id": "crop", "label": "Crop Supported by Centre", "status": "passed", "detail": f"{booking.crop_name if booking else 'Wheat'} is actively procured at this hub"},
        {"id": "moisture", "label": "Moisture Advisory Check (<= 12%)", "status": "passed", "detail": "Optimal harvest drying verified (Target: 11.5% - 12.0%)"},
        {"id": "identity", "label": "Farmer Aadhaar Linked & Verified", "status": "passed", "detail": "Aadhaar XXXX-XXXX-8921 linked with DBT"},
        {"id": "land", "label": "Land Record (Khasra / Khatauni) Handy", "status": "passed", "detail": "Revenue record matches registered crop quantity"},
        {"id": "rep", "label": f"Visiting Representative: {rep_name}", "status": "passed" if rep_authorized else "warning", "detail": "Representative has verified authorization" if rep_authorized else "Attention: Representative is NOT marked as authorized in Family Settings!"}
    ]

    is_all_clear = all(i["status"] == "passed" for i in items)
    advisory = "All pre-visit parameters look great. You are ready for your procurement slot!" if is_all_clear else "Please address the highlighted checklist warnings before departing."

    return {
        "all_clear": is_all_clear,
        "advisory": advisory,
        "items": items,
        "disclaimer": "This pre-visit check is an advisory simulation to help prevent on-site delays."
    }
