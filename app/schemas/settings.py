from pydantic import BaseModel


class LLMSettingsPayload(BaseModel):
    provider: str = "qwen"
    api_key: str = ""
    base_url: str = ""
    model: str = "qwen-plus"


class LLMSettingsResponse(BaseModel):
    success: bool
    data: LLMSettingsPayload
    message: str | None = None


class LLMSettingsTestResponse(BaseModel):
    success: bool
    message: str