## 1. How to Run

```bash
docker compose up --build -d
```

## 2. Services

| 服务 | 地址 |
|---|---|
| 前端用户端 | http://localhost:8082 |

## 3. 测试账号

本项目为纯前端应用，登录/注册使用 Mock 认证。任意邮箱和密码即可登录：

| 邮箱 | 密码 |
|---|---|
| user@test.com | 123456 |

## 4. 题目内容

基于 Vue 的 Web 前端应用，面试能力提升平台的前端部分，包含题库展示、模拟面试、学习记录等功能模块。

## 5. 项目结构

```
label-02099/
├── docker-compose.yml              # Docker 编排
├── docs/
│   ├── Requirements.md             # 需求规格
│   ├── Roadmap.md                  # 项目路线图
│   ├── DesignSpec.md               # 设计规范
│   ├── AuditReport.md              # 审计报告
│   ├── SelfTestReport.md           # 自测报告
│   └── .meta/
│       └── original_prompt.md      # 原始 Prompt
├── frontend-user/
│   ├── Dockerfile                  # 多阶段构建
│   ├── nginx.conf                  # Nginx SPA 配置
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── main.js                 # 应用入口
│       ├── App.vue                 # 根组件
│       ├── router/index.js         # 路由配置 (11 条)
│       ├── stores/                 # Pinia 状态管理
│       │   ├── auth.js             # 认证状态
│       │   ├── questions.js        # 题库状态
│       │   ├── interview.js        # 面试状态
│       │   ├── records.js          # 学习记录
│       │   └── favorites.js        # 收藏管理
│       ├── mock/                   # Mock 数据层
│       │   ├── index.js            # Axios 拦截器
│       │   └── questions.js        # 32 道面试题
│       ├── utils/
│       │   ├── logger.js           # 统一日志
│       │   ├── date.js             # 日期格式化
│       │   └── request.js          # HTTP 封装
│       ├── components/
│       │   ├── layout/             # 布局组件
│       │   └── common/             # 通用组件
│       ├── views/                  # 页面视图
│       │   ├── Home.vue            # 首页 Dashboard
│       │   ├── NotFound.vue        # 404 页面
│       │   ├── questions/          # 题库模块
│       │   ├── interview/          # 面试模块
│       │   └── records/            # 记录模块
│       └── styles/
│           └── main.css            # 全局样式
└── README.md
```

## 6. API 模拟与切换指南

当前所有后端 API 通过 Axios 请求拦截器在前端本地模拟，无需真实后端服务。

**Mock 模式（当前默认）：**
- `src/mock/index.js` 中的 `setupMock()` 拦截所有 `/api/*` 请求
- 在 `src/main.js` 中调用 `setupMock()` 激活

**切换为真实 API：**
1. 在 `src/main.js` 中注释或移除 `setupMock()` 调用
2. 在 `vite.config.js` 中配置代理：
   ```js
   server: {
     proxy: {
       '/api': {
         target: 'http://your-backend:3000',
         changeOrigin: true
       }
     }
   }
   ```
3. 生产环境在 `nginx.conf` 中添加反向代理：
   ```nginx
   location /api/ {
       proxy_pass http://backend:3000/api/;
   }
   ```
