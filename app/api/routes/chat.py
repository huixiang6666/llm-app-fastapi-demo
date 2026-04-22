from fastapi import APIRouter
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm_service import ask_llm
from app.services.history_service import (
    create_conversation,
    get_conversation,
    get_conversation_summaries,
    append_message,
    clear_all_conversations
)

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    try:
        conversation_id = req.conversation_id

        if not conversation_id:
            conversation = create_conversation()
            conversation_id = conversation["id"]

        conversation = get_conversation(conversation_id)
        if not conversation:
            raise ValueError("会话不存在")

        recent_messages = conversation["messages"][-6:]  # 最近 3 轮（共 6 条消息）
        answer = ask_llm(req.question, recent_messages)

        append_message(conversation_id, req.question, answer)

        return ChatResponse(
            success=True,
            question=req.question,
            answer=answer,
            conversation_id=conversation_id
        )
    except Exception as e:
        return ChatResponse(
            success=False,
            question=req.question,
            answer=f"调用失败：{str(e)}",
            conversation_id=req.conversation_id or ""
        )


@router.get("/conversations")
def get_conversations():
    return {
        "success": True,
        "data": get_conversation_summaries()
    }


@router.get("/conversations/{conversation_id}")
def get_single_conversation(conversation_id: str):
    conversation = get_conversation(conversation_id)
    if not conversation:
        return {
            "success": False,
            "message": "未找到会话"
        }
    return {
        "success": True,
        "data": conversation
    }


@router.post("/conversations")
def new_conversation():
    conversation = create_conversation()
    return {
        "success": True,
        "data": conversation
    }


@router.post("/history/clear")
def clear_chat_history():
    clear_all_conversations()
    return {
        "success": True,
        "message": "所有会话已清空"
    }