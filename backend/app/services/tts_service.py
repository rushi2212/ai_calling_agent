import requests
from app.config.settings import settings

VOICE_ID = "21m00Tcm4TlvDq8ikWAM"

def text_to_speech(text):

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

    headers = {
        "xi-api-key": settings.ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "text": text,
        "model_id": "eleven_monolingual_v1"
    }

    response = requests.post(
        url,
        json=payload,
        headers=headers
    )

    audio_path = "response.mp3"

    with open(audio_path, "wb") as f:
        f.write(response.content)

    return audio_path