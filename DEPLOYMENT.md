# 大模型应用开发助手：快速本地部署指南

> 适用对象：第一次接触 FastAPI、大模型 API 调用、本地前后端联调的初学者。  
> 部署目标：从 Windows + WSL2 环境准备开始，到本地成功运行项目，并能在浏览器中完成一次基础对话。

---

## 1. 这份文档能帮你做什么

完成本指南后，你应该能够：

- 在本地准备好开发环境
- 克隆并打开本项目
- 创建并激活 Python 虚拟环境
- 安装项目依赖
- 配置模型调用所需的参数
- 启动 FastAPI 服务
- 在浏览器中打开页面并完成一次对话测试
- 了解常见报错的排查方法

---

## 2. 项目运行方式说明

本项目是一个**本地学习版大模型应用开发助手**，核心运行方式如下：

1. 前端页面负责输入问题、显示消息、切换会话与管理配置。
2. FastAPI 后端负责接收请求并调用模型接口。
3. 模型接口返回结果后，后端再把回答返回给前端显示。
4. 聊天记录和本地配置会保存在项目的 `data/` 目录中。

如果你只是想快速跑通项目，可以优先关注：

- 环境准备
- 安装依赖
- 配置 API Key
- 启动项目

---

## 3. 推荐运行环境

推荐你使用下面这套环境：

- Windows 10 / 11
- WSL2
- Ubuntu
- Python 3.10 及以上
- Git
- 浏览器（Chrome / Edge）

如果你已经有 Linux 环境，也可以直接在 Linux 中部署。

---

## 4. Windows 上准备 WSL2（推荐）

如果你已经安装好 WSL2，可以跳到下一节。

### 4.1 安装 WSL2

以**管理员身份**打开 PowerShell，执行：

```powershell
wsl --install
```

安装完成后，根据提示重启电脑。

如果你已经装过 WSL，也可以先查看状态：

```powershell
wsl --status
wsl --list --verbose
```

### 4.2 首次进入 Ubuntu

安装完 Ubuntu 后，第一次打开会要求你创建 Linux 用户名和密码。

创建完成后，就可以在 Ubuntu 终端中继续后面的步骤。

### 4.3 更新基础工具

