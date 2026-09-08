# Reff · Artifacts

实地调研、决策指南与交互式工具集合中心。

## 架构规范与统一主题协议

为确保全站（主页以及未来所有新增的 Artifacts）风格一致、主题联动，本项目采用统一的底层共享系统：

### 1. 共享资源目录 (`/shared/`)
- `shared/theme.css`: 全站统一定义的 CSS 变量系统（OLED 纯黑暗色模式、清爽亮色模式、系统偏好检测、无界布局排版）。
- `shared/theme.js`: 全局统一的主题控制器：
  - 首屏防闪烁（FOUC 拦截）；
  - 自动跟随系统外观（`prefers-color-scheme`）；
  - 手动模式切换与本地持久化（`localStorage('reff_theme')`）；
  - **跨页面 / 跨标签页实时同步**（`storage` 监听器，任何一页切换，其余所有已打开的 Artifact 页面瞬间同步切换）；
  - 自动为 `.theme-toggle` 按钮注入 Sun/Moon 图标并绑定事件。

### 2. 新增 Artifact 的标准引入方式
未来任何新增的子页面（如 `my-tool/index.html`），只需遵循以下三步：
1. **在 `<head>` 中引入统一主题资产**：
   ```html
   <link rel="stylesheet" href="../shared/theme.css">
   <script src="../shared/theme.js"></script>
   ```
2. **在导航栏中放置标准切换按钮**：
   ```html
   <button class="theme-toggle" aria-label="切换深浅主题"></button>
   ```
3. **样式使用统一色彩变量**：
   `var(--bg)`, `var(--card)`, `var(--text)`, `var(--text-dim)`, `var(--stroke)`, `var(--accent)` 等。

### 3. 内容决定布局（变通原则）
美学基线看齐 Riffle（极简、克制、精致）。不同内容依据决策流使用最贴合的交互排版，杜绝生搬硬套。

### 4. 顶栏导航规范 (Top Navigation Protocol)
**唯一基准范本**：所有 Artifacts 页面顶栏（Top Bar / Nav）必须严格统一为 `https://reffwu.github.io/artifacts/toknotch/` 的组件语言与排版结构。
```html
<nav class="top-nav">
  <div class="shell nav-inner">
    <a href="../index.html" class="back-link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
      </svg>
      <span>返回 Artifacts 中心</span>
    </a>
    <div class="nav-right">
      <span class="nav-tag">[当前分类标签，如：macOS App / 房产实勘 · 30套精选]</span>
      <button class="theme-toggle" aria-label="切换深浅主题"></button>
    </div>
  </div>
</nav>
```
所有样式（54px 高度、贴顶吸附、毛玻璃模糊、发丝线底边、细 SVG 箭头及 32px 圆形切换按钮）由 `shared/theme.css` 统一提供，严禁子页面重复重写私有 top-nav 样式。
