const navButtons = document.querySelectorAll(".nav-btn");
const pageViews = document.querySelectorAll(".page-view");

const newChatBtn = document.getElementById("new-chat-btn");
const clearAllBtn = document.getElementById("clear-all-btn");
const conversationList = document.getElementById("conversation-list");

const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const currentConversationTitle = document.getElementById("current-conversation-title");

const providerSelect = document.getElementById("provider");
const modelNameInput = document.getElementById("model-name");
const apiKeyInput = document.getElementById("api-key");
const baseUrlInput = document.getElementById("base-url");
const saveSettingsBtn = document.getElementById("save-settings-btn");
const testSettingsBtn = document.getElementById("test-settings-btn");
const settingsStatus = document.getElementById("settings-status");

const assistantFab = document.getElementById("assistant-fab");
const assistantDrawer = document.getElementById("assistant-drawer");
const closeAssistantDrawer = document.getElementById("close-assistant-drawer");
const assistantDrawerMessages = document.getElementById("assistant-drawer-messages");
const assistantDrawerInput = document.getElementById("assistant-drawer-input");
const assistantDrawerSend = document.getElementById("assistant-drawer-send");

const state = {
    currentConversationId: null,
    conversations: [],
    drawerConversationId: null
};

function switchPage(pageName) {
    pageViews.forEach(page => page.classList.remove("active"));
    navButtons.forEach(btn => btn.classList.remove("active"));

    const targetPage = document.getElementById(`page-${pageName}`);
    const targetBtn = document.querySelector(`.nav-btn[data-page="${pageName}"]`);

    if (targetPage) targetPage.classList.add("active");
    if (targetBtn) targetBtn.classList.add("active");
}

navButtons.forEach(btn => {
    btn.addEventListener("click", () => switchPage(btn.dataset.page));
});

document.querySelectorAll(".guide-link").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

function createMessageElement(text, role, time = "") {
    const div = document.createElement("div");
    div.className = `message ${role}`;

    const roleDiv = document.createElement("div");
    roleDiv.className = "message-role";
    roleDiv.textContent = role === "user" ? "我" : "助手";

    const textDiv = document.createElement("div");
    textDiv.className = "message-text";
    textDiv.textContent = text ?? "";

    const timeDiv = document.createElement("div");
    timeDiv.className = "message-time";
    timeDiv.textContent = time || "";

    div.appendChild(roleDiv);
    div.appendChild(textDiv);
    div.appendChild(timeDiv);

    return div;
}

function addMainMessage(text, role, time = "") {
    const el = createMessageElement(text, role, time);
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return el;
}

function addDrawerMessage(text, role, time = "") {
    const el = createMessageElement(text, role, time);
    assistantDrawerMessages.appendChild(el);
    assistantDrawerMessages.scrollTop = assistantDrawerMessages.scrollHeight;
    return el;
}

function renderWelcome() {
    chatMessages.innerHTML = `
        <div class="welcome-box">
            <h2>欢迎使用“大模型应用开发助手”</h2>
            <p>你可以直接开始提问。左侧会保存每一个对话容器，并显示第一次提问作为标题。</p>
        </div>
    `;
    currentConversationTitle.textContent = "新对话";
}

function renderDrawerWelcome() {
    assistantDrawerMessages.innerHTML = "";
    addDrawerMessage("你好，我是悬浮 AI 助手。你可以随时提问。", "bot", "系统");
}

function normalizeConversationTitle(conv) {
    if (conv.title && conv.title.trim()) return conv.title.trim();

    const messages = conv.messages || [];
    const firstUser = messages.find(msg => msg.role === "user" && msg.content);
    return firstUser ? firstUser.content.trim() : "新对话";
}

function sortConversations(list) {
    return [...list].sort((a, b) => {
        const t1 = a.updated_at || "";
        const t2 = b.updated_at || "";
        return t2.localeCompare(t1);
    });
}

function renderConversationList() {
    conversationList.innerHTML = "";

    if (!state.conversations.length) {
        conversationList.innerHTML = `<div class="empty-conversation">暂无对话</div>`;
        return;
    }

    state.conversations.forEach(conv => {
        const item = document.createElement("div");
        item.className = "conversation-item";
        if (conv.id === state.currentConversationId) {
            item.classList.add("active");
        }

        const title = document.createElement("div");
        title.className = "conversation-title";
        title.textContent = normalizeConversationTitle(conv);

        const time = document.createElement("div");
        time.className = "conversation-time";
        time.textContent = conv.updated_at || "";

        item.appendChild(title);
        item.appendChild(time);

       item.addEventListener("click", async () => {
    switchPage("chat");
    await openConversation(conv.id);
});

        conversationList.appendChild(item);
    });
}

async function loadConversationList() {
    try {
        const response = await fetch("/api/conversations");
        const data = await response.json();

        if (data.success) {
            state.conversations = sortConversations(data.data || []);
        } else {
            state.conversations = [];
        }
    } catch (error) {
        state.conversations = [];
    }

    renderConversationList();
}

async function openConversation(conversationId) {
    try {
        const response = await fetch(`/api/conversations/${conversationId}`);
        const data = await response.json();

        if (!data.success) return;

        const conversation = data.data;
        state.currentConversationId = conversation.id;

        renderConversationList();
        chatMessages.innerHTML = "";

        currentConversationTitle.textContent = normalizeConversationTitle(conversation);

        const messages = conversation.messages || [];
        if (!messages.length) {
            renderWelcome();
            return;
        }

        messages.forEach(msg => {
            addMainMessage(
                msg.content,
                msg.role === "user" ? "user" : "bot",
                msg.time || ""
            );
        });
    } catch (error) {
        addMainMessage("加载会话失败，请检查后端服务。", "bot", "错误");
    }
}

