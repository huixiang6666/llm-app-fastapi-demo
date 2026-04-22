from fastapi import APIRouter
from openai import OpenAI

from app.schemas.settings import (
    LLMSettingsPayload,
    LLMSettingsResponse,
    LLMSettingsTestResponse
)
from app.services.settings_service import load_llm_settings, save_llm_settings, normalize_llm_settings


router = APIRouter()


@router.get("/settings/llm", response_model=LLMSettingsResponse)
def get_llm_settings():
    data = load_llm_settings()
    return LLMSettingsResponse(success=True, data=LLMSettingsPayload(**data))


@router.post("/settings/llm", response_model=LLMSettingsResponse)
def update_llm_settings(payload: LLMSettingsPayload):
    saved = save_llm_settings(payload.model_dump())
    return LLMSettingsResponse(
        success=True,
        data=LLMSettingsPayload(**saved),
        message="配置已保存"
    )


@router.post("/settings/llm/test", response_model=LLMSettingsTestResponse)
def test_llm_settings(payload: LLMSettingsPayload):
    config = normalize_llm_settings(payload.model_dump())

    if not config["provider"] or not config["model"] or not config["api_key"]:
        return LLMSettingsTestResponse(
            success=False,
            message="请至少填写 provider、model 和 api_key。"
        )

    try:
        client_kwargs = {
            "api_key": config["api_key"]
        }
        if config["base_url"]:
            client_kwargs["base_url"] = config["base_url"]

        client = OpenAI(**client_kwargs)

        completion = client.chat.completions.create(
            model=config["model"],
            messages=[
                {"role": "user", "content": "请只回复 OK"}
            ],
            temperature=0
        )

        text = completion.choices[0].message.content or "OK"

        return LLMSettingsTestResponse(
            success=True,
            message=f"连接成功：{text}"
        )
    except Exception as e:
        return LLMSettingsTestResponse(
            success=False,
            message=f"连接失败：{str(e)}"
        )