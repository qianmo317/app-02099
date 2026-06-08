# 设计规范 — 面试提升平台

## 1. 设计方向

**Modern Editorial** — 专业严谨但不沉闷，以深海军蓝为基底，翡翠绿为活力点缀，大面积留白搭配精致卡片式布局，给人以专注、高效的学习氛围。

## 2. 调色板

| Token | 色值 | 用途 |
|---|---|---|
| `--navy-900` | #1a2332 | 主色 / 深色背景 |
| `--navy-800` | #243b53 | 次级深色 |
| `--navy-700` | #334e68 | 侧边栏 / 卡片深色 |
| `--brand-400` | #42c793 | 品牌绿 / 主操作按钮 |
| `--brand-500` | #1aad79 | 品牌绿深 / hover |
| `--amber-400` | #f59e0b | 警示 / 高亮 |
| `--rose-400` | #fb7185 | 困难 / 错误 |
| `--slate-50` | #f8fafc | 页面背景（亮色模式） |
| `--slate-100` | #f1f5f9 | 卡片背景 |

## 3. 排版

| 层级 | 字体 | 字号 | 字重 |
|---|---|---|---|
| H1 | Plus Jakarta Sans | 32px | 800 |
| H2 | Plus Jakarta Sans | 24px | 700 |
| H3 | Plus Jakarta Sans | 18px | 600 |
| Body | Noto Sans SC | 14px | 400 |
| Caption | Noto Sans SC | 12px | 300 |

## 4. 间距

- 页面内边距：32px
- 卡片间距：20px
- 卡片内边距：24px
- 组件间距：12px

## 5. 圆角

- 大卡片：16px
- 按钮：10px
- 标签：6px
- 头像：50%

## 6. 阴影

- 卡片：`0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`
- 悬浮：`0 10px 25px rgba(0,0,0,0.08)`
- 导航栏：`0 1px 0 rgba(0,0,0,0.05)`

## 7. 动效

- 过渡默认：`all 0.2s ease`
- 卡片悬浮：translateY(-2px) + shadow 提升
- 页面切换：fade 0.15s
- 进度条：width transition 0.6s ease-in-out
