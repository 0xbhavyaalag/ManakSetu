from typing import Optional, List
from sqlalchemy.orm import Session
from ..models.models import Notification

# In-memory async event broker simulation (RabbitMQ pattern)
EVENT_QUEUE = []

def create_notification(
    db: Session,
    user_id: Optional[int],
    phone: str,
    notif_type: str,
    channel: str,
    title: str,
    message: str
) -> Notification:
    notif = Notification(
        user_id=user_id,
        phone=phone,
        notif_type=notif_type,
        channel=channel,
        title=title,
        message=message,
        is_read=False
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)

    # Publish to simulated message broker
    EVENT_QUEUE.append({
        "event_id": notif.id,
        "channel": channel,
        "type": notif_type,
        "recipient": phone,
        "title": title,
        "body": message
    })
    return notif

def get_user_notifications(db: Session, user_id: Optional[int] = None, phone: Optional[str] = None) -> List[Notification]:
    query = db.query(Notification)
    if user_id:
        query = query.filter((Notification.user_id == user_id) | (Notification.phone == phone))
    elif phone:
        query = query.filter(Notification.phone == phone)
    return query.order_by(Notification.created_at.desc()).limit(30).all()

def mark_notification_read(db: Session, notification_id: int):
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return notif
