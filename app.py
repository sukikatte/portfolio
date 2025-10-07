from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

# 项目数据
PROJECTS = [
    {
        'id': 'dwen-dwen',
        'title': "Dwen Dwen's Neighbor",
        'subtitle': 'Designing for Conservation Awareness',
        'tags': ['Team Project', 'System Architecture + UX', 'Firebase + Animation'],
        'icon': '🐼',
        'color': '#4ECDC4',
        'description': '一个模块化动物保护教育平台，融合互动百科、虚拟养成和公益参与',
        'highlights': [
            'Firebase 实时数据库支持多人协作开发',
            '卡片式百科 UI、交互式地图、动画式熊猫养成体验',
            '"轻公益"视觉设计：捐赠页采用海报风格'
        ],
        'achievement': '大学创新创业大赛优秀奖 + 三等奖',
        'tech_stack': ['Python', 'Flask', 'Firebase', 'JavaScript', 'ECharts'],
        'github': 'https://github.com/sukikatte/dwen_dwens_neighbour'
    },
    {
        'id': 'guess-songs',
        'title': 'Guess Songs',
        'subtitle': 'Real-time Multiplayer Music Game',
        'tags': ['Solo Project', 'Cloud + Realtime DB', 'Game + Interaction'],
        'icon': '🎵',
        'color': '#FF6B6B',
        'description': '从 0 构建的轻量级音乐问答游戏，强调实时交互和用户体验',
        'highlights': [
            '使用 Firebase Realtime Database 实现多设备同步',
            '自建音频云存储系统绕过 API 限制',
            '游戏机制设计：限时、计分、排行榜'
        ],
        'tech_stack': ['Firebase', 'Cloud Storage', 'Real-time Database', 'JavaScript'],
        'github': '#'
    },
    {
        'id': 'mahjong',
        'title': 'Digital Mahjong',
        'subtitle': 'Algorithmic Thinking Meets User Experience',
        'tags': ['Algorithm + UI', 'Early Work'],
        'icon': '🀄',
        'color': '#95E1D3',
        'description': '从功能实现入手的桌面麻将游戏算法与交互探索',
        'highlights': [
            '核心算法设计（番型计算、状态机）',
            '教师评价"缺乏用户思维"成为转折点',
            '功能导向向用户导向的思维转变'
        ],
        'tech_stack': ['Python', 'Algorithm Design', 'Game Logic'],
        'github': '#'
    },
    {
        'id': 'chinese-medicine',
        'title': 'Chinese Medicine Recommendation',
        'subtitle': 'Technology in Everyday Life',
        'tags': ['AI + Recommendation', 'Database'],
        'icon': '🌿',
        'color': '#A8E6CF',
        'description': '以数据为驱动的个性化中药推荐系统',
        'highlights': [
            '数据清洗、知识图谱结构',
            '用户输入 → 推荐逻辑流程',
            'AI + 服务设计融合探索'
        ],
        'tech_stack': ['Python', 'Machine Learning', 'Database', 'Recommendation System'],
        'github': '#'
    },
    {
        'id': 'parrot-ordering',
        'title': 'Parrot Ordering System',
        'subtitle': 'Designing Seamless Workflows',
        'tags': ['Full-Stack', 'Web + Database + UX'],
        'icon': '🦜',
        'color': '#FFD93D',
        'description': '支持注册、点单、聊天、评价、主题切换等功能的综合性系统',
        'highlights': [
            '全流程交互设计（用户 → 厨师 → 管理员）',
            'AJAX + Firebase 数据交互',
            '可定制的主题和用户个性化界面'
        ],
        'tech_stack': ['Full-Stack', 'AJAX', 'Firebase', 'UX Design'],
        'github': '#'
    }
]

# 时间轴数据
TIMELINE = [
    {
        'year': 'Sophomore year',
        'project': 'Digital Mahjong',
        'description': '从功能出发'
    },
    {
        'year': 'Junior year',
        'project': 'Guess Songs',
        'description': '技术+交互'
    },
    {
        'year': 'Junior year',
        'project': "Dwen Dwen's Neighbor",
        'description': '系统 + 用户体验整合'
    },
    {
        'year': 'Senior year',
        'project': '中药/Parrot',
        'description': '服务设计与社会价值探索'
    }
]

# Behind the Scenes 数据
BEHIND_SCENES = [
    {
        'icon': '🧠',
        'title': '用户思维',
        'front': 'User-Centered Design',
        'back': 'Persona 设计、用户旅程图、需求分析、可用性测试'
    },
    {
        'icon': '🪄',
        'title': '交互逻辑',
        'front': 'Interaction Design',
        'back': '流程图、状态图、原型设计、交互模式库'
    },
    {
        'icon': '🛠️',
        'title': '技术架构',
        'front': 'System Architecture',
        'back': '系统设计、数据库结构、API 设计、性能优化'
    },
    {
        'icon': '📐',
        'title': '视觉设计',
        'front': 'Visual Design',
        'back': '动画设计、配色系统、排版规范、设计系统'
    }
]

@app.route('/')
def home():
    # 全屏滚动单页版本
    return render_template('index_fullpage.html', timeline=TIMELINE, projects=PROJECTS, cards=BEHIND_SCENES)

@app.route('/old')
def home_old():
    # 旧版多页版本
    return render_template('home.html', timeline=TIMELINE)

@app.route('/projects')
def projects():
    return render_template('projects.html', projects=PROJECTS)

@app.route('/project/<project_id>')
def project_detail(project_id):
    project = next((p for p in PROJECTS if p['id'] == project_id), None)
    if not project:
        return "项目不存在", 404
    return render_template('project_detail.html', project=project)

@app.route('/behind-scenes')
def behind_scenes():
    return render_template('behind_scenes.html', cards=BEHIND_SCENES)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
