# 需求规格说明书 — 面试能力提升平台（前端）

## 1. 项目概述

基于 Vue 3 的 Web 前端应用，为用户提供面试能力提升服务。平台包含题库展示、模拟面试、学习记录三大核心功能模块，帮助用户系统化地准备技术面试。

**项目类型**：纯前端 SPA（后端 API 全部 Mock）

## 2. 技术栈

| 层面 | 选型 |
|---|---|
| 框架 | Vue 3 (Composition API + `<script setup>`) |
| 构建 | Vite 5 |
| 路由 | Vue Router 4 |
| 状态管理 | Pinia |
| UI 组件库 | Element Plus |
| CSS 方案 | Tailwind CSS 3 |
| HTTP 请求 | Axios |
| Mock 方案 | Mock Service Worker (MSW) / 内置 JSON Mock |
| 容器化 | Nginx + Docker |

## 3. 功能模块

### 3.1 首页 / Dashboard

- 平台简介 & 核心功能入口
- 学习统计概览（今日刷题数、连续学习天数、正确率趋势）
- 推荐题目卡片（随机推荐 3-5 道题目）
- 快速开始模拟面试入口

### 3.2 题库展示模块

- **题目列表页**
  - 支持按分类筛选（前端、后端、算法、系统设计、行为面试）
  - 支持按难度筛选（简单 / 中等 / 困难）
  - 关键词搜索
  - 分页加载
  - 列表项展示：题目标题、分类标签、难度等级、完成状态
- **题目详情页**
  - 题目描述
  - 参考答案（可折叠展示）
  - 答题笔记（用户可编辑并保存到本地）
  - 标记收藏功能
  - 上一题 / 下一题导航

### 3.3 模拟面试模块

- **面试配置页**
  - 选择面试类型（技术面试 / 行为面试 / 综合面试）
  - 选择难度级别
  - 选择题目数量（5 / 10 / 15 / 20 题）
  - 是否计时
- **面试进行页**
  - 逐题展示模式
  - 倒计时器（可选，每题限时）
  - 用户作答区域（文本输入）
  - 跳过 / 下一题按钮
  - 进度条显示
- **面试结果页**
  - 总结评分（基于作答完成度）
  - 每题回顾：用户答案 vs 参考答案对比
  - 薄弱环节分析（按分类统计正确率）
  - 保存本次面试记录

### 3.4 学习记录模块

- **学习概览页**
  - 学习日历热力图（类似 GitHub Contribution Graph）
  - 累计刷题数、面试次数、收藏题数
  - 各分类掌握度雷达图
- **刷题记录列表**
  - 时间线展示，按日期分组
  - 每条记录：题目名称、作答时间、是否正确
- **面试记录列表**
  - 历次模拟面试汇总
  - 点击查看详细回顾
- **收藏夹**
  - 已收藏题目列表
  - 支持取消收藏

### 3.5 全局功能

- **顶部导航栏**：Logo、首页、题库、模拟面试、学习记录、用户头像
- **用户登录/注册**：Dialog 形式（Mock 认证，不跳转 404）
- **暗色模式切换**
- **响应式布局**：适配桌面端和平板端
- **面包屑导航**
- **404 页面**

## 4. 数据 Mock 策略

所有后端接口通过本地 Mock 实现，包括：

| 接口 | 说明 |
|---|---|
| `GET /api/questions` | 题目列表（支持分页、筛选） |
| `GET /api/questions/:id` | 题目详情 |
| `POST /api/auth/login` | 模拟登录 |
| `POST /api/auth/register` | 模拟注册 |
| `GET /api/interviews` | 面试记录列表 |
| `POST /api/interviews` | 创建模拟面试 |
| `GET /api/interviews/:id` | 面试详情 |
| `GET /api/stats/overview` | 学习统计概览 |
| `GET /api/stats/calendar` | 学习日历数据 |
| `GET /api/favorites` | 收藏列表 |
| `POST /api/favorites/:id` | 添加/取消收藏 |
| `GET /api/notes/:questionId` | 获取笔记 |
| `PUT /api/notes/:questionId` | 保存笔记 |

Mock 数据要求：
- 题库不少于 **30 道**题目，覆盖全部 5 个分类
- 每个难度至少 8 道题
- 预置 2-3 条面试历史记录
- 日历数据覆盖最近 30 天

## 5. 页面路由

| 路由 | 页面 |
|---|---|
| `/` | 首页 Dashboard |
| `/questions` | 题库列表 |
| `/questions/:id` | 题目详情 |
| `/interview` | 面试配置 |
| `/interview/session` | 面试进行中 |
| `/interview/result/:id` | 面试结果 |
| `/records` | 学习记录概览 |
| `/records/questions` | 刷题记录 |
| `/records/interviews` | 面试记录 |
| `/records/favorites` | 收藏夹 |
| `/:pathMatch(.*)*` | 404 页面 |

## 6. 非功能性需求

- **性能**：首屏加载 < 3s（Gzip + 代码分割）
- **兼容性**：Chrome 90+、Firefox 90+、Safari 15+
- **可访问性**：语义化 HTML、合理的 ARIA 标签
- **国际化**：当前版本仅中文

## 7. 约束与注意事项

- 所有功能按钮必须绑定实际功能或移除入口（禁止死按钮）
- 禁止使用原生 `alert/confirm/prompt`，统一使用 Element Plus 的 Message/Dialog
- 日期格式统一：`yyyy-MM-dd HH:mm:ss`
- 用户数据持久化使用 `localStorage`（无真实后端）
- 禁止散落 `console.log`，使用统一 Logger 工具

## 8. 交付标准

- `docker compose up --build -d` 一键启动
- Nginx 容器暴露 Web 服务，通过 `localhost:8081` 可访问
- 所有页面路由可正常跳转，无空白页
- Mock 数据完整，功能可交互演示
