from twilio.rest import Client
from app.config.settings import settings

client = None

if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
    client = Client(
        settings.TWILIO_ACCOUNT_SID,
        settings.TWILIO_AUTH_TOKEN
    )

def make_call(to_number, webhook_url):

    if client is None:
        raise RuntimeError("Twilio credentials are not configured")

    if not webhook_url.startswith("https://"):
        raise RuntimeError("Twilio webhook URL must use HTTPS")

    if "localhost" in webhook_url or "127.0.0.1" in webhook_url:
        raise RuntimeError("Twilio webhook URL cannot point to localhost. Use an ngrok HTTPS URL.")

    call = client.calls.create(
        to=to_number,
        from_=settings.TWILIO_PHONE_NUMBER,
        url=webhook_url
    )

    return call.sid


def get_default_webhook_url():

    if settings.TWILIO_WEBHOOK_URL:
        webhook_url = settings.TWILIO_WEBHOOK_URL.rstrip("/")

        if not webhook_url.endswith("/incoming-call"):
            webhook_url = f"{webhook_url}/incoming-call"

        return webhook_url

    default_url = f"{settings.APP_BASE_URL.rstrip('/')}/incoming-call"

    if default_url.startswith("https://") and "localhost" not in default_url and "127.0.0.1" not in default_url:
        return default_url

    raise RuntimeError(
        "Set TWILIO_WEBHOOK_URL to your public ngrok HTTPS URL, for example https://YOUR_NGROK_URL/incoming-call"
    )


def get_public_base_url():

    webhook_url = get_default_webhook_url()

    if webhook_url.endswith("/incoming-call"):
        return webhook_url[: -len("/incoming-call")].rstrip("/")

    return webhook_url.rstrip("/")