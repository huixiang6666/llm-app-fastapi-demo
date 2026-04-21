import json
import os
from datetime import datetime
from threading import Lock

HISTORY_FILE = "data/chat_history.json"
_history_lock = Lock()


def _ensure_history_file():
    os.makedirs("data", exist_ok=True)
    if not os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False, indent=2)


def load_history():
    _ensure_history_file()
    with _history_lock:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)


def save_history(history_list):
    _ensure_history_file()
    with _history_lock:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(history_list, f, ensure_ascii=False, indent=2)


def append_history(question: str, answer: str):
    history = load_history()
    history.append({
        "id": len(history) + 1,
        "question": question,
        "answer": answer,
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
    save_history(history)


def clear_history():
    save_history([])