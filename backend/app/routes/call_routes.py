import re

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse, Response
from twilio.twiml.voice_response import VoiceResponse, Gather
from pydantic import BaseModel

from app.services.groq_service import generate_ai_response
from app.services.call_store import (
    build_dashboard_summary,
    fetch_call_history,
    fetch_recent_calls,
    record_call_event,
    record_call_turn,
)
from app.services.twilio_service import (
    get_default_webhook_url,
    get_public_base_url,
    make_call,
)
from app.services.memory_service import (
    save_conversation,
    get_conversation,
    get_memory,
)

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    call_sid: str | None = None


class MakeCallRequest(BaseModel):
    phone_number: str


def _voice_prompt(message: str):

    response = VoiceResponse()
    process_speech_url = f"{get_public_base_url().rstrip('/')}/process-speech"

    gather = Gather(
        input="speech",
        speech_timeout="auto",
        speech_model="phone_call",
        action=process_speech_url,
        method="POST",
    )

    gather.say(message)

    response.append(gather)
    response.say(
        "We did not receive a reply. Please call again if you need more help.")

    return Response(content=str(response), media_type="application/xml")


def _fallback_twiml(message: str):

    response = VoiceResponse()
    response.say(message)
    response.redirect(
        f"{get_public_base_url().rstrip('/')}/incoming-call", method="POST")

    return Response(content=str(response), media_type="application/xml")


def _derive_status(customer_text: str, ai_response: str):

    combined_text = f"{customer_text} {ai_response}".lower()

    if any(keyword in combined_text for keyword in ["thank you", "thanks", "resolved", "fixed", "bye"]):
        return "resolved"

    if any(keyword in combined_text for keyword in ["human", "specialist", "agent", "escalat"]):
        return "escalated"

    return "in-progress"


def _normalize_phone_number(phone_number: str):

    sanitized = (phone_number or "").strip().replace(" ", "")

    if not re.fullmatch(r"\+[1-9]\d{7,14}", sanitized):
        raise HTTPException(
            status_code=400,
            detail="Phone number must be in E.164 format, for example +919876543210",
        )

    return sanitized


@router.get("/health")
async def health_check():
    return {
        "status": "Backend Running",
        "summary": build_dashboard_summary(),
    }


@router.post("/incoming-call")
async def incoming_call(request: Request):

    try:
        form_data = await request.form()
        call_sid = form_data.get("CallSid", "")
        customer_number = form_data.get("From", "unknown")

        print("Twilio /incoming-call request:", dict(form_data))

        if call_sid:
            record_call_event(
                call_sid=call_sid,
                event_type="call-started",
                customer_number=customer_number,
                details={"twilio_payload": dict(form_data)},
            )

        greeting = "Hello. Welcome to Buddy AI customer support. How can I help you today?"
        return _voice_prompt(greeting)
    except Exception as error:
        print("Error in /incoming-call:", error)
        return _fallback_twiml(
            "Sorry, we could not start the call right now. Please try again later."
        )


@router.post("/process-speech")
async def process_speech(request: Request):

    try:
        form_data = await request.form()
        print("Twilio /process-speech request:", dict(form_data))

        customer_text = (form_data.get("SpeechResult", "") or "").strip()
        customer_number = form_data.get("From", "")
        call_sid = form_data.get("CallSid", "")

        print("Customer speech:", customer_text)

        if not call_sid:
            raise HTTPException(status_code=400, detail="Missing CallSid")

        if not customer_text:
            customer_text = "No speech detected"

        conversation_history = get_conversation(call_sid)
        memory_summary = get_memory(call_sid).get("summary", "")

        ai_response = generate_ai_response(
            customer_text,
            conversation_history=conversation_history,
            memory_summary=memory_summary,
        )

        print("AI response:", ai_response)

        status = _derive_status(customer_text, ai_response)

        save_conversation(
            call_sid,
            customer_text,
            ai_response,
            status=status,
        )

        record_call_turn(
            call_sid=call_sid,
            customer_number=customer_number,
            customer_message=customer_text,
            ai_response=ai_response,
            status=status,
            transcript=conversation_history +
            [{"user": customer_text, "assistant": ai_response}],
        )

        return _voice_prompt(ai_response)
    except HTTPException:
        raise
    except Exception as error:
        print("Error in /process-speech:", error)
        return _fallback_twiml(
            "Sorry, I had trouble understanding that. Please repeat your issue after the tone."
        )


@router.get("/calls")
async def get_calls():

    calls = fetch_recent_calls(limit=100)

    return JSONResponse(content=calls)


@router.get("/dashboard/summary")
async def dashboard_summary():

    return build_dashboard_summary()


@router.get("/dashboard/live")
async def dashboard_live():

    return {
        "summary": build_dashboard_summary(),
        "latest_calls": fetch_recent_calls(limit=10),
    }


@router.get("/conversation/{call_sid}")
async def conversation(call_sid: str):

    history = get_conversation(call_sid)
    logs = fetch_call_history(call_sid)
    memory = get_memory(call_sid)

    return {
        "call_sid": call_sid,
        "conversation": history,
        "logs": logs,
        "memory": memory,
    }


@router.post("/chat")
async def chat(request: ChatRequest):

    ai_response = generate_ai_response(
        request.message, conversation_history=[])

    return {
        "response": ai_response,
    }


@router.post("/make-call")
async def make_outbound_call(request: MakeCallRequest):

    phone_number = _normalize_phone_number(request.phone_number)

    try:
        webhook_url = get_default_webhook_url()
        call_sid = make_call(phone_number, webhook_url)

        record_call_event(
            call_sid=call_sid,
            event_type="outbound-call-started",
            customer_number=phone_number,
            details={"webhook_url": webhook_url},
            status="in-progress",
        )

        return {
            "success": True,
            "message": "Call initiated successfully",
            "call_sid": call_sid,
            "phone_number": phone_number,
        }
    except RuntimeError as error:
        raise HTTPException(status_code=500, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(
            status_code=502, detail=f"Twilio call failed: {error}") from error
