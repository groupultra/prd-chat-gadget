# PRD Chat Web App

飞书 Web App，用于快速查询 PRD 文档。通过飞书"+"菜单打开，提供类似 ChatGPT 的对话界面。

## 架构

```
┌──────────────────────────────────────────────────┐
│  飞书 "+" 菜单 → 打开 Web App                     │
└──────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────┐
│  前端 Web App (本 repo)                          │
│  - Next.js + Tailwind CSS                        │
│  - 部署在 Vercel                                 │
│  - /api/ask 转发请求（隐藏 API Key）             │
└──────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────┐
│  后端 API (ask-pm repo)                          │
│  POST https://prd.myintent.cc/ask                │
│  - 搜索 PRD 文档                                 │
│  - 返回答案和来源                                │
└──────────────────────────────────────────────────┘
```

## 项目结构

```
prd-chat-gadget/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 聊天页面
│   ├── globals.css         # 全局样式
│   └── api/ask/route.ts    # API 转发（隐藏密钥）
├── package.json
├── tailwind.config.js
└── next.config.js
```

## 本地开发

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 PRD_API_KEY

# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000

## 部署到 Vercel

### 方式一：通过 Vercel Dashboard

1. 在 [Vercel](https://vercel.com) 导入 GitHub 仓库
2. 在 Settings → Environment Variables 添加：
   - `PRD_API_KEY` = `你的API密钥`
3. 部署完成后获取 URL（如 `https://prd-chat-gadget.vercel.app`）

### 方式二：通过 GitHub Secrets + Vercel CLI

1. 在 GitHub 仓库设置 Secrets：
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `PRD_API_KEY`

2. 创建 `.github/workflows/deploy.yml`（可选，自动部署）

## 飞书配置

部署完成后，在 [飞书开放平台](https://open.feishu.cn) 配置：

1. **应用信息**
   - AppID: `cli_a9f510bd41785ed1`

2. **Web App 配置**
   - Desktop homepage: `https://你的域名.vercel.app`
   - Mobile homepage: `https://你的域名.vercel.app`

3. **扩展功能**
   - 启用 "+" menu shortcut

4. **发布应用**

## 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `PRD_API_KEY` | PRD 后端 API 密钥 | `EslgAkoe3h...` |

## 相关项目

- [ask-pm](https://github.com/groupultra/ask-pm) - 后端 API 服务
