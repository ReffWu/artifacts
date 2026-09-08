# Artifacts Repository Guidelines (AGENTS.md)

本项目是 Reff 的个人实地调研、决策指南与交互式工具集合中心（发布于 `https://reffwu.github.io/artifacts/`）。

## 核心设计与工程铁律 (Must Follow)

### 1. 顶栏导航规范 (Top Navigation Protocol - 强制统一基准)
- **唯一基准范本**：所有 Artifacts 页面最上方的 UI 风格（顶部导航栏）必须严格统一为 `https://reffwu.github.io/artifacts/toknotch/` 的结构与设计语言。
- **标准 HTML 骨架**：
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
        <span class="nav-tag">[当前页面分类/定位，例如：macOS App / 房产实勘 · 30套精选]</span>
        <button class="theme-toggle" aria-label="切换深浅主题"></button>
      </div>
    </div>
  </nav>
  ```
- **样式规范**：严禁在各子页面内手写私有 top-nav 样式，一律直接继承底层 `../shared/theme.css`。

### 2. 统一主题与底层资产
- 所有子页面在 `<head>` 中必须统一引入：
  ```html
  <link rel="stylesheet" href="../shared/theme.css">
  <script src="../shared/theme.js"></script>
  ```
- **支持暗色/亮色双模自适应**：
  - 自动跟随 macOS/iOS 系统偏好；
  - 支持 `.theme-toggle` 点击手动切换；
  - 跨标签页秒级实时联动。

### 3. 内容决定布局
- 极简、克制、精致是永恒美学基线；
- 排版必须针对内容的使用场景（如房产决策流、美食探店、工具下载）设计最高效的排列与展示方式，绝不生搬硬套；
- 100% 真实素材（严禁 AI 虚构图，实勘实拍与官方存证）；
- 移动端无界通透排版。

### 4. 发布与归档
- 新增页面必须在根目录 `index.html` 的网格列表中同步增加对应的索引卡片；
- 提交并推送至 `main` 分支自动由 GitHub Pages 发布。
