from typing import List, Optional, Any
from pydantic import BaseModel, Field

# Auth schemas
class LoginRequest(BaseModel):
    phone: str
    role: Optional[str] = "farmer" # farmer, operator, admin

class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str
    role: Optional[str] = "farmer"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# Family schemas
class FamilyMemberCreate(BaseModel):
    name: str
    relationship_to_head: str
    phone: str
    device_type: str = "keypad" # keypad, smartphone
    is_authorized: bool = False

class FamilyMemberUpdate(BaseModel):
    name: Optional[str] = None
    relationship_to_head: Optional[str] = None
    phone: Optional[str] = None
    device_type: Optional[str] = None
    is_authorized: Optional[bool] = None

class FamilyMemberOut(BaseModel):
    id: int
    family_id: int
    sub_user_code: str
    name: str
    relationship_to_head: str
    phone: str
    device_type: str
    is_authorized: bool
    aadhaar_masked: str

    class Config:
        from_attributes = True

class FamilyOut(BaseModel):
    id: int
    family_code: str
    primary_user_id: int
    members: List[FamilyMemberOut] = []

    class Config:
        from_attributes = True

# Centre schemas
class CentreCropOut(BaseModel):
    id: int
    crop_name: str
    msp_per_quintal: float
    is_active: bool

    class Config:
        from_attributes = True

class SlotOut(BaseModel):
    id: int
    centre_id: int
    date: str
    time_slot: str
    capacity_tokens: int
    booked_tokens: int
    is_active: bool

    class Config:
        from_attributes = True

class CentreOut(BaseModel):
    id: int
    code: str
    name: str
    location: str
    district: str
    state: str
    distance_km: float
    daily_capacity_quintals: float
    active_counters: int
    avg_processing_time_mins: int
    crowd_threshold: int
    opening_hours: str
    current_status: str
    current_queue: Optional[int] = 0
    estimated_wait_mins: Optional[int] = 0
    supported_crops: List[str] = []
    slots: List[SlotOut] = []

    class Config:
        from_attributes = True

class CentreRecommendation(BaseModel):
    centre: CentreOut
    score: float
    is_recommended: bool
    reason: str
    is_overcrowded: bool
    alternative_centre: Optional[str] = None

# Booking schemas
class BookingCreate(BaseModel):
    centre_id: int
    slot_id: int
    crop_name: str
    quantity_quintals: float
    visiting_member_id: Optional[int] = None # None means Self
    notes: Optional[str] = None

class RescheduleRequest(BaseModel):
    new_slot_id: int
    new_date: Optional[str] = None
    reason: Optional[str] = "Farmer preference"

class BookingOut(BaseModel):
    id: int
    booking_code: str
    farmer_id: int
    farmer_name: Optional[str] = None
    farmer_phone: Optional[str] = None
    family_code: Optional[str] = None
    visiting_member_name: Optional[str] = "Self"
    visiting_member_relationship: Optional[str] = "Self"
    is_representative_authorized: bool = True
    centre_id: int
    centre_name: Optional[str] = None
    slot_id: int
    time_slot: Optional[str] = None
    crop_name: str
    quantity_quintals: float
    booking_date: str
    booking_time: str
    status: str
    token_number: Optional[str] = None
    current_token: Optional[str] = None
    people_ahead: Optional[int] = 0
    estimated_wait_mins: Optional[int] = 0
    payment_status: Optional[str] = "pending"
    total_amount_inr: Optional[float] = 0.0

    class Config:
        from_attributes = True

# Queue schemas
class QueueStatusOut(BaseModel):
    booking_id: int
    booking_code: str
    token_number: str
    token_seq: int
    current_token: str
    current_serving_seq: int
    people_ahead: int
    estimated_wait_mins: int
    active_counters: int
    average_processing_time: int
    centre_name: str
    centre_code: str
    status: str
    is_overcrowded: bool
    last_updated: str

# Procurement status update
class ProcurementUpdateStatus(BaseModel):
    status: str # arrived, verified, quality_checked, weighed, accepted, rejected
    moisture_pct: Optional[float] = None
    foreign_matter_pct: Optional[float] = None
    gross_weight_quintals: Optional[float] = None
    net_weight_quintals: Optional[float] = None
    rejection_reason: Optional[str] = None

# AI schemas
class AIChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en" # en, hi
    booking_id: Optional[int] = None

class AIChatResponse(BaseModel):
    reply: str
    intent: str
    action_taken: Optional[str] = None
    action_result: Optional[Any] = None
    sources: List[str] = []

# IVR schemas
class IVRCallRequest(BaseModel):
    caller_phone: str = "9876543210"
    language: Optional[str] = "hi" # hi, en

class IVRInputRequest(BaseModel):
    session_id: str
    digit: str # 1, 2, 3, 4, 5, 6, *, #
    caller_phone: Optional[str] = "9876543210"

class IVRResponse(BaseModel):
    session_id: str
    spoken_text: str
    screen_display: str
    is_call_active: bool
    sms_sent: Optional[str] = None
    action_triggered: Optional[str] = None

class MissedCallRequest(BaseModel):
    phone: str = "9876543210"