async function createConversation() {
    try {
        const response = await fetch("/api/conversations", {
            method: "POST"
        });
        const data = await response.json();

        if (!data.success) return null;

        state.currentConversationId = data.data.id;
        await loadConversationList();
        chatMessages.innerHTML = "";
        currentConversationTitle.textContent = "新对话";
        return data.data.id;
    } catch (error) {
        return null;
    }
}

async function sendMainMessage() {
    const question = chatInput.value.trim();
    if (!question) return;

    if (!state.currentConversationId) {
        await createConversation();
    }

    addMainMessage(question, "user", "刚刚");
    chatInput.value = "";
    sendBtn.disabled = true;

    const loadingEl = addMainMessage("正在思考中...", "bot", "");

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question,
                conversation_id: state.currentConversationId
            })
        });

        const data = await response.json();
        loadingEl.remove();

        if (data.success) {
            state.currentConversationId = data.conversation_id || state.currentConversationId;
            await loadConversationList();
            await openConversation(state.currentConversationId);
        } else {
            addMainMessage(data.answer || "调用失败。", "bot", "错误");
        }
    } catch (error) {
        loadingEl.remove();
        addMainMessage("请求失败，请检查后端服务或网络连接。", "bot", "错误");
    } finally {
        sendBtn.disabled = false;
    }
}

async function clearAllConversations() {
    const ok = confirm("确定要清空所有对话吗？");
    if (!ok) return;

    try {
        const response = await fetch("/api/history/clear", {
            method: "POST"
        });
        const data = await response.json();

        if (data.success) {
            state.currentConversationId = null;
            state.conversations = [];
            renderConversationList();
            renderWelcome();
        }
    } catch (error) {
        addMainMessage("清空失败，请检查后端服务。", "bot", "错误");
    }
}

async function loadSettings() {
    try {
        const response = await fetch("/api/settings/llm");
        const data = await response.json();
        if (!data.success) return;

        const config = data.data || {};
        providerSelect.value = config.provider || "qwen";
        modelNameInput.value = config.model || "";
        apiKeyInput.value = config.api_key || "";
        baseUrlInput.value = config.base_url || "";
    } catch (error) {}
}

async function saveSettings() {
    const payload = {
        provider: providerSelect.value,
        model: modelNameInput.value.trim(),
        api_key: apiKeyInput.value.trim(),
        base_url: baseUrlInput.value.trim()
    };

    try {
        const response = await fetch("/api/settings/llm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        settingsStatus.textContent = data.message || "配置已保存";
        settingsStatus.className = data.success ? "status-text success" : "status-text warning";
    } catch (error) {
        settingsStatus.textContent = "保存失败";
        settingsStatus.className = "status-text warning";
    }
}

async function testSettings() {
    const payload = {
        provider: providerSelect.value,
        model: modelNameInput.value.trim(),
        api_key: apiKeyInput.value.trim(),
        base_url: baseUrlInput.value.trim()
    };

    try {
        const response = await fetch("/api/settings/llm/test", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        settingsStatus.textContent = data.message || "";
        settingsStatus.className = data.success ? "status-text success" : "status-text warning";
    } catch (error) {
        settingsStatus.textContent = "测试失败";
        settingsStatus.className = "status-text warning";
    }
}

/* 悬浮 AI 助手 */
assistantFab.addEventListener("click", () => {
    assistantDrawer.classList.toggle("hidden");
});

closeAssistantDrawer.addEventListener("click", () => {
    assistantDrawer.classList.add("hidden");
});

async function sendDrawerMessage() {
    const question = assistantDrawerInput.value.trim();
    if (!question) return;

    addDrawerMessage(question, "user", "刚刚");
    assistantDrawerInput.value = "";
    assistantDrawerSend.disabled = true;

    const loadingEl = addDrawerMessage("正在思考中...", "bot", "");

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question,
                conversation_id: state.drawerConversationId
            })
        });

        const data = await response.json();
        loadingEl.remove();

        if (data.success) {
            state.drawerConversationId = data.conversation_id || state.drawerConversationId;
            addDrawerMessage(data.answer || "", "bot", "刚刚");
            await loadConversationList();
        } else {
            addDrawerMessage(data.answer || "调用失败。", "bot", "错误");
        }
    } catch (error) {
        loadingEl.remove();
        addDrawerMessage("请求失败，请检查后端服务或网络连接。", "bot", "错误");
    } finally {
        assistantDrawerSend.disabled = false;
    }
}

/* 事件绑定 */
newChatBtn.addEventListener("click", async () => {
    state.currentConversationId = null;
    await createConversation();
    switchPage("chat");
});

sendBtn.addEventListener("click", sendMainMessage);

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMainMessage();
    }
});

assistantDrawerSend.addEventListener("click", sendDrawerMessage);

assistantDrawerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendDrawerMessage();
    }
});

clearAllBtn.addEventListener("click", clearAllConversations);

saveSettingsBtn.addEventListener("click", saveSettings);
testSettingsBtn.addEventListener("click", testSettings);

window.addEventListener("DOMContentLoaded", async () => {
    await loadSettings();
    await loadConversationList();
    renderDrawerWelcome();

    if (state.conversations.length > 0) {
        await openConversation(state.conversations[0].id);
    } else {
        renderWelcome();
    }
});