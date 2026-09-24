from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from ..core.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(30), default="farmer") # farmer, operator, admin
    preferred_lang = Column(String(10), default="hi") # en, hi
    aadhaar_masked = Column(String(20), default="XXXX-XXXX-8921")
    created_at = Column(DateTime(timezone=True), default=utcnow)

    # Relationships
    families = relationship("Family", back_populates="primary_user")
    bookings = relationship("Booking", back_populates="farmer")
    notifications = relationship("Notification", back_populates="user")

class Family(Base):
    __tablename__ = "families"

    id = Column(Integer, primary_key=True, index=True)
    family_code = Column(String(20), unique=True, index=True, nullable=False) # e.g. F101
    primary_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    primary_user = relationship("User", back_populates="families")
    members = relationship("FamilyMember", back_populates="family", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="family")

class FamilyMember(Base):
    __tablename__ = "family_members"

    id = Column(Integer, primary_key=True, index=True)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=False)
    sub_user_code = Column(String(20), index=True, nullable=False) # e.g. S101, S102, S103
    name = Column(String(100), nullable=False)
    relationship_to_head = Column(String(50), nullable=False) # Father, Mother, Son, etc.
    phone = Column(String(20), nullable=False)
    device_type = Column(String(30), default="keypad") # keypad, smartphone
    is_authorized = Column(Boolean, default=False)
    aadhaar_masked = Column(String(20), default="XXXX-XXXX-4512")
    created_at = Column(DateTime(timezone=True), default=utcnow)

    family = relationship("Family", back_populates="members")
    represented_bookings = relationship("Booking", back_populates="visiting_member")

class Centre(Base):
    __tablename__ = "centres"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True, nullable=False) # CENTRE-A, CENTRE-B, CENTRE-C
    name = Column(String(150), nullable=False)
    location = Column(String(200), nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(100), default="Uttar Pradesh")
    distance_km = Column(Float, nullable=False)
    daily_capacity_quintals = Column(Float, default=100.0)
    active_counters = Column(Integer, default=3)
    avg_processing_time_mins = Column(Integer, default=6)
    crowd_threshold = Column(Integer, default=80)
    opening_hours = Column(String(50), default="09:00 AM - 05:00 PM")
    current_status = Column(String(30), default="normal") # normal, crowded, closed
    latitude = Column(Float, default=26.8467)
    longitude = Column(Float, default=80.9462)

    crops = relationship("CentreCrop", back_populates="centre", cascade="all, delete-orphan")
    slots = relationship("Slot", back_populates="centre", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="centre")
    queue_entries = relationship("QueueEntry", back_populates="centre")

class CentreCrop(Base):
    __tablename__ = "centre_crops"

    id = Column(Integer, primary_key=True, index=True)
    centre_id = Column(Integer, ForeignKey("centres.id"), nullable=False)
    crop_name = Column(String(50), nullable=False) # Wheat, Rice, Mustard, Maize
    msp_per_quintal = Column(Float, nullable=False) # e.g. 2275.0 for Wheat
    is_active = Column(Boolean, default=True)

    centre = relationship("Centre", back_populates="crops")

