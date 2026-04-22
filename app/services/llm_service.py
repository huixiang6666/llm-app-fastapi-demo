from openai import OpenAI

from app.prompts.system_prompt import SYSTEM_PROMPT
from app.services.settings_service import load_llm_settings


def _build_client(config: dict) -> OpenAI:
    kwargs = {
        "api_key": config["api_key"]
    }

    if config.get("base_url"):
        kwargs["base_url"] = config["base_url"]

    return OpenAI(**kwargs)


def ask_llm(question: str, history_messages: list | None = None) -> str:
    config = load_llm_settings()
    client = _build_client(config)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]

    for msg in history_messages or []:
        role = msg.get("role")
        content = msg.get("content", "")
        if role in {"user", "assistant"} and content:
            messages.append({
                "role": role,
                "content": content
            })

    messages.append({
        "role": "user",
        "content": question
    })

    completion = client.chat.completions.create(
        model=config["model"],
        messages=messages,
        temperature=0.7
    )

    return completion.choices[0].message.content or ""