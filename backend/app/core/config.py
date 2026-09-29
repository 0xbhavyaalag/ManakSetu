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
    _root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    _default_db_path = os.path.join(_root_dir, "annadhara.db").replace("\\", "/")
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{_default_db_path}")
    
    CROWD_QUEUE_THRESHOLD: int = 80
    DEFAULT_AVG_PROCESSING_MINS: int = 6
    DEFAULT_ACTIVE_COUNTERS: int = 3

settings = Settings()
