from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import Notification
from ..services.notification_service import get_user_notifications, mark_notification_read

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("")
def list_notifications(channel: Optional[str] = None, db: Session = Depends(get_db)):
    notifs = get_user_notifications(db, user_id=1, phone="9876543210")
    if channel:
        notifs = [n for n in notifs if n.channel == channel]
    return [
        {
            "id": n.id,
            "notif_type": n.notif_type,
            "channel": n.channel,
            "title": n.title,
            "message": n.message,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat() if n.created_at else ""
        }
        for n in notifs
    ]

@router.patch("/{notif_id}/read")
def read_notification(notif_id: int, db: Session = Depends(get_db)):
    res = mark_notification_read(db, notif_id)
    return {"success": True, "id": notif_id}
