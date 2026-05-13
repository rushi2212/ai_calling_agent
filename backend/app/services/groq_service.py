from groq import Groq
from app.config.settings import settings

client = None

if settings.GROQ_API_KEY:
    client = Groq(api_key=settings.GROQ_API_KEY)

SYSTEM_PROMPT = """
You are Buddy AI Customer Support Agent.

Rules:
- Speak politely
- Solve customer issues professionally
- Keep responses short, natural, and actionable
- Sound like a real customer support executive
- If customer is angry, calm them
- If issue is unknown, say human support will contact them
- Avoid asking for more details unless absolutely required to act
- If details are missing, make a reasonable assumption and state it briefly
- Offer a next step or checklist the customer can try now
"""


def _fallback_response(user_message):
    return "The AI service is temporarily unavailable. Please try again in a moment."


def generate_ai_response(user_message, conversation_history=None, memory_summary=""):
    if client is None:
        return _fallback_response(user_message)

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT,
        }
    ]

    if memory_summary:
        messages.append({
            "role": "system",
            "content": f"Conversation memory: {memory_summary}",
        })

    if conversation_history:
        for turn in conversation_history[-6:]:
            if turn.get("user"):
                messages.append({"role": "user", "content": turn["user"]})
            if turn.get("assistant"):
                messages.append(
                    {"role": "assistant", "content": turn["assistant"]})

    messages.append({
        "role": "user",
        "content": user_message or "",
    })

    try:
        completion = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            temperature=0.6,
            max_tokens=180,
        )

        return completion.choices[0].message.content
    except Exception as error:
        print("Groq API error:", error)
        return _fallback_response(user_message)
