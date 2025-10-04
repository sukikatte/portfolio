from flask import Flask, render_template

app = Flask(__name__)

# 项目数据
PROJECTS_DATA = {
    'wildlife': {
        'title': '中国野生动物保护网站',
        'subtitle': '游戏化教育平台，促进动物保护意识',
        'icon': '🐼',
        'technologies': 'Python • JavaScript • Flask • Firebase • ECharts • Gunicorn',
        'badges': ['全栈项目', '教育应用', '社会价值'],
        'description': '这是一个专为中国野生动物保护教育设计的综合性网站。通过游戏化学习、互动体验和社区功能，提升公众对野生动物保护的认知和参与度。项目采用现代化的全栈开发技术，实现了从数据采集到用户交互的完整功能链条。',
        'duration': '2025年2月 - 2025年6月',
        'advisor': 'Prof. Catherine Mooney',
        'type': '全栈Web应用',
        'role': '独立开发',
        'github_link': 'https://github.com/sukikatte/dwen_dwens_neighbour',
        'features': [
            {
                'icon': '📚',
                'title': '野生动物百科全书',
                'description': '集成Web爬虫技术，自动从维基百科抓取和整理野生动物信息，提供丰富的知识内容。'
            },
            {
                'icon': '🎮',
                'title': '互动教育游戏',
                'description': '设计多种迷你游戏，通过趣味互动帮助用户学习动物知识，提升学习效果。'
            },
            {
                'icon': '🐼',
                'title': '虚拟熊猫养成',
                'description': '模拟真实熊猫生活习性，让用户通过虚拟喂养了解熊猫保护的重要性。'
            },
            {
                'icon': '🗺️',
                'title': '交互式地图',
                'description': '使用ECharts制作中国野生动物分布地图，直观展示不同地区的动物资源。'
            },
            {
                'icon': '👥',
                'title': '用户社区',
                'description': '构建用户交流平台，支持分享保护心得、组织活动，促进用户参与。'
            },
            {
                'icon': '💝',
                'title': '公益捐赠',
                'description': '集成捐赠功能，支持用户直接为野生动物保护事业贡献力量。'
            }
        ],
        'tech_stack': [
            {
                'name': '后端开发',
                'technologies': ['Python', 'Flask', 'Gunicorn', 'CORS']
            },
            {
                'name': '前端开发',
                'technologies': ['JavaScript', 'HTML5', 'CSS3', 'ECharts']
            },
            {
                'name': '数据库',
                'technologies': ['Firebase Realtime Database', 'SQL']
            },
            {
                'name': '数据采集',
                'technologies': ['Requests', 'BeautifulSoup', 'Web Crawler']
            },
            {
                'name': '部署运维',
                'technologies': ['Gunicorn', '云服务器']
            }
        ],
        'highlights': [
            {
                'title': '创新的游戏化教育模式',
                'description': '将严肃的环保教育转化为有趣的游戏体验，大幅提升用户参与度和学习效果。'
            },
            {
                'title': '完整的数据采集系统',
                'description': '自动化从多个数据源采集野生动物信息，确保内容的准确性和时效性。'
            },
            {
                'title': '实时交互体验',
                'description': '利用Firebase实时数据库，实现用户间的即时互动和动态内容更新。'
            },
            {
                'title': '响应式设计',
                'description': '适配多种设备屏幕，确保在不同平台上都能提供优质的用户体验。'
            }
        ]
    }
}

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/project/<project_id>')
def project_detail(project_id):
    if project_id not in PROJECTS_DATA:
        return "项目不存在", 404
    
    project = PROJECTS_DATA[project_id]
    return render_template('project_detail.html', project=project)

@app.route('/artwork')
def artwork():
    return render_template('artwork.html')

@app.route('/music')
def music():
    return render_template('music.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
