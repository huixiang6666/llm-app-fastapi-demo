# 大模型应用开发助手

一个面向新手的 **本地学习版大模型应用开发助手**。  
项目使用 **FastAPI** 作为后端，前端提供聊天页面、会话容器管理、API Key 配置和快速入门教程，适合用来学习：

- 大模型 API 调用
- FastAPI 基础开发
- 前后端联调
- 会话上下文管理
- 本地项目结构组织

---

## 项目简介

这个项目的目标不是做一个复杂的商用产品，而是帮助初学者从“能跑通一个大模型调用”，逐步过渡到“理解前后端联调、会话管理和项目结构设计”的完整实践。

项目当前已经实现的核心能力包括：

- AI 助手聊天页面
- 会话容器管理
- API Key 管理
- 快速入门教程
- 右下角悬浮 AI 助手
- 后端大模型接口调用
- 本地聊天记录保存

---

## 功能特点

### 1. AI 助手聊天

进入主页面后，用户可以直接输入问题，前端调用后端聊天接口，后端请求大模型服务并返回结果。

### 2. 会话容器

每次新建对话都会生成一个新的会话容器。  
左侧列表会显示该会话的标题，默认取第一次提问的内容作为标题。

### 3. API Key 管理

支持在页面中配置：

- provider
- model
- api key
- base url

用于本地模型调用与测试。

### 4. 快速入门

项目内置快速入门页面，内容覆盖：

- Windows + WSL2 环境准备
- Python 虚拟环境
- FastAPI 最小示例
- 使用代码访问大模型
- 当前项目结构理解

### 5. 本地学习版定位

本项目主要用于本地部署与个人学习，不依赖复杂的账号系统，更适合作为课程练手项目或个人作品集项目。

---

## 技术栈

### 后端

- FastAPI
- Uvicorn
- OpenAI Python SDK（用于访问 OpenAI 兼容接口）

### 前端

- HTML
- CSS
- JavaScript

### 运行环境

- Windows + WSL2（推荐）
- Ubuntu / Linux
- Python 3.10+

---

## 项目结构

```text
app/
├── api/
│   └── routes/
│       ├── chat.py
│       └── settings.py
├── core/
│   └── config.py
├── prompts/
│   └── system_prompt.py
├── schemas/
│   ├── chat.py
│   └── settings.py
├── services/
│   ├── history_service.py
│   ├── llm_service.py
│   └── settings_service.py
├── static/
│   ├── css/
│   └── js/
├── templates/
│   └── index.html
└── main.py

data/
├── settings.json
└── chat_history.json
