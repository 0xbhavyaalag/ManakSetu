import os

class Settings:
    PROJECT_NAME: str = "ANNADHARA AI"
    TAGLINE: str = "From Uncertain Queues to Intelligent Procurement"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "annadhara-secret-key-sih2026-secure-token")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # SQLite default for instant zero-dependency local runs, switchable to PostgreSQL via env
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./annadhara.db")
    
    CROWD_QUEUE_THRESHOLD: int = 80
    DEFAULT_AVG_PROCESSING_MINS: int = 6
    DEFAULT_ACTIVE_COUNTERS: int = 3

settings = Settings()
