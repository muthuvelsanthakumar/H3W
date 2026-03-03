from pydantic import BaseModel
from typing import Optional, Dict, Any

class OrgUpdate(BaseModel):
    name: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None