进入 Ubuntu 后，建议先执行：

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip git
```

这样可以确保你具备：

- Python 运行环境
- 虚拟环境模块
- pip 包管理器
- Git 版本控制工具

---

## 5. 获取项目代码

在 WSL / Linux 终端中执行：

```bash
git clone <你的仓库地址>
cd first-project
```

如果你的项目目录名不是 `first-project`，请把第二行改成对应目录名。

### 5.1 推荐的项目位置

建议把项目放在 WSL 的 Linux 文件系统中，例如：

```bash
~/llm-projects/first-project
```

不建议长期在 `/mnt/c/...` 中直接开发，因为这样在某些情况下读写和热更新体验会差一些。

---

## 6. 创建 Python 虚拟环境

在项目根目录执行：

```bash
python3 -m venv .venv
source .venv/bin/activate
```

激活成功后，终端前面通常会出现：

```text
(.venv)
```

这表示你已经进入当前项目专属的 Python 环境。

### 6.1 Windows PowerShell 对应命令

如果你是在 Windows 原生命令行中运行，而不是在 WSL 中运行，可以使用：

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

---

## 7. 安装依赖

进入虚拟环境后，在项目根目录执行：

```bash
pip install -r requirements.txt
```

如果你的 `requirements.txt` 还不完整，至少应确保安装了这几项：

```bash
pip install fastapi uvicorn openai python-dotenv
```

安装完成后，你就具备了：

- FastAPI 后端框架
- Uvicorn 开发服务器
- OpenAI Python SDK
- `.env` 配置读取能力

---

## 8. 配置模型调用参数

本项目要想正常访问大模型，至少需要这些信息：

- `API_KEY`
- `BASE_URL`
- `MODEL_NAME`

你可以用两种方式配置。

### 方式 A：使用 `.env` 文件

在项目根目录新建一个 `.env` 文件：

```env
API_KEY=your_api_key_here
BASE_URL=your_base_url_here
MODEL_NAME=your_model_name_here
```

示例说明：

- `API_KEY`：你的模型密钥
- `BASE_URL`：模型服务的接口地址
- `MODEL_NAME`：你要调用的模型名称

### 方式 B：通过页面中的 API Key 管理功能

项目启动后，可以进入页面左侧的 **API Key 管理** 页面，填写：

- 模型提供商（provider）
- 模型名称（model）
- API Key
- Base URL

然后：

1. 点击 **测试配置**
2. 测试通过后点击 **保存配置**

> 建议优先确认配置测试通过，再进行正式对话。

---

## 9. 启动项目

在项目根目录、虚拟环境已激活的前提下，执行：

```bash
uvicorn app.main:app --reload
```

如果启动成功，终端里通常会看到类似输出：

```text
Uvicorn running on http://127.0.0.1:8000
```

### 9.1 浏览器访问地址

打开浏览器，访问：

```text
http://127.0.0.1:8000
```

如果页面正常打开，说明前端和后端已经至少基本联通。

---

## 10. 首次使用建议流程

建议第一次运行时，按下面顺序操作：

### 第一步：进入 API Key 管理页面

填写：

- provider
- model
- api key
- base url

### 第二步：点击“测试配置”

如果测试通过，说明后端可以成功连接到模型服务。

### 第三步：点击“保存配置”

保存当前本地配置。

### 第四步：返回 AI 助手页面

点击左侧 **新建对话**。

### 第五步：发送第一条消息

例如：

```text
你好
```

如果模型返回了正常回复，说明核心链路已经跑通。

---

## 11. 会话容器怎么理解

本项目不是简单的单轮对话页面，而是有“会话容器”概念：

- 每次新建对话，会生成一个新的会话容器
- 左侧会显示一条会话记录
- 会话标题通常取第一次提问作为标题
- 点击左侧会话记录，可以切回对应会话
- 同一会话继续提问，会保留上下文

你可以把它理解成 GPT / Kimi 左侧聊天列表的简化版。

---

## 12. 快速检查项目是否运行正常

如果你想快速判断项目是否部署成功，可以用下面这份检查清单：

### 后端检查

- [ ] `uvicorn app.main:app --reload` 能正常启动
- [ ] 终端没有导入错误
- [ ] 浏览器能打开 `127.0.0.1:8000`

### 页面检查

- [ ] 首页能正常显示
- [ ] 左侧导航能切换页面
- [ ] 快速入门能正常显示
- [ ] API Key 管理页面能打开
- [ ] AI 助手页面能发送消息

### 模型调用检查

- [ ] API 配置测试通过
- [ ] 发出“你好”后能收到回复
- [ ] 左侧会话容器能显示第一条提问标题

---

## 13. 常见问题排查

### 13.1 `python3: command not found`

说明当前系统里没有安装 Python，或者命令名不对。

先检查：

```bash
python3 --version
```

如果没有输出版本号，请重新安装 Python。

---

### 13.2 虚拟环境激活失败

如果执行：

```bash
source .venv/bin/activate
```

报错，先检查 `.venv` 是否真的创建成功：

```bash
ls -la
```

如果没有 `.venv` 目录，重新执行：

```bash
python3 -m venv .venv
```

---

### 13.3 `ModuleNotFoundError`

说明依赖没有装完整，重新执行：

```bash
pip install -r requirements.txt
```

如果 `requirements.txt` 不完整，就手动补装相关依赖。

---

### 13.4 访问页面时 401 / Incorrect API key

这通常说明当前后端实际使用的 API Key 不正确。你需要检查：

- `.env` 中的配置是否正确
- 页面中的 API Key 管理是否保存成功
- 当前 `provider / base_url / model` 是否匹配

如果你改过配置，建议重启服务再试。

---

### 13.5 页面打开了，但按钮没反应

优先检查浏览器控制台：

1. 按 `F12`
2. 打开 `Console`
3. 查看是否有 JavaScript 报错

如果前端静态文件刚改过，也要记得强制刷新：

```text
Ctrl + F5
```

---

### 13.6 会话列表加载失败

可能原因包括：

- 本地聊天记录文件格式不兼容
- `data/chat_history.json` 内容损坏
- 旧版本历史记录和新版本会话格式不一致

如果确认当前数据不重要，可以先备份再删除：

```bash
mv data/chat_history.json data/chat_history_backup.json
```

然后重新启动项目。

---

### 13.7 端口被占用

如果 8000 端口被占用，可以换一个端口运行：

```bash
uvicorn app.main:app --reload --port 8001
```

然后访问：

```text
http://127.0.0.1:8001
```

---

## 14. 如何停止服务

在当前终端按：

```text
Ctrl + C
```

即可停止 FastAPI 服务。

---