class Slot(Base):
    __tablename__ = "slots"

    id = Column(Integer, primary_key=True, index=True)
    centre_id = Column(Integer, ForeignKey("centres.id"), nullable=False)
    date = Column(String(20), nullable=False) # YYYY-MM-DD or DD Month
    time_slot = Column(String(30), nullable=False) # 10:00 AM, 11:00 AM, 12:00 PM, etc.
    capacity_tokens = Column(Integer, default=20)
    booked_tokens = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    centre = relationship("Centre", back_populates="slots")
    bookings = relationship("Booking", back_populates="slot")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_code = Column(String(30), unique=True, index=True, nullable=False) # KS-2026-1025
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=True)
    visiting_member_id = Column(Integer, ForeignKey("family_members.id"), nullable=True)
    centre_id = Column(Integer, ForeignKey("centres.id"), nullable=False)
    slot_id = Column(Integer, ForeignKey("slots.id"), nullable=False)
    crop_name = Column(String(50), nullable=False)
    quantity_quintals = Column(Float, nullable=False)
    booking_date = Column(String(30), nullable=False)
    booking_time = Column(String(30), nullable=False)
    status = Column(String(40), default="confirmed") # confirmed, rescheduled, arrived, verified, quality_checked, weighed, accepted, rejected, cancelled
    rescheduled_count = Column(Integer, default=0)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    farmer = relationship("User", back_populates="bookings")
    family = relationship("Family", back_populates="bookings")
    visiting_member = relationship("FamilyMember", back_populates="represented_bookings")
    centre = relationship("Centre", back_populates="bookings")
    slot = relationship("Slot", back_populates="bookings")
    queue_entry = relationship("QueueEntry", back_populates="booking", uselist=False)
    procurement_record = relationship("ProcurementRecord", back_populates="booking", uselist=False)
    payment = relationship("Payment", back_populates="booking", uselist=False)

class QueueEntry(Base):
    __tablename__ = "queue_entries"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), unique=True, nullable=False)
    centre_id = Column(Integer, ForeignKey("centres.id"), nullable=False)
    token_number = Column(String(20), index=True, nullable=False) # e.g. T118
    token_seq = Column(Integer, nullable=False) # numeric 118
    current_serving_seq = Column(Integer, default=103)
    status = Column(String(30), default="waiting") # waiting, serving, completed, skipped
    estimated_wait_mins = Column(Integer, default=42)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    booking = relationship("Booking", back_populates="queue_entry")
    centre = relationship("Centre", back_populates="queue_entries")

class ProcurementRecord(Base):
    __tablename__ = "procurement_records"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), unique=True, nullable=False)
    centre_id = Column(Integer, ForeignKey("centres.id"), nullable=False)
    verified_by_operator_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    representative_verified = Column(Boolean, default=True)
    moisture_pct = Column(Float, default=11.5)
    foreign_matter_pct = Column(Float, default=0.8)
    quality_grade = Column(String(30), default="Grade A - Fair Average Quality (FAQ)")
    gross_weight_quintals = Column(Float, default=50.0)
    tare_weight_quintals = Column(Float, default=0.2)
    net_weight_quintals = Column(Float, default=49.8)
    rate_per_quintal = Column(Float, default=2275.0)
    total_amount_inr = Column(Float, default=113295.0)
    status = Column(String(30), default="pending") # pending, verified, quality_passed, weighed, accepted, rejected
    rejection_reason = Column(Text, nullable=True)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    booking = relationship("Booking", back_populates="procurement_record")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    procurement_id = Column(Integer, ForeignKey("procurement_records.id"), nullable=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), unique=True, nullable=False)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount_inr = Column(Float, nullable=False)
    transaction_id = Column(String(50), unique=True, index=True, nullable=False) # DBT-KS-9082341
    bank_ref_no = Column(String(50), default="UTR-RBI-882910394")
    account_masked = Column(String(30), default="SBIN000401 - A/C **8912")
    payment_mode = Column(String(30), default="Aadhaar Enabled Payment (DBT)")
    status = Column(String(30), default="pending") # pending, processing, paid, failed
    paid_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    booking = relationship("Booking", back_populates="payment")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    phone = Column(String(20), nullable=False)
    notif_type = Column(String(30), default="booking") # booking, token, queue, reschedule, procurement, payment, alert
    channel = Column(String(20), default="app") # app, sms, voice
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    user = relationship("User", back_populates="notifications")

class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), nullable=False) # rules, documents, msp, centres, quality, faq
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    tags = Column(String(200), nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer, nullable=True)
    actor_role = Column(String(50), nullable=False)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(50), nullable=True)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime(timezone=True), default=utcnow)
