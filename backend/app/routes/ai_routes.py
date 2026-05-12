from fastapi import APIRouter
from pydantic import BaseModel

from app.services.groq_service import generate_ai_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat(request: ChatRequest):

    response = generate_ai_response(
        request.message
    )

    return {
        "response": response
    }