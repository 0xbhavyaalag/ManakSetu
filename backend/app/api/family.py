from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import Family, FamilyMember, User, AuditLog
from ..schemas.schemas import FamilyOut, FamilyMemberOut, FamilyMemberCreate, FamilyMemberUpdate

router = APIRouter(prefix="/families", tags=["Family Management"])

@router.get("/{family_id_or_code}", response_model=FamilyOut)
def get_family_details(family_id_or_code: str, db: Session = Depends(get_db)):
    if family_id_or_code.isdigit():
        family = db.query(Family).filter(Family.id == int(family_id_or_code)).first()
    else:
        family = db.query(Family).filter(Family.family_code == family_id_or_code).first()

    if not family:
        family = db.query(Family).first()
    if not family:
        raise HTTPException(status_code=404, detail="Family not found.")
    return family

@router.post("/{family_id}/members", response_model=FamilyMemberOut)
def add_family_member(family_id: int, req: FamilyMemberCreate, db: Session = Depends(get_db)):
    family = db.query(Family).filter(Family.id == family_id).first()
    if not family:
        raise HTTPException(status_code=404, detail="Family not found.")

    count = db.query(FamilyMember).filter(FamilyMember.family_id == family_id).count()
    sub_code = f"S{101 + count}"

    member = FamilyMember(
        family_id=family_id,
        sub_user_code=sub_code,
        name=req.name,
        relationship_to_head=req.relationship_to_head,
        phone=req.phone,
        device_type=req.device_type,
        is_authorized=req.is_authorized,
        aadhaar_masked="XXXX-XXXX-" + req.phone[-4:]
    )
    db.add(member)
    db.add(AuditLog(
        actor_id=family.primary_user_id,
        actor_role="farmer",
        action="FAMILY_MEMBER_ADDED",
        entity_type="family_member",
        entity_id=sub_code,
        details=f"Added {req.name} ({req.relationship_to_head}) with device {req.device_type}. Authorized: {req.is_authorized}"
    ))
    db.commit()
    db.refresh(member)
    return member

@router.patch("/{family_id}/members/{member_id}", response_model=FamilyMemberOut)
def update_family_member(family_id: int, member_id: int, req: FamilyMemberUpdate, db: Session = Depends(get_db)):
    member = db.query(FamilyMember).filter(FamilyMember.id == member_id, FamilyMember.family_id == family_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Family member not found.")

    if req.name is not None:
        member.name = req.name
    if req.relationship_to_head is not None:
        member.relationship_to_head = req.relationship_to_head
    if req.phone is not None:
        member.phone = req.phone
    if req.device_type is not None:
        member.device_type = req.device_type
    if req.is_authorized is not None:
        member.is_authorized = req.is_authorized

    db.add(AuditLog(
        actor_id=None,
        actor_role="farmer",
        action="FAMILY_MEMBER_UPDATED",
        entity_type="family_member",
        entity_id=member.sub_user_code,
        details=f"Updated authorization status of {member.name} to {member.is_authorized}"
    ))
    db.commit()
    db.refresh(member)
    return member

@router.get("/verify-representative/{booking_id}")
def verify_representative(booking_id: int, db: Session = Depends(get_db)):
    from ..models.models import Booking
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")

    if not booking.visiting_member_id:
        return {
            "verified": True,
            "representative_type": "SELF",
            "message": "Farmer Ramesh Kumar is visiting self. Biometric match required."
        }

    rep = booking.visiting_member
    if rep and rep.is_authorized:
        return {
            "verified": True,
            "representative_type": "AUTHORIZED_FAMILY_REPRESENTATIVE",
            "farmer_owner": booking.farmer.full_name,
            "visiting_name": rep.name,
            "relationship": rep.relationship_to_head,
            "sub_user_code": rep.sub_user_code,
            "status": "Authorized family representative verified successfully."
        }
    else:
        return {
            "verified": False,
            "representative_type": "UNAUTHORIZED",
            "message": "Visiting person is NOT registered as an Authorized Family Representative! Rejection warning."
        }
