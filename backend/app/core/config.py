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
    LLAMA_API_BASE: str = "https://api.groq.com/openai/v1"
    
    model_config = SettingsConfigDict(
        case_sensitive=True, 
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env"),
        extra="ignore"
    )

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.DATABASE_URL and self.DATABASE_URL.startswith("sqlite:///./"):
            # Resolve relative sqlite path to absolute path based on backend directory
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            db_name = self.DATABASE_URL.replace("sqlite:///./", "")
            return f"sqlite:///{os.path.join(base_dir, db_name)}"
        return self.DATABASE_URL or "sqlite:///./h3w_platform.db"

settings = Settings()
