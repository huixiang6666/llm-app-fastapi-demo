import json
import uuid
from datetime import datetime
from pathlib import Path
from threading import Lock


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"
HISTORY_FILE = DATA_DIR / "chat_history.json"

_history_lock = Lock()


def _now_str() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def _ensure_history_file():
    DATA_DIR.mkdir(exist_ok=True)
    if not HISTORY_FILE.exists():
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False, indent=2)


def _save_conversations(conversations: list):
    _ensure_history_file()
    with _history_lock:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(conversations, f, ensure_ascii=False, indent=2)


def _is_new_conversation_format(item: dict) -> bool:
    return (
        isinstance(item, dict)
        and "id" in item
        and "title" in item
        and "messages" in item
    )


def _migrate_old_history(old_data: list) -> list:
    """
    把旧版格式：
    [
      {"question": "...", "answer": "...", "time": "..."}
    ]

    迁移成新版会话格式：
    [
      {
        "id": "...",
        "title": "...",
        "created_at": "...",
        "updated_at": "...",
        "messages": [
          {"role": "user", "content": "...", "time": "..."},
          {"role": "assistant", "content": "...", "time": "..."}
        ]
      }
    ]
    """
    migrated = []

    for item in old_data:
        if not isinstance(item, dict):
            continue

        question = item.get("question", "").strip()
        answer = item.get("answer", "").strip()
        time_str = item.get("time", _now_str())

        if not question and not answer:
            continue

        conversation = {
            "id": str(uuid.uuid4()),
            "title": question if question else "新对话",
            "created_at": time_str,
            "updated_at": time_str,
            "messages": []
        }

        if question:
            conversation["messages"].append({
                "role": "user",
                "content": question,
                "time": time_str
            })

        if answer:
            conversation["messages"].append({
                "role": "assistant",
                "content": answer,
                "time": time_str
            })

        migrated.append(conversation)

    return migrated


def load_conversations() -> list:
    _ensure_history_file()

    with _history_lock:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = []

    if not isinstance(data, list):
        data = []

    if not data:
        _save_conversations([])
        return []

    # 如果已经是新版格式，直接返回
    if all(_is_new_conversation_format(item) for item in data):
        return data

    # 否则按旧版历史格式迁移
    migrated = _migrate_old_history(data)
    _save_conversations(migrated)
    return migrated


def create_conversation() -> dict:
    conversations = load_conversations()

    now = _now_str()
    conversation = {
        "id": str(uuid.uuid4()),
        "title": "新对话",
        "created_at": now,
        "updated_at": now,
        "messages": []
    }

    conversations.append(conversation)
    _save_conversations(conversations)
    return conversation


def get_conversation(conversation_id: str) -> dict | None:
    conversations = load_conversations()
    for conv in conversations:
        if conv["id"] == conversation_id:
            return conv
    return None


def get_conversation_summaries() -> list:
    conversations = load_conversations()

    summaries = []
    for conv in conversations:
        summaries.append({
            "id": conv["id"],
            "title": conv.get("title", "新对话"),
            "updated_at": conv.get("updated_at", conv.get("created_at", ""))
        })

    summaries.sort(key=lambda x: x["updated_at"], reverse=True)
    return summaries


def append_message(conversation_id: str, question: str, answer: str) -> dict:
    conversations = load_conversations()
    now = _now_str()

    for conv in conversations:
        if conv["id"] == conversation_id:
            # 第一次提问时，把标题设成第一句用户问题
            if conv.get("title") in {"", "新对话"} and question.strip():
                conv["title"] = question.strip()

            conv.setdefault("messages", [])

            conv["messages"].append({
                "role": "user",
                "content": question,
                "time": now
            })
            conv["messages"].append({
                "role": "assistant",
                "content": answer,
                "time": now
            })

            conv["updated_at"] = now
            _save_conversations(conversations)
            return conv

    raise ValueError("会话不存在")


def clear_all_conversations():
    _save_conversations([])