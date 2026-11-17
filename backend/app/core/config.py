from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "جامعتي | Jami3ati API"
    VERSION: str = "1.0.0-hackathon-mvp"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "postgresql://jami3ati:jami3ati_secret_dev@localhost:5432/jami3ati_db"
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "*"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
