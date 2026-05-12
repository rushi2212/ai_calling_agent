from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CallLog(BaseModel):
    customer_number: str
    customer_message: str
    ai_response: str
    created_at: Optional[datetime] = datetime.utcnow()