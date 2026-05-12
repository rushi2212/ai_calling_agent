from datetime import datetime


conversation_memory = {}

def save_conversation(call_sid, user_text, ai_response, status="in-progress"):

    if call_sid not in conversation_memory:
        conversation_memory[call_sid] = {
            "call_sid": call_sid,
            "summary": "",
            "status": "in-progress",
            "turns": [],
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }

    if not conversation_memory[call_sid]["summary"]:
        conversation_memory[call_sid]["summary"] = user_text[:180]

    conversation_memory[call_sid]["status"] = status
    conversation_memory[call_sid]["updated_at"] = datetime.utcnow().isoformat()
    conversation_memory[call_sid]["turns"].append({
        "user": user_text,
        "assistant": ai_response,
        "status": status,
        "created_at": datetime.utcnow().isoformat(),
    })

def get_conversation(call_sid):

    memory = conversation_memory.get(call_sid, {})

    return memory.get("turns", [])


def get_memory(call_sid):

    return conversation_memory.get(call_sid, {
        "call_sid": call_sid,
        "summary": "",
        "status": "in-progress",
        "turns": [],
    })