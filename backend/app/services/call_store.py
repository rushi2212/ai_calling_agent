from datetime import datetime
from typing import Any, Dict, List
from uuid import uuid4

from app.database.mongodb import calls_collection

LOCAL_CALL_LOGS: List[Dict[str, Any]] = []


def _utc_now():
    return datetime.utcnow()


def _serialize_value(value):
    if isinstance(value, datetime):
        return value.isoformat()

    if isinstance(value, list):
        return [_serialize_value(item) for item in value]

    if isinstance(value, dict):
        return {key: _serialize_value(item) for key, item in value.items()}

    return value


def _normalize_entry(entry):
    normalized = dict(entry)

    if "created_at" not in normalized:
        normalized["created_at"] = _utc_now()

    normalized.setdefault("call_sid", f"call_{uuid4().hex[:8]}")
    normalized.setdefault("customer_number", "unknown")
    normalized.setdefault("customer_message", "")
    normalized.setdefault("ai_response", "")
    normalized.setdefault("status", "in-progress")
    normalized.setdefault("event_type", "turn")
    normalized.setdefault("source", "voice")

    return normalized


def store_call_log(entry):
    normalized_entry = _normalize_entry(entry)

    LOCAL_CALL_LOGS.append(normalized_entry)

    if calls_collection is not None:
        try:
            calls_collection.insert_one(normalized_entry)
        except Exception:
            pass

    return _serialize_value(normalized_entry)


def record_call_turn(call_sid, customer_number, customer_message, ai_response, status="in-progress", transcript=None):
    return store_call_log({
        "call_sid": call_sid,
        "customer_number": customer_number or "unknown",
        "customer_message": customer_message or "",
        "ai_response": ai_response or "",
        "status": status,
        "event_type": "turn",
        "transcript": transcript or [],
        "created_at": _utc_now(),
        "source": "voice",
    })


def record_call_event(call_sid, event_type, customer_number="unknown", details=None, status="in-progress"):
    return store_call_log({
        "call_sid": call_sid,
        "customer_number": customer_number or "unknown",
        "customer_message": "",
        "ai_response": "",
        "status": status,
        "event_type": event_type,
        "details": details or {},
        "created_at": _utc_now(),
        "source": "webhook",
    })


def fetch_recent_calls(limit=25):
    if calls_collection is not None:
        try:
            docs = list(
                calls_collection.find({}, {"_id": 0}).sort("created_at", -1).limit(limit)
            )

            return [_serialize_value(doc) for doc in docs]
        except Exception:
            pass

    docs = sorted(LOCAL_CALL_LOGS, key=lambda item: item.get("created_at", _utc_now()), reverse=True)

    return [_serialize_value(doc) for doc in docs[:limit]]


def fetch_call_history(call_sid):
    if calls_collection is not None:
        try:
            docs = list(
                calls_collection.find({"call_sid": call_sid}, {"_id": 0}).sort("created_at", 1)
            )

            if docs:
                return [_serialize_value(doc) for doc in docs]
        except Exception:
            pass

    docs = [
        doc for doc in LOCAL_CALL_LOGS
        if doc.get("call_sid") == call_sid
    ]

    return [_serialize_value(doc) for doc in sorted(docs, key=lambda item: item.get("created_at", _utc_now()))]


def build_dashboard_summary():
    calls = fetch_recent_calls(limit=200)

    unique_calls = {}
    for item in calls:
        call_sid = item.get("call_sid")
        if not call_sid:
            continue

        bucket = unique_calls.setdefault(call_sid, {
            "call_sid": call_sid,
            "customer_number": item.get("customer_number", "unknown"),
            "latest_status": item.get("status", "in-progress"),
            "updated_at": item.get("created_at"),
            "turns": 0,
        })

        bucket["turns"] += 1
        bucket["latest_status"] = item.get("status", bucket["latest_status"])

        created_at = item.get("created_at")
        if created_at and (bucket["updated_at"] is None or created_at > bucket["updated_at"]):
            bucket["updated_at"] = created_at

    call_list = list(unique_calls.values())
    total_calls = len(call_list)
    active_calls = sum(1 for item in call_list if item.get("latest_status") == "in-progress")
    resolved_calls = sum(1 for item in call_list if item.get("latest_status") == "resolved")
    escalated_calls = sum(1 for item in call_list if item.get("latest_status") == "escalated")
    total_turns = sum(item.get("turns", 0) for item in call_list)
    average_turns = round(total_turns / total_calls, 1) if total_calls else 0.0

    latest_activity = calls[:5]

    return {
        "total_calls": total_calls,
        "active_calls": active_calls,
        "resolved_calls": resolved_calls,
        "escalated_calls": escalated_calls,
        "total_turns": total_turns,
        "average_turns": average_turns,
        "resolution_rate": round((resolved_calls / total_calls) * 100, 1) if total_calls else 0,
        "latest_activity": latest_activity,
    }