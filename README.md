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

- **AI 助手聊天页面**
- **会话容器管理**
- **API Key 管理**
- **快速入门教程**
- **右下角悬浮 AI 助手**
- **后端大模型接口调用**
- **本地聊天记录保存**

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
快速开始
1. 克隆项目
git clone <your-repo-url>
cd first-project
2. 创建虚拟环境

Linux / WSL:

python3 -m venv .venv
source .venv/bin/activate

Windows PowerShell:

python -m venv .venv
.venv\Scripts\Activate.ps1
3. 安装依赖
pip install -r requirements.txt
4. 配置模型参数

推荐使用 .env 文件。

你可以创建一个 .env 文件，内容例如：

API_KEY=your_api_key_here
BASE_URL=your_base_url_here
MODEL_NAME=your_model_name_here

也可以在页面中的 API Key 管理 页面进行配置。

5. 启动项目
uvicorn app.main:app --reload

启动成功后，浏览器访问：

http://127.0.0.1:8000
页面说明
AI 助手

主聊天页面，支持：

发送消息
显示模型回复
会话上下文延续
左侧会话容器切换
API Key 管理

用于配置本地模型调用参数。

快速入门

用于帮助新手从环境搭建一直学习到最小模型调用示例。

悬浮 AI 助手

右下角小圆球入口，可在任何页面快速打开抽屉式助手进行提问。

适合的使用场景

本项目更适合作为：

大模型应用开发入门项目
FastAPI 学习项目
前后端联调练手项目
本地 AI 助手原型
课程作业 / 个人作品展示
后续可扩展方向
Markdown 渲染
代码高亮
删除单个会话
重命名会话标题
多模型切换
Prompt 模板管理
RAG 入门实验
Agent 功能扩展
数据库存储替代本地 JSON
注意事项
本项目目前更偏向 本地学习版，不建议直接作为生产环境项目部署到公网。
请不要把真实的 API Key、.env 文件、聊天记录和本地配置文件上传到 GitHub。
推荐在 .gitignore 中忽略：
.env
.venv/
__pycache__/
data/settings.json
data/chat_history.json
开发状态

当前项目处于学习版 / 迭代版阶段，适合继续完善功能与项目结构。
