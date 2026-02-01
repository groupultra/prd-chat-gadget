# PRD Chat Gadget

Lark/飞书小程序，用于快速查询 PRD 文档。通过飞书"+"菜单打开，提供类似 ChatGPT 的对话界面。

## 架构

```
┌──────────────────────────────────────────────────┐
│  Lark "+" 菜单 → 打开 Gadget                     │
└──────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────┐
│  前端 Gadget (本 repo)                           │
│  - 简单聊天界面                                   │
│  - 输入问题 → 显示答案                           │
└──────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────┐
│  后端 API (ask-pm repo)                          │
│  POST /ask                                       │
│  - 搜索 PRD 文档                                 │
│  - 返回答案和来源                                │
└──────────────────────────────────────────────────┘
```

## 项目结构

```
prd-chat-gadget/
├── project.config.json     # Lark Gadget 配置
├── app.json                # 小程序配置
├── app.ts                  # 小程序入口
├── app.ttss                # 全局样式
├── pages/
│   └── chat/               # 主页面（聊天界面）
│       ├── index.ts
│       ├── index.ttml
│       ├── index.json
│       └── index.ttss
└── services/
    └── api.ts              # 后端 API 调用
```

## 功能

- **单轮对话**: 输入问题，获取 PRD 相关答案
- **来源展示**: 显示答案来源的 PRD 文档链接
- **API Key 认证**: 通过 X-API-Key header 认证

## API 接口

**请求**:
```
POST https://prd.myintent.cc/ask
X-API-Key: xxx
Content-Type: application/json

{"query": "语音克隆的授权流程？"}
```

**响应**:
```json
{
  "type": "search",
  "answer": "语音克隆授权流程包括...",
  "sources": [
    {
      "file": "features/voice.md",
      "title": "语音克隆",
      "url": "https://github.com/..."
    }
  ]
}
```

## 开发

### 环境准备

1. 安装[飞书开发者工具](https://open.feishu.cn/document/tools-and-resources/gadget-ide/install)
2. 在飞书开放平台创建小程序应用

### 本地开发

1. 用飞书开发者工具打开本项目
2. 配置 API Key（在 services/api.ts 中）
3. 使用"真机预览"测试

### 部署

1. 在飞书开发者工具中"上传"
2. 在飞书开放平台提交审核
3. 审核通过后发布

## 配置

需要在飞书开放平台配置：

1. **应用类型**: 小程序
2. **应用能力**: 群聊工具栏（"+"菜单）
3. **网络请求域名**: `prd.myintent.cc`

## 相关项目

- [ask-pm](https://github.com/groupultra/ask-pm) - 后端 API 服务
