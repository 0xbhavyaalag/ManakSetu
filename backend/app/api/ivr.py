from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..schemas.schemas import IVRCallRequest, IVRInputRequest, IVRResponse, MissedCallRequest
from ..ivr.ivr_flow import start_ivr_call, handle_ivr_digit, handle_missed_call

router = APIRouter(prefix="/ivr", tags=["Keypad Phone IVR & Missed Call"])

@router.post("/call", response_model=IVRResponse)
def initiate_ivr_call(req: IVRCallRequest):
    return start_ivr_call(caller_phone=req.caller_phone, language=req.language or "hi")

@router.post("/input", response_model=IVRResponse)
def process_dtmf_digit(req: IVRInputRequest, db: Session = Depends(get_db)):
    return handle_ivr_digit(
        db=db,
        session_id=req.session_id,
        digit=req.digit,
        caller_phone=req.caller_phone or "9876543210"
    )

@router.post("/missed-call")
def trigger_missed_call_flow(req: MissedCallRequest, db: Session = Depends(get_db)):
    return handle_missed_call(db=db, phone=req.phone or "9876543210")
