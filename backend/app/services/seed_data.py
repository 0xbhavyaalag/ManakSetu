from sqlalchemy.orm import Session
from ..models.models import (
    User, Family, FamilyMember, Centre, CentreCrop, Slot,
    Booking, QueueEntry, ProcurementRecord, Payment,
    Notification, KnowledgeDocument, AuditLog
)

def init_seed_data(db: Session):
    # Check if already seeded
    if db.query(User).filter(User.phone == "9876543210").first():
        return

    # 1. Users
    ramesh = User(
        phone="9876543210",
        full_name="Ramesh Kumar",
        role="farmer",
        preferred_lang="hi",
        aadhaar_masked="XXXX-XXXX-8921"
    )
    db.add(ramesh)

    rahul_user = User(
        phone="9876543211",
        full_name="Rahul Kumar",
        role="farmer",
        preferred_lang="en",
        aadhaar_masked="XXXX-XXXX-3342"
    )
    db.add(rahul_user)

    operator = User(
        phone="9876500001",
        full_name="Surendra Singh",
        role="operator",
        preferred_lang="en",
        aadhaar_masked="XXXX-XXXX-9901"
    )
    db.add(operator)

    admin = User(
        phone="9876500002",
        full_name="Dr. Rajesh Sharma (Mandi Supv)",
        role="admin",
        preferred_lang="en",
        aadhaar_masked="XXXX-XXXX-1122"
    )
    db.add(admin)
    db.commit()

    # 2. Family F101
    family = Family(
        family_code="F101",
        primary_user_id=ramesh.id
    )
    db.add(family)
    db.commit()

    # 3. Family Members
    m_father = FamilyMember(
        family_id=family.id,
        sub_user_code="S101",
        name="Ramesh Kumar",
        relationship_to_head="Father",
        phone="9876543210",
        device_type="keypad",
        is_authorized=True,
        aadhaar_masked="XXXX-XXXX-8921"
    )
    m_mother = FamilyMember(
        family_id=family.id,
        sub_user_code="S102",
        name="Sunita Devi",
        relationship_to_head="Mother",
        phone="9876543212",
        device_type="keypad",
        is_authorized=False,
        aadhaar_masked="XXXX-XXXX-7140"
    )
    m_son = FamilyMember(
        family_id=family.id,
        sub_user_code="S103",
        name="Rahul Kumar",
        relationship_to_head="Son",
        phone="9876543211",
        device_type="smartphone",
        is_authorized=True,
        aadhaar_masked="XXXX-XXXX-3342"
    )
    db.add_all([m_father, m_mother, m_son])
    db.commit()

    # 4. Centres (Centre A, Centre B, Centre C)
    centre_a = Centre(
        code="CENTRE-A",
        name="Centre A - Kisan Mandi East",
        location="Sector 4, Krishi Vihar, East Hub",
        district="Varanasi",
        distance_km=5.0,
        daily_capacity_quintals=100.0,
        active_counters=2,
        avg_processing_time_mins=7,
        crowd_threshold=80,
        opening_hours="09:00 AM - 05:00 PM",
        current_status="normal"
    )
    centre_b = Centre(
        code="CENTRE-B",
        name="Centre B - Annadhara Model Hub",
        location="NH-28 Bypass, Modern Agri Terminal",
        district="Varanasi",
        distance_km=7.0,
        daily_capacity_quintals=100.0,
        active_counters=3,
        avg_processing_time_mins=6,
        crowd_threshold=80,
        opening_hours="08:30 AM - 05:30 PM",
        current_status="normal"
    )
    centre_c = Centre(
        code="CENTRE-C",
        name="Centre C - APMC Yard South",
        location="Industrial Area Phase 2, South Gate",
        district="Varanasi",
        distance_km=10.0,
        daily_capacity_quintals=100.0,
        active_counters=2,
        avg_processing_time_mins=7,
        crowd_threshold=80,
        opening_hours="09:00 AM - 04:30 PM",
        current_status="crowded"
    )
    db.add_all([centre_a, centre_b, centre_c])
    db.commit()

    # 5. Centre Crops
    crops_info = [
        ("Wheat", 2275.0),
        ("Rice", 2300.0),
        ("Mustard", 5650.0),
        ("Maize", 2090.0)
    ]
    for c in [centre_a, centre_b, centre_c]:
        for crop_name, msp in crops_info:
            db.add(CentreCrop(centre_id=c.id, crop_name=crop_name, msp_per_quintal=msp, is_active=True))
    db.commit()

    # 6. Slots for today & tomorrow
    time_slots = ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM"]
    dates = ["24 September", "25 September"]
    created_slots = {}
    for c in [centre_a, centre_b, centre_c]:
        for d in dates:
            for ts in time_slots:
                booked = 8 if c == centre_b else (18 if c == centre_c else 12)
                slot = Slot(
                    centre_id=c.id,
                    date=d,
                    time_slot=ts,
                    capacity_tokens=20,
                    booked_tokens=booked,
                    is_active=True
                )
                db.add(slot)
                db.flush()
                created_slots[f"{c.code}_{d}_{ts}"] = slot
    db.commit()

    # 7. Demo Active Booking for Ramesh Kumar
    # Centre B, 24 September, 11:00 AM
    b_slot = created_slots.get("CENTRE-B_24 September_11:00 AM")
    booking = Booking(
        booking_code="KS-2026-1025",
        farmer_id=ramesh.id,
        family_id=family.id,
        visiting_member_id=m_son.id, # Rahul Kumar is visiting
        centre_id=centre_b.id,
        slot_id=b_slot.id,
        crop_name="Wheat",
        quantity_quintals=50.0,
        booking_date="24 September",
        booking_time="11:00 AM",
        status="confirmed",
        notes="Pre-visit checks completed. Rahul authorized as representative."
    )
    db.add(booking)
    db.commit()

    # 8. Queue Entry
    # Token T118, Current serving T103, 15 ahead -> estimated wait = 15 * 6 / 3 = 30-42 mins
    queue = QueueEntry(
        booking_id=booking.id,
        centre_id=centre_b.id,
        token_number="T118",
        token_seq=118,
        current_serving_seq=103,
        status="waiting",
        estimated_wait_mins=42
    )
    db.add(queue)

    # 9. Procurement Record
    proc = ProcurementRecord(
        booking_id=booking.id,
        centre_id=centre_b.id,
        verified_by_operator_id=operator.id,
        representative_verified=True,
        moisture_pct=11.5, # within <= 12% limit
        foreign_matter_pct=0.8,
        quality_grade="Grade A - Fair Average Quality (FAQ)",
        gross_weight_quintals=50.0,
        tare_weight_quintals=0.2,
        net_weight_quintals=49.8,
        rate_per_quintal=2275.0,
        total_amount_inr=113295.0,
        status="pending"
    )
    db.add(proc)

    # 10. Payment Record
    pay = Payment(
        procurement_id=proc.id,
        booking_id=booking.id,
        farmer_id=ramesh.id,
        amount_inr=113295.0,
        transaction_id="DBT-KS-9082341",
        bank_ref_no="UTR-RBI-882910394",
        account_masked="SBIN000401 - A/C **8912",
        payment_mode="Aadhaar Enabled Payment (DBT)",
        status="pending"
    )
    db.add(pay)

    # 11. Initial Notifications
    notifs = [
        Notification(
            user_id=ramesh.id,
            phone=ramesh.phone,
            notif_type="booking",
            channel="app",
            title="Booking Confirmed: KS-2026-1025",
            message="Your Wheat procurement booking at Centre B for 24 September, 11:00 AM is confirmed. Token T118 generated."
        ),
        Notification(
            user_id=ramesh.id,
            phone=ramesh.phone,
            notif_type="token",
            channel="sms",
            title="Annadhara Token Alert",
            message="[SMS] Namaste Ramesh ji. Token T118 at Centre B. People ahead: 15. Estimated wait: 42 mins. Representative: Rahul Kumar."
        ),
        Notification(
            user_id=ramesh.id,
            phone=ramesh.phone,
            notif_type="alert",
            channel="app",
            title="Pre-Visit Quality Advisory",
            message="Keep Wheat moisture below 12% to prevent rejection. Ensure Aadhaar & Khatauni land records are handy."
        )
    ]
    db.add_all(notifs)

    # 12. Knowledge Documents for RAG
    k_docs = [
        KnowledgeDocument(
            category="rules",
            title="Procurement Timings & Token Guidelines",
            content="Procurement centres operate between 08:30 AM and 05:30 PM. Farmers are advised to arrive 15 minutes before their scheduled slot. Tokens are valid for the booked date only.",
            tags="timings, token, guidelines, rules"
        ),
        KnowledgeDocument(
            category="documents",
            title="Mandatory Documents Checklist for Centre Visit",
            content="Farmers must carry: 1. Aadhaar Card of Farmer, 2. Land Records (Khasra / Khatauni) showing crop acreage, 3. Bank Account Passbook copy linked to Aadhaar for DBT, 4. If visiting through an Authorized Family Representative, the representative's Aadhaar and authorization slip from the Annadhara portal.",
            tags="documents, aadhaar, khasra, bank, representative, kyc"
        ),
        KnowledgeDocument(
            category="quality",
            title="Fair Average Quality (FAQ) & Moisture Limits",
            content="For Wheat: Maximum permissible moisture is 12.0%. Foreign matter must not exceed 1.0%. Grain damaged/shrivelled must be under 3.0%. For Rice: Moisture limit is 14.0%. Exceeding moisture limits will cause automated rejection at the Quality Check counter.",
            tags="moisture, quality, wheat, rice, rejection, standards"
        ),
        KnowledgeDocument(
            category="centres",
            title="Procurement Centres Overview & Capacities",
            content="Centre A (Kisan Mandi East, 5 km) has 2 counters and 48 waiting tokens. Centre B (Annadhara Model Hub, 7 km) has 3 active counters, modern digital weighbridges, and only 15 waiting tokens. Centre C (APMC Yard South, 10 km) is currently overcrowded with 85+ tokens.",
            tags="centres, centre a, centre b, centre c, waiting time, capacity"
        ),
        KnowledgeDocument(
            category="msp",
            title="Minimum Support Price (MSP) Rates 2026-27",
            content="Government declared MSP rates: Wheat: Rs 2,275 per quintal. Rice (Common): Rs 2,300 per quintal. Mustard: Rs 5,650 per quintal. Maize: Rs 2,090 per quintal. Payments are disbursed directly to the farmer's bank account via Aadhaar DBT within 48 to 72 hours of acceptance.",
            tags="msp, price, wheat, rice, mustard, maize, rate"
        ),
        KnowledgeDocument(
            category="rescheduling",
            title="Rescheduling & Cancellation Rules",
            content="Farmers can dynamically reschedule their slot up to 2 hours before the scheduled time free of charge. Rescheduling releases the old slot immediately for other farmers and assigns a priority queue slot in the new window.",
            tags="reschedule, slot, change, cancellation"
        ),
        KnowledgeDocument(
            category="family",
            title="Authorized Family Representative Guidelines",
            content="A registered farmer can authorize blood relatives (Father, Mother, Son, Spouse, Daughter) via Family Management. Unregistered or unauthorized individuals are not permitted to deliver produce on behalf of the farmer.",
            tags="family, representative, authorization, subuser, relative"
        )
    ]
    db.add_all(k_docs)

    # 13. Audit Log
    db.add(AuditLog(
        actor_id=ramesh.id,
        actor_role="farmer",
        action="BOOKING_CREATED",
        entity_type="booking",
        entity_id=booking.booking_code,
        details="Booking created for 50 quintals Wheat at Centre B with Rahul Kumar as visiting representative."
    ))
    db.commit()
