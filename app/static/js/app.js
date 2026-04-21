const chatBox = document.getElementById("chat-box");
const input = document.getElementById("question-input");
const sendBtn = document.getElementById("send-btn");
const clearBtn = document.getElementById("clear-btn");
const newChatBtn = document.getElementById("new-chat-btn");
const historyList = document.getElementById("history-list");

let currentHistory = [];

function formatText(text) {
    return text ?? "";
}

function createMessageElement(text, role, time = "") {
    const div = document.createElement("div");
    div.className = `message ${role}`;

    const roleDiv = document.createElement("div");
    roleDiv.className = "message-role";
    roleDiv.textContent = role === "user" ? "我" : "助手";

    const textDiv = document.createElement("div");
    textDiv.className = "message-text";
    textDiv.textContent = formatText(text);

    const timeDiv = document.createElement("div");
    timeDiv.className = "message-time";
    timeDiv.textContent = time || "";

    div.appendChild(roleDiv);
    div.appendChild(textDiv);
    div.appendChild(timeDiv);

    return div;
}

function addMessage(text, role, time = "") {
    const el = createMessageElement(text, role, time);
    chatBox.appendChild(el);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChatBox() {
    chatBox.innerHTML = "";
}

function renderWelcomeMessage() {
    clearChatBox();
    addMessage(
        "你好，我是你的大模型应用开发助手。你可以问我：FastAPI、Prompt、RAG、Agent、多轮对话、项目结构设计等问题。",
        "bot",
        "系统消息"
    );
}

function renderHistoryList(history) {
    historyList.innerHTML = "";

    if (!history || history.length === 0) {
        historyList.innerHTML = `<div class="history-empty">暂无历史记录</div>`;
        return;
    }

    history.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "history-item";
        card.dataset.index = index;

        const title = document.createElement("div");
        title.className = "history-title";
        title.textContent = item.question.length > 20
            ? item.question.slice(0, 20) + "..."
            : item.question;

        const time = document.createElement("div");
        time.className = "history-time";
        time.textContent = item.time || "";

        card.appendChild(title);
        card.appendChild(time);

        card.addEventListener("click", () => {
            document.querySelectorAll(".history-item").forEach(el => {
                el.classList.remove("active");
            });
            card.classList.add("active");
            renderSingleHistory(item);
        });

        historyList.appendChild(card);
    });
}

function renderSingleHistory(item) {
    clearChatBox();
    addMessage(item.question, "user", item.time || "");
    addMessage(item.answer, "bot", item.time || "");
}

function renderAllHistory(history) {
    clearChatBox();

    if (!history || history.length === 0) {
        renderWelcomeMessage();
        return;
    }

    history.forEach(item => {
        addMessage(item.question, "user", item.time || "");
        addMessage(item.answer, "bot", item.time || "");
    });
}

async function loadHistory() {
    try {
        const response = await fetch("/api/history");
        const data = await response.json();

        if (data.success) {
            currentHistory = data.data || [];
            renderHistoryList(currentHistory);
            renderAllHistory(currentHistory);
        } else {
            renderWelcomeMessage();
        }
    } catch (error) {
        renderWelcomeMessage();
        addMessage("加载历史记录失败，请检查后端服务。", "bot", "错误");
    }
}

async function sendMessage() {
    const question = input.value.trim();
    if (!question) return;

    addMessage(question, "user", "刚刚");
    input.value = "";
    sendBtn.disabled = true;

    const loadingEl = createMessageElement("正在思考中...", "bot", "");
    chatBox.appendChild(loadingEl);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();
        loadingEl.remove();

        if (data.success) {
            addMessage(data.answer, "bot", "刚刚");
            await loadHistory();
        } else {
            addMessage(data.answer || "调用失败。", "bot", "错误");
        }
    } catch (error) {
        loadingEl.remove();
        addMessage("请求失败，请检查后端服务或网络连接。", "bot", "错误");
    } finally {
        sendBtn.disabled = false;
    }
}

async function clearHistory() {
    const ok = confirm("确定要清空所有聊天记录吗？");
    if (!ok) return;

    try {
        const response = await fetch("/api/history/clear", {
            method: "POST"
        });
        const data = await response.json();

        if (data.success) {
            currentHistory = [];
            renderHistoryList([]);
            renderWelcomeMessage();
        } else {
            addMessage("清空聊天记录失败。", "bot", "错误");
        }
    } catch (error) {
        addMessage("清空失败，请检查后端服务。", "bot", "错误");
    }
}

function startNewChat() {
    input.value = "";
    renderWelcomeMessage();
    document.querySelectorAll(".history-item").forEach(el => {
        el.classList.remove("active");
    });
}

sendBtn.addEventListener("click", sendMessage);
clearBtn.addEventListener("click", clearHistory);
newChatBtn.addEventListener("click", startNewChat);

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

window.addEventListener("DOMContentLoaded", loadHistory);