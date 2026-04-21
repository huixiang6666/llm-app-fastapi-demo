from fastapi import APIRouter
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm_service import ask_llm
from app.services.history_service import append_history, load_history, clear_history

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    try:
        answer = ask_llm(req.question)

        append_history(req.question, answer)

        return ChatResponse(
            success=True,
            question=req.question,
            answer=answer
        )
    except Exception as e:
        return ChatResponse(
            success=False,
            question=req.question,
            answer=f"调用失败：{str(e)}"
        )


@router.get("/history")
def get_history():
    return {
        "success": True,
        "data": load_history()
    }


@router.post("/history/clear")
def clear_chat_history():
    clear_history()
    return {
        "success": True,
        "message": "聊天记录已清空"
    }