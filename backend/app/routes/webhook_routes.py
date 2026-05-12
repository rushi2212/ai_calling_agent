from fastapi import APIRouter, Request

from app.services.call_store import record_call_event

router = APIRouter()

@router.post("/webhook")
async def webhook(request: Request):

    form_data = await request.form()
    call_sid = form_data.get("CallSid", "unknown")

    record_call_event(
        call_sid=call_sid,
        event_type=form_data.get("CallStatus", "webhook-event"),
        customer_number=form_data.get("From", "unknown"),
        details={"payload": dict(form_data)},
        status=form_data.get("CallStatus", "in-progress"),
    )

    return {
        "message": "Webhook Working"
    }