import uuid
from typing import Dict, Any
from sqlalchemy.orm import Session
from ..models.models import Booking, QueueEntry, Centre, Slot, User
from ..services.booking_service import create_new_booking, reschedule_booking
from ..services.queue_service import get_queue_status_for_booking
from ..services.notification_service import create_notification

# In-memory IVR state tracking
IVR_SESSIONS: Dict[str, Dict[str, Any]] = {}

def start_ivr_call(caller_phone: str = "9876543210", language: str = "hi") -> Dict[str, Any]:
    session_id = str(uuid.uuid4())[:8]
    IVR_SESSIONS[session_id] = {
        "state": "MAIN_MENU",
        "caller_phone": caller_phone,
        "language": language,
        "temp_data": {}
    }

    if language == "hi":
        spoken = (
            "नमस्ते! अन्नधारा में आपका स्वागत है। "
            "नयी खरीद बुकिंग के लिए 1 दबाएं। "
            "बुकिंग स्थिति जानने के लिए 2 दबाएं। "
            "लाइव कतार स्थिति के लिए 3 दबाएं। "
            "बुकिंग पुनर्निर्धारण (Reschedule) के लिए 4 दबाएं। "
            "भुगतान स्थिति के लिए 5 दबाएं। "
            "किसान सहायता केंद्र के लिए 6 दबाएं।"
        )
        display = "ANNADHARA IVR\n1: Book\n2: Status\n3: Queue\n4: Resched\n5: Pay\n6: Help"
    else:
        spoken = (
            "Welcome to Annadhara Intelligent Procurement. "
            "Press 1 for new booking. "
            "Press 2 for booking status. "
            "Press 3 for live queue tracking. "
            "Press 4 to reschedule your booking. "
            "Press 5 for payment status. "
            "Press 6 for farmer support helpline."
        )
        display = "ANNADHARA IVR\n1: Book\n2: Status\n3: Queue\n4: Resched\n5: Pay\n6: Help"

    return {
        "session_id": session_id,
        "spoken_text": spoken,
        "screen_display": display,
        "is_call_active": True,
        "sms_sent": None
    }

def handle_ivr_digit(db: Session, session_id: str, digit: str, caller_phone: str = "9876543210") -> Dict[str, Any]:
    session = IVR_SESSIONS.get(session_id)
    if not session:
        # Auto restart if session expired
        res = start_ivr_call(caller_phone)
        session = IVR_SESSIONS[res["session_id"]]
        session_id = res["session_id"]

    state = session.get("state", "MAIN_MENU")
    lang = session.get("language", "hi")

    # Global Keys
    if digit == "#":
        session["state"] = "CALL_ENDED"
        return {
            "session_id": session_id,
            "spoken_text": "अन्नधारा से जुड़ने के लिए धन्यवाद। आपका दिन शुभ हो।" if lang == "hi" else "Thank you for using Annadhara. Have a safe journey.",
            "screen_display": "CALL ENDED\nDhanyawad!",
            "is_call_active": False,
            "sms_sent": None
        }

    if digit == "*":
        session["state"] = "MAIN_MENU"
        return {
            "session_id": session_id,
            "spoken_text": "मुख्य मेनू। बुकिंग के लिए 1, स्थिति के लिए 2, कतार के लिए 3, रीशेड्यूल के लिए 4 दबाएं।" if lang == "hi" else "Main Menu. 1: Book, 2: Status, 3: Queue, 4: Reschedule.",
            "screen_display": "ANNADHARA IVR\n1: Book 2: Status\n3: Queue 4: Resched",
            "is_call_active": True,
            "sms_sent": None
        }

    # Fetch demo farmer
    farmer = db.query(User).filter(User.phone == caller_phone).first()
    farmer_id = farmer.id if farmer else 1

    # 1. MAIN MENU
    if state == "MAIN_MENU":
        if digit == "1":
            session["state"] = "BOOKING_CROP_SELECT"
            return {
                "session_id": session_id,
                "spoken_text": "गेहूं (Wheat) बेचने के लिए 1 दबाएं। धान (Rice) के लिए 2 दबाएं।" if lang == "hi" else "Press 1 for Wheat. Press 2 for Rice.",
                "screen_display": "SELECT CROP:\n1: Wheat (2275)\n2: Rice (2300)",
                "is_call_active": True,
                "sms_sent": None
            }

        elif digit == "2":
            # Booking status
            b = db.query(Booking).filter(Booking.farmer_id == farmer_id).order_by(Booking.id.desc()).first()
            if b:
                spoken = (
                    f"आपकी सक्रिय बुकिंग {b.booking_code} है। "
                    f"केंद्र: {b.centre.name}। तारीख: {b.booking_date}, समय: {b.booking_time}। "
                    f"स्थिति: {b.status}।"
                )
                display = f"BOOKING INFO\n{b.booking_code}\n{b.centre.name[:12]}\n{b.booking_time}"
            else:
                spoken = "आपके नंबर पर कोई सक्रिय बुकिंग नहीं पाई गई।"
                display = "NO ACTIVE\nBOOKING FOUND"
            return {
                "session_id": session_id,
                "spoken_text": spoken,
                "screen_display": display,
                "is_call_active": True,
                "sms_sent": None
            }

        elif digit == "3":
            # Live Queue Status
            b = db.query(Booking).filter(Booking.farmer_id == farmer_id).order_by(Booking.id.desc()).first()
            if b and b.queue_entry:
                q = get_queue_status_for_booking(db, b.id)
                spoken = (
                    f"अन्नधारा कतार स्थिति: आपका टोकन {q['token_number']} है। "
                    f"वर्तमान में टोकन {q['current_token']} की सेवा की जा रही है। "
                    f"आपसे आगे {q['people_ahead']} किसान हैं। "
                    f"अनुमानित प्रतीक्षा समय {q['estimated_wait_mins']} मिनट है।"
                )
                display = f"QUEUE STATUS\nToken: {q['token_number']}\nAhead: {q['people_ahead']}\nWait: {q['estimated_wait_mins']}m"
            else:
                spoken = "कतार विवरण उपलब्ध नहीं है। कृपया पहले स्लॉट बुक करें।"
                display = "QUEUE INFO\nNo active token"
            return {
                "session_id": session_id,
                "spoken_text": spoken,
                "screen_display": display,
                "is_call_active": True,
                "sms_sent": None
            }

        elif digit == "4":
            # Reschedule prompt
            session["state"] = "RESCHEDULE_CONFIRM"
            return {
                "session_id": session_id,
                "spoken_text": "आपकी बुकिंग को कल सुबह 10:00 बजे के स्लॉट में बदलने के लिए 1 दबाएं। वर्तमान बुकिंग बनाए रखने के लिए 2 दबाएं।" if lang == "hi" else "To reschedule to tomorrow 10:00 AM press 1. To keep current booking press 2.",
                "screen_display": "RESCHEDULE:\n1: Next 10 AM\n2: Keep current",
                "is_call_active": True,
                "sms_sent": None
            }

        elif digit == "5":
            # Payment status
            b = db.query(Booking).filter(Booking.farmer_id == farmer_id).order_by(Booking.id.desc()).first()
            if b and b.payment:
                spoken = (
                    f"खरीद भुगतान स्थिति: कुल राशि ₹{int(b.payment.amount_inr):,}। "
                    f"स्थिति: {b.payment.status.upper()}। "
                    f"लेन-देन संदर्भ: {b.payment.transaction_id}। राशि आधार डीबीटी द्वारा भेजी जा रही है।"
                )
                display = f"PAYMENT STATUS\nINR {int(b.payment.amount_inr)}\nStatus: {b.payment.status}\nDBT Verified"
            else:
                spoken = "भुगतान विवरण अभी प्रक्रिया में है।"
                display = "PAYMENT\nIn Processing"
            return {
                "session_id": session_id,
                "spoken_text": spoken,
                "screen_display": display,
                "is_call_active": True,
                "sms_sent": None
            }

        elif digit == "6":
            return {
                "session_id": session_id,
                "spoken_text": "किसान हेल्पलाइन 1800-266-2026 पर आपका संपर्क कराया जा रहा है। कृपया प्रतीक्षा करें।" if lang == "hi" else "Connecting to Kisan Helpdesk 1800-266-2026. Please hold on.",
                "screen_display": "HELPLINE 1800\nConnecting...",
                "is_call_active": True,
                "sms_sent": None
            }

    # 2. BOOKING: CROP SELECT
    if state == "BOOKING_CROP_SELECT":
        crop = "Wheat" if digit == "1" else "Rice"
        session["temp_data"]["crop"] = crop
        session["state"] = "BOOKING_CENTRE_SELECT"
        return {
            "session_id": session_id,
            "spoken_text": "Centre B (अन्नधारा मॉडल हब, 15 कतार) के लिए 1 दबाएं। Centre A के लिए 2 दबाएं।" if lang == "hi" else "For Centre B (Recommended, Queue: 15) press 1. For Centre A press 2.",
            "screen_display": "SELECT CENTRE:\n1: Centre B (Rec)\n2: Centre A",
            "is_call_active": True,
            "sms_sent": None
        }

    # 3. BOOKING: CENTRE SELECT
    if state == "BOOKING_CENTRE_SELECT":
        centre_code = "CENTRE-B" if digit == "1" else "CENTRE-A"
        centre = db.query(Centre).filter(Centre.code == centre_code).first()
        session["temp_data"]["centre_id"] = centre.id if centre else 2
        session["state"] = "BOOKING_CONFIRM"
        return {
            "session_id": session_id,
            "spoken_text": "आज दोपहर 02:00 बजे के स्लॉट में 50 क्विंटल की बुकिंग पक्की करने के लिए 1 दबाएं।" if lang == "hi" else "Press 1 to confirm 50 quintals slot today at 02:00 PM.",
            "screen_display": "CONFIRM BOOK:\nPress 1 to Book\n50q @ 2:00 PM",
            "is_call_active": True,
            "sms_sent": None
        }

    # 4. BOOKING: CONFIRM EXECUTION
    if state == "BOOKING_CONFIRM":
        if digit == "1":
            centre_id = session["temp_data"].get("centre_id", 2)
            crop = session["temp_data"].get("crop", "Wheat")
            slot = db.query(Slot).filter(Slot.centre_id == centre_id, Slot.time_slot == "02:00 PM").first()
            if not slot:
                slot = db.query(Slot).filter(Slot.centre_id == centre_id).first()

            # Execute real backend booking!
            new_b = create_new_booking(
                db=db,
                farmer_id=farmer_id,
                family_id=1,
                centre_id=centre_id,
                slot_id=slot.id,
                crop_name=crop,
                quantity_quintals=50.0,
                notes="Booked via Annadhara IVR Keypad phone."
            )
            session["state"] = "MAIN_MENU"
            spoken = (
                f"बधाई हो! आपकी खरीद बुकिंग पक्की हो गई है। बुकिंग संख्या {new_b.booking_code}, "
                f"टोकन संख्या {new_b.queue_entry.token_number}। एसएमएस आपके मोबाइल पर भेज दिया गया है।"
            )
            display = f"BOOKING SUCCESS!\nID: {new_b.booking_code}\nToken: {new_b.queue_entry.token_number}\nSMS Dispatched"
            sms_text = f"[SMS] Annadhara IVR: Booking {new_b.booking_code} Confirmed! Token: {new_b.queue_entry.token_number}. Centre B, 02:00 PM."
            return {
                "session_id": session_id,
                "spoken_text": spoken,
                "screen_display": display,
                "is_call_active": True,
                "sms_sent": sms_text,
                "action_triggered": "IVR_BOOKING_CREATED"
            }

    # 5. RESCHEDULE EXECUTION
    if state == "RESCHEDULE_CONFIRM":
        if digit == "1":
            b = db.query(Booking).filter(Booking.farmer_id == farmer_id).order_by(Booking.id.desc()).first()
            if b:
                new_slot = db.query(Slot).filter(
                    Slot.centre_id == b.centre_id,
                    Slot.date == "25 September",
                    Slot.time_slot == "10:00 AM"
                ).first()
                if not new_slot:
                    new_slot = db.query(Slot).filter(Slot.centre_id == b.centre_id, Slot.id != b.slot_id).first()

                resched = reschedule_booking(db, b.id, new_slot.id, new_date="25 September", reason="IVR Keypad rescheduling")
                session["state"] = "MAIN_MENU"
                spoken = f"आपकी बुकिंग सफलतापूर्वक 25 सितंबर, सुबह 10:00 बजे पुनर्निर्धारित कर दी गई है। नया विवरण एसएमएस द्वारा भेजा गया है।"
                display = f"RESCHEDULED!\nDate: 25 Sep\nSlot: 10:00 AM\nToken: {resched.queue_entry.token_number if resched.queue_entry else 'T118'}"
                sms_text = f"[SMS] Annadhara: Booking {b.booking_code} rescheduled to 25 Sep 10:00 AM via Keypad IVR."
                return {
                    "session_id": session_id,
                    "spoken_text": spoken,
                    "screen_display": display,
                    "is_call_active": True,
                    "sms_sent": sms_text,
                    "action_triggered": "IVR_RESCHEDULED"
                }

    # Fallback to menu
    session["state"] = "MAIN_MENU"
    return {
        "session_id": session_id,
        "spoken_text": "मुख्य मेनू। बुकिंग के लिए 1 दबाएं, कतार के लिए 3 दबाएं।" if lang == "hi" else "Main Menu. Press 1 to Book, 3 for Queue.",
        "screen_display": "ANNADHARA IVR\n1: Book\n3: Queue",
        "is_call_active": True,
        "sms_sent": None
    }

def handle_missed_call(db: Session, phone: str = "9876543210") -> Dict[str, Any]:
    farmer = db.query(User).filter(User.phone == phone).first()
    farmer_id = farmer.id if farmer else 1
    booking = db.query(Booking).filter(Booking.farmer_id == farmer_id).order_by(Booking.id.desc()).first()

    if booking and booking.queue_entry:
        q = get_queue_status_for_booking(db, booking.id)
        token = q["token_number"]
        ahead = q["people_ahead"]
        wait = q["estimated_wait_mins"]
        centre_name = q["centre_name"]
        sms_msg = (
            f"[SMS Callback] Namaste {farmer.full_name if farmer else 'Kisan'} ji! "
            f"Your Annadhara Token is {token} at {centre_name}. "
            f"Current Serving: {q['current_token']}. People Ahead: {ahead}. "
            f"Estimated Waiting Time: {wait} minutes. Slot: {booking.booking_time}."
        )
    else:
        token = "T118"
        ahead = 15
        wait = 42
        sms_msg = (
            f"[SMS Callback] Namaste Kisan ji! Your Token is {token} at Centre B. "
            f"People Ahead: {ahead}. Estimated Waiting Time: {wait} minutes."
        )

    # Save notification
    create_notification(
        db=db,
        user_id=farmer_id,
        phone=phone,
        notif_type="token",
        channel="sms",
        title="Missed Call Auto-Response",
        message=sms_msg
    )

    return {
        "status": "callback_triggered",
        "phone": phone,
        "token_number": token,
        "people_ahead": ahead,
        "estimated_wait_mins": wait,
        "sms_dispatched": sms_msg
    }
