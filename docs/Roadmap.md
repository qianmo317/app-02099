# 项目路线图 — 面试能力提升平台（前端）

## Phase 1: 项目骨架
- [x] Git 初始化 & .gitignore
- [x] 项目目录结构搭建
- [x] docker-compose.yml 骨架
- [x] docs/Roadmap.md

## Phase 2: UI 设计与组件
- [x] docs/DesignSpec.md（设计规范）
- [x] 全局布局组件（AppLayout / AppHeader / AppBreadcrumb）
- [x] 首页 Dashboard
- [x] 题库列表页 & 详情页
- [x] 模拟面试配置 / 进行 / 结果页
- [x] 学习记录概览 / 刷题记录 / 面试记录 / 收藏夹
- [x] 404 页面
- [x] 登录注册 Dialog

## Phase 3: 逻辑实现
- [x] Mock 数据层（32 道题目，5 分类全覆盖）
- [x] Pinia 状态管理（auth / questions / interview / records / favorites）
- [x] Axios 请求封装 & Mock 拦截
- [x] Logger 工具 & 日期格式化
- [x] 全部页面联调

## Phase 4: 质量保障
- [x] Docker 构建验证 (PASS)
- [x] 页面路由冒烟测试 (11/11 PASS)
- [x] Mock 数据完整性校验 (PASS)

## Phase 5: 审计
- [x] 对照 audit-rules.md 检查合规性 (6/6 PASS)
- [x] 生成 AuditReport.md

## Phase 6: 部署交付
- [x] 端口标准化（8081）
- [x] SelfTestReport.md
- [x] README.md
- [x] 最终验证 (localhost:8081 → 200 OK)
