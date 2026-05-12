from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.call_routes import router as call_router
from app.routes.ai_routes import router as ai_router
from app.routes.webhook_routes import router as webhook_router

app = FastAPI(
    title="Buddy AI Calling Agent",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(call_router)
app.include_router(ai_router)
app.include_router(webhook_router)

@app.get("/")
async def root():
    return {
        "message": "Buddy AI Calling Agent Backend Running"
    }