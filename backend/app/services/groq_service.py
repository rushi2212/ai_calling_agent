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
- Ask one clarifying question at a time when needed
"""


def _fallback_response(user_message):

    message = (user_message or "").lower()

    if not message:
        return "I can help with that. Please tell me what happened so I can look into it."

    if any(keyword in message for keyword in ["refund", "billing", "charged", "payment"]):
        return "I understand the billing issue. I’m checking the account details now, and if needed I’ll connect you with a specialist."

    if any(keyword in message for keyword in ["cancel", "close", "terminate"]):
        return "I can help with the cancellation request. Please confirm your account number and I’ll guide you through the next step."

    if any(keyword in message for keyword in ["angry", "upset", "frustrated"]):
        return "I’m sorry for the trouble. I’ll stay with you and work through this step by step."

    return "Thanks for explaining that. Please share one more detail so I can resolve this quickly."


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
