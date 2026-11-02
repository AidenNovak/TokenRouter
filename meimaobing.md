# 没猫饼 · TokenRouter 定制公告

本文件记录本 fork 相对上游 TokenRouter 的每一次定制。每条记录以公告形式追加，最新记录放在最上方；技术标识（API 请求头、配置键名、Go 包路径）保持上游原样，避免影响兼容性与上游合并。

## 2026-11-03 · 页脚与公开页面 Logo 回退修正

- **问题**：首页页脚、API Key 用量公开页与法律文档页在未配置自定义 Logo 时回退到上游的蓝色 `logo.svg`，品牌不一致。
- **修正**：三处回退统一改为没猫饼 `logo.png`，与登录页、顶栏保持一致；上游 `logo.svg` 文件保留，不再作为默认展示。
- **验证**：重建镜像并重新部署后，Playwright 确认首页页脚 `<img>` 实际加载 `/logo.png`（128×128），截图中页脚为没猫饼图标。

## 2026-11-03 · 本地品牌镜像重建与部署

- **镜像**：使用仓库根目录 `Dockerfile` 重建品牌镜像，前端在容器内编译并嵌入 Go 二进制，标签为本地 `tokenrouter-meimaobing:local`。默认 `goproxy.cn` 不可达时用 `--build-arg GOPROXY=https://proxy.golang.org,direct --build-arg GOSUMDB=sum.golang.org`。
- **部署**：新增 `deploy/docker-compose.meimaobing.yml`，叠加在上游 compose 之后，把 `tokenrouter` 服务固定到本地品牌镜像并设置 `pull_policy: never`，避免被上游 `latest` 覆盖。
- **数据**：保留现有 PostgreSQL / Redis 数据卷与 `.env` 配置；新容器启动时自动执行迁移（`308_meimaobing_brand.sql` 幂等）。
- **验证**：容器 healthy，登录页、顶栏与 Dashboard 显示「没猫饼」、品牌 Logo 和玫瑰色主题。

## 2026-11-03 · 品牌薄层 v1：站点名称、Logo 与玫瑰色主题

- **站点名称**：默认展示名由 TokenRouter 改为「没猫饼」，英文界面显示 Meimaobing。迁移只改写仍为上游默认名的安装，管理员自定义名称不受影响。
- **Logo**：默认 Logo 与 favicon 替换为没猫饼猫饼图标（`frontend/public/logo.png`），登录页、顶栏与公开用量页回退同步更新。
- **主题色**：主色由青蓝切换为没猫饼玫瑰色系，主色 `#734049`、悬停 `#5c3239`、浅色页面底 `#efe6e8`、暗色页面底 `#241c20`；按钮、链接、聚焦环、选中色、引导弹窗与图表强调色同步更新。
- **品牌文案**：界面翻译在加载时按语言把 TokenRouter / TokenFlux 替换为「没猫饼」/ Meimaobing，无需逐条修改上游语言包；后续新增语言同样生效。
- **归属声明**：本项目基于 TokenRouter 构建，保留上游 LGPL-3.0-or-later 许可证与版权声明；仓库链接指向本 fork。
- **验证**：Mac mini 上完成前端构建；Playwright 实机截图确认首页、登录页与后台的品牌名称、Logo 和主色生效。
