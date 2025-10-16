# 🚀 IDT Portfolio - Zitong Wang

> **"Integrating technology and human experience: A portfolio of innovative, user-centered systems bridging functionality with creativity."**

一个专为港大 IDT (Information and Data Technology) 申请设计的作品集网站，采用 **Tech Minimalism + 未来科技感** 的设计风格。

## ✨ 特色

- 🎨 **深色科技风格**：深色背景 + 霓虹蓝/紫色点缀
- 💫 **流畅动画**：淡入淡出、卡片翻转、3D 悬停效果
- 📱 **完全响应式**：适配所有设备
- 🎯 **用户体验优先**：清晰的导航和信息架构
- ⚡ **高性能**：优化的加载和交互体验

## 📋 网站结构

### 🏠 Home - 序章
- Hero 部分：核心理念展示
- 时间轴：从功能到体验的成长旅程
- 4 个关键项目里程碑

### 🧪 Projects - 核心项目
展示 5 个精选项目：
1. **Dwen Dwen's Neighbor** - 动物保护教育平台
2. **Guess Songs** - 实时多人音乐游戏
3. **Digital Mahjong** - 算法与交互探索
4. **Chinese Medicine Recommendation** - AI 推荐系统
5. **Parrot Ordering System** - 全栈工作流系统

### 🔍 Behind the Scenes - 设计思考
展示设计过程的 4 个维度（卡片翻转效果）：
- 🧠 用户思维
- 🪄 交互逻辑
- 🛠️ 技术架构
- 📐 视觉设计

### 👤 About Me - 关于我
- 个人背景
- 设计理念
- 兴趣与技能

### 📞 Contact - 联系方式
- Email / GitHub / LinkedIn
- CV 下载

## 🛠️ 技术栈

- **后端**: Flask 2.3.3 (Python)
- **前端**: HTML5, CSS3 (CSS Variables), JavaScript (ES6+)
- **设计**: Inter 字体, 渐变效果, CSS 动画
- **部署**: Render (已配置)

## 💻 本地运行

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd Portfolio
```

### 2. 安装依赖
```bash
pip3 install -r requirements.txt
```

### 3. 运行应用
```bash
python3 app.py
```

### 4. 访问网站
打开浏览器访问：`http://localhost:5000`

## 📁 项目结构

```
Portfolio/
├── app.py                 # Flask 应用主文件（路由 + 数据）
├── requirements.txt       # Python 依赖
├── Procfile              # Render 部署配置
├── render.yaml           # Render YAML 配置
├── README.md             # 项目说明
│
├── templates/            # HTML 模板
│   ├── base.html         # 基础模板（导航栏）
│   ├── home.html         # 首页（Hero + 时间轴）
│   ├── projects.html     # 项目列表
│   ├── project_detail.html  # 项目详情
│   ├── behind_scenes.html   # 设计过程
│   ├── about.html        # 关于我
│   └── contact.html      # 联系页面
│
└── static/               # 静态资源
    ├── css/
    │   └── style.css     # 全局样式（深色主题）
    ├── js/
    │   └── main.js       # 交互动画
    └── documents/        # 文档资源（如 CV）
```

## 🎨 设计系统

### 配色方案
```css
--bg-primary: #0a0e27      /* 主背景 */
--bg-secondary: #151934    /* 次级背景 */
--bg-card: #1a1f3a         /* 卡片背景 */

--neon-blue: #00d9ff       /* 霓虹蓝 */
--neon-purple: #a78bfa     /* 霓虹紫 */
--neon-pink: #ff006e       /* 霓虹粉 */
--neon-green: #4ade80      /* 霓虹绿 */

--text-primary: #e2e8f0    /* 主文字 */
--text-secondary: #94a3b8  /* 次级文字 */
```

### 字体
- **主字体**: Inter (Google Fonts)
- **字重**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold), 800 (Extra-bold)

### 动画效果
- 淡入淡出（fadeIn/fadeOut）
- 上滑动画（fadeInUp）
- 左右滑动（fadeInLeft/Right）
- 卡片翻转（3D Flip）
- 悬停效果（Hover Transform）

## 🚀 部署到 Render

项目已配置好 Render 部署：

1. 将代码推送到 GitHub
2. 在 Render 中连接你的 GitHub 仓库
3. Render 会自动检测 `render.yaml` 配置
4. 自动构建和部署

### 环境变量
- `FLASK_ENV`: production
- `PORT`: 10000（Render 默认）

## 📝 自定义修改

### 修改个人信息
编辑 `templates/contact.html`：
- 邮箱地址
- GitHub 链接
- LinkedIn 链接

### 添加/修改项目
编辑 `app.py` 中的 `PROJECTS` 列表

### 修改配色
编辑 `static/css/style.css` 中的 `:root` CSS 变量

### 添加 CV
将 PDF 文件放入 `static/documents/` 文件夹，并更新 `contact.html` 中的下载链接

## 🎯 设计理念

这个作品集遵循 **"Tech Minimalism"** 设计原则：

1. **内容优先**：清晰的信息层级
2. **视觉简洁**：去除冗余元素
3. **科技感**：霓虹色 + 深色背景
4. **交互流畅**：精心设计的动画和过渡
5. **响应式**：完美适配各种设备

## 📄 许可

MIT License - 自由使用和修改

## 💡 致谢

设计灵感来源于现代科技公司（Apple, SpaceX）的展示风格，融合了极简主义和未来科技感。

---

**Made with ❤️ for HKU IDT Application**
