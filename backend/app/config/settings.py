from dotenv import load_dotenv
import os

load_dotenv()


class Settings:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")

    TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER", "")
    TWILIO_WEBHOOK_URL = os.getenv("TWILIO_WEBHOOK_URL", "")

    MONGO_URI = os.getenv("MONGO_URI", "")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "buddy_ai_db")
    MONGO_COLLECTION_NAME = os.getenv("MONGO_COLLECTION_NAME", "calls")

    ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
    APP_BASE_URL = os.getenv("APP_BASE_URL", "http://127.0.0.1:8000")


settings = Settings()
