import json
from pathlib import Path
from threading import Lock

from app.core.config import settings


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"
SETTINGS_FILE = DATA_DIR / "settings.json"

_settings_lock = Lock()

DEFAULT_BASE_URLS = {
    "qwen": "https://dashscope.aliyuncs.com/compatible-mode/v1",
    "openai": "https://api.openai.com/v1",
    "deepseek": "https://api.deepseek.com/v1",
    "other": ""
}


def _default_llm_settings() -> dict:
    return {
        "provider": "qwen",
        "api_key": "",
        "base_url": DEFAULT_BASE_URLS["qwen"],
        "model": ""
    }

def _ensure_settings_file():
    DATA_DIR.mkdir(exist_ok=True)

    if not SETTINGS_FILE.exists():
        default_data = {
            "llm": _default_llm_settings()
        }
        with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
            json.dump(default_data, f, ensure_ascii=False, indent=2)


def _load_all_settings() -> dict:
    _ensure_settings_file()
    with _settings_lock:
        with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)

    if not isinstance(data, dict):
        data = {}

    if "llm" not in data or not isinstance(data["llm"], dict):
        data["llm"] = _default_llm_settings()
        _save_all_settings(data)

    return data


def _save_all_settings(data: dict):
    _ensure_settings_file()
    with _settings_lock:
        with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)


def normalize_llm_settings(payload: dict) -> dict:
    provider = (payload.get("provider") or "qwen").strip().lower()
    if provider not in DEFAULT_BASE_URLS:
        provider = "other"

    api_key = (payload.get("api_key") or "").strip()
    model = (payload.get("model") or "").strip()
    base_url = (payload.get("base_url") or "").strip()

    if not model:
        if provider == "qwen":
              model = "qwen-plus"
        elif provider == "openai":
              model = "gpt-4o-mini"
        elif provider == "deepseek":
              model = "deepseek-chat"
        else:
              model = ""

    if not base_url:
        base_url = DEFAULT_BASE_URLS.get(provider, "")

    return {
        "provider": provider,
        "api_key": api_key,
        "base_url": base_url,
        "model": model
    }


def load_llm_settings() -> dict:
    data = _load_all_settings()
    llm = data.get("llm", {})
    return normalize_llm_settings(llm)


def save_llm_settings(payload: dict) -> dict:
    data = _load_all_settings()
    normalized = normalize_llm_settings(payload)
    data["llm"] = normalized
    _save_all_settings(data)
    return normalized