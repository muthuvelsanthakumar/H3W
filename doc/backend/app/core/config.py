import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "H3W Intelligence"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-for-development"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # Database
    DATABASE_URL: Optional[str] = None

    # AI
    LLAMA_API_KEY: str = ""
    LLAMA_MODEL: str = "llama-3.3-70b-versatile"

    model_config = SettingsConfigDict(
        case_sensitive=True, 
        env_file=".env",
        extra="ignore" # This will prevent the error with extra fields in .env
    )

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return self.DATABASE_URL

settings = Settings()
