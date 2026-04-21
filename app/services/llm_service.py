from openai import OpenAI
from app.core.config import settings

client = OpenAI(
    api_key=settings.DASHSCOPE_API_KEY,
    base_url=settings.DASHSCOPE_BASE_URL
)


def ask_llm(question: str) -> str:
    completion = client.chat.completions.create(
        model=settings.MODEL_NAME,
        messages=[
            {"role": "system", "content": "你是一个耐心、清晰的大模型应用开发学习助手。"},
            {"role": "user", "content": question}
        ]
    )
    return completion.choices[0].message.content