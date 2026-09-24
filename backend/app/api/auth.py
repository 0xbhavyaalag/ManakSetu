from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import create_access_token, decode_token
from ..models.models import User, Family
from ..schemas.schemas import LoginRequest, VerifyOTPRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login")
def request_login_otp(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == req.phone).first()
    if not user:
        # Create user on the fly if new farmer
        user = User(
            phone=req.phone,
            full_name="Kisan " + req.phone[-4:],
            role=req.role or "farmer",
            preferred_lang="hi"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Create default family
        family = Family(family_code=f"F{user.id + 100}", primary_user_id=user.id)
        db.add(family)
        db.commit()

    return {
        "success": True,
        "message": f"OTP sent to {req.phone}. (Demo OTP: 123456)",
        "mock_otp": "123456",
        "phone": req.phone
    }

@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    # Standard demo OTP or any 6-digit OTP
    if req.otp not in ["123456", "000000", "999999"]:
        raise HTTPException(status_code=400, detail="Invalid OTP. For demo, use 123456.")

    user = db.query(User).filter(User.phone == req.phone).first()
    if not user:
        user = User(phone=req.phone, full_name="Kisan User", role=req.role or "farmer")
        db.add(user)
        db.commit()
        db.refresh(user)

    # Optional role override for operator/admin quick test
    if req.role and req.role != user.role:
        user.role = req.role
        db.commit()

    token = create_access_token(subject=user.id, role=user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "phone": user.phone,
            "full_name": user.full_name,
            "role": user.role,
            "preferred_lang": user.preferred_lang,
            "aadhaar_masked": user.aadhaar_masked
        }
    }

@router.get("/me")
def get_current_user_profile(token: str = None, db: Session = Depends(get_db)):
    # Return default Ramesh Kumar demo farmer if token empty
    user = db.query(User).filter(User.phone == "9876543210").first()
    return {
        "id": user.id if user else 1,
        "phone": user.phone if user else "9876543210",
        "full_name": user.full_name if user else "Ramesh Kumar",
        "role": user.role if user else "farmer",
        "family_code": "F101",
        "preferred_lang": user.preferred_lang if user else "hi"
    }
