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
        'achievement': '大学创新创业大赛优秀奖 + 三等奖',
        'tech_stack': ['Python', 'Flask', 'Firebase', 'JavaScript', 'ECharts'],
        'github': 'https://github.com/sukikatte/dwen_dwens_neighbour',
        
        # 详情页6部分内容
        'problem': {
            'title': 'Problem / Context',
            'content': '中国拥有丰富的野生动物资源，但公众对动物保护的认知和参与度不足。传统的教育方式枯燥，难以吸引年轻群体。我们需要一个有趣、互动的平台，让用户在游戏化体验中学习野生动物知识，并激发保护意识。',
            'highlights': [
                '目标用户：学生、动物爱好者、潜在志愿者',
                '核心需求：趣味性学习 + 社区互动 + 便捷参与公益',
                '用户痛点：传统教育枯燥、缺乏参与感、不知如何行动'
            ]
        },
        'ideation': {
            'title': 'Ideation & Design Thinking',
            'content': '从用户旅程出发，我们设计了"学习-体验-参与"三阶段流程。通过 Persona 分析确定主要用户群体，采用游戏化设计提升参与度，用虚拟养成增强情感连接，最终引导用户参与真实的公益行动。',
            'highlights': [
                'Persona: 大学生、中小学教师、野生动物爱好者',
                '用户旅程图：浏览百科 → 玩游戏 → 养虚拟熊猫 → 参与捐赠',
                '设计原则：轻量化、游戏化、社交化、公益化'
            ]
        },
        'solution': {
            'title': 'Solution & Technical Implementation',
            'content': 'Flask 后端 + Firebase 实时数据库 + ECharts 地图可视化。采用模块化架构，每个功能独立开发便于团队协作。Web 爬虫自动抓取动物信息，Firebase 实现多人实时互动，云端部署确保高可用性。',
            'highlights': [
                '后端：Flask + Gunicorn + CORS',
                '数据库：Firebase Realtime Database + SQL',
                '前端：JavaScript + ECharts 交互式地图',
                '数据采集：BeautifulSoup 爬虫自动化'
            ]
        },
        'ux': {
            'title': 'User Experience & Interface Design',
            'content': '卡片式百科设计方便快速浏览，交互式地图直观展示动物分布，虚拟熊猫养成增加趣味性和粘性。捐赠页面采用海报风格，视觉冲击力强。整体采用温暖色调，符合动物保护主题。',
            'highlights': [
                '卡片式UI：快速浏览，信息层次清晰',
                '交互地图：点击省份查看当地动物',
                '虚拟养成：喂食、互动，模拟真实习性',
                '响应式设计：适配PC和移动端'
            ]
        },
        'outcome': {
            'title': 'Outcome & Impact',
            'content': '项目获得大学创新创业大赛优秀奖和三等奖，用户反馈积极。通过Firebase统计，日活跃用户稳定增长，虚拟熊猫养成功能最受欢迎，捐赠页面转化率达到15%。',
            'highlights': [
                '🏆 大学创新创业大赛优秀奖 + 三等奖',
                '👥 用户反馈：趣味性强，学到很多知识',
                '📈 虚拟养成功能最受欢迎（留存率+40%）',
                '💝 捐赠转化率达到15%'
            ]
        },
        'reflection': {
            'title': 'Reflection',
            'content': '这是我第一次真正从用户角度设计产品。学会了如何平衡功能性和趣味性，如何通过游戏化设计提升用户参与度。团队协作中学会了模块化开发和Git协作流程。',
            'learnings': [
                '游戏化设计可以大幅提升教育类产品的吸引力',
                '虚拟养成是建立用户情感连接的有效方式',
                'Firebase实时数据库适合快速开发和团队协作',
                '下一步：添加社区功能，让用户分享保护心得'
            ]
        }
    }
,
    {
        'id': 'chinese-medicine',
        'title': 'Chinese Medicine Recommendation',
        'subtitle': 'Technology in Everyday Life',
        'tags': ['AI + Recommendation', 'Database'],
        'icon': '🌿',
        'color': '#A8E6CF',
        'description': '以数据为驱动的个性化中药推荐系统',
        'tech_stack': ['Python', 'Machine Learning', 'Database', 'Recommendation System'],
        'github': '#',
        
        'problem': {
            'title': 'Problem / Context',
            'content': '中药文化博大精深，但普通人难以选择合适的药材。传统方式需要咨询医师，不够便捷。能否用技术让中药知识更易获取，帮助用户找到适合自己的保健方案？',
            'highlights': [
                '目标用户：关注健康的普通人、中医爱好者',
                '核心需求：个性化推荐、科学依据、简单易用',
                '痛点：专业知识门槛高、选择困难、缺乏指导'
            ]
        },
        'ideation': {
            'title': 'Ideation & Design Thinking',
            'content': '设计了"症状输入 → 智能分析 → 推荐方案"的简单流程。构建中药知识图谱，建立症状与药材的关联关系。推荐算法考虑药性、禁忌、搭配等多维度因素。',
            'highlights': [
                '知识图谱：药材属性、功效、禁忌关系',
                '推荐逻辑：症状匹配 + 药性平衡 + 禁忌过滤',
                '用户流程：3步完成，降低使用门槛'
            ]
        },
        'solution': {
            'title': 'Solution & Technical Implementation',
            'content': 'Python + 机器学习构建推荐引擎，数据库存储中药知识和用户数据。数据清洗处理中医文献，建立结构化数据集。推荐算法综合考虑相似度、热度、安全性等因素。',
            'highlights': [
                '数据处理：清洗中医文献，标准化药材信息',
                '推荐算法：协同过滤 + 基于内容的混合推荐',
                '数据库设计：药材表、症状表、关联表',
                '安全机制：禁忌检查、用量提示'
            ]
        },
        'ux': {
            'title': 'User Experience & Interface Design',
            'content': '简洁的输入界面，用户选择症状或描述不适。推荐结果卡片式展示，包含药材图片、功效说明、用法用量。添加"为什么推荐"的解释，增加可信度。',
            'highlights': [
                '输入设计：症状标签选择 + 自由描述',
                '结果展示：卡片式，信息层次清晰',
                '可解释性："为什么推荐"增加信任感',
                '安全提示：明显标注禁忌和注意事项'
            ]
        },
        'outcome': {
            'title': 'Outcome & Impact',
            'content': '系统推荐准确率较高，用户反馈实用。学会了如何将AI技术应用到传统领域，探索了技术与生活服务的结合点。',
            'highlights': [
                '📊 推荐准确率：基于用户反馈评估',
                '💡 技术落地：AI应用于传统中医',
                '🎯 服务设计：技术服务日常生活',
                '📱 实用性：用户认为确实有帮助'
            ]
        },
        'reflection': {
            'title': 'Reflection',
            'content': '这个项目让我理解了"技术为人服务"的真正含义。不是炫技，而是解决实际问题。学会了如何处理和利用领域知识，如何让AI推荐既准确又可解释。',
            'learnings': [
                'AI不仅是算法，更是服务设计',
                '可解释性对用户信任至关重要',
                '传统领域也需要技术创新',
                '下一步：引入专业医师审核，提高可靠性'
            ]
        }
    }
,
    {
        'id': 'guess-songs',
        'title': 'Guess Songs',
        'subtitle': 'Real-time Multiplayer Music Game',
        'tags': ['Solo Project', 'Cloud + Realtime DB', 'Game + Interaction'],
        'icon': '🎵',
        'color': '#FF6B6B',
        'description': '从 0 构建的轻量级音乐问答游戏，强调实时交互和用户体验',
        'tech_stack': ['Firebase', 'Cloud Storage', 'Real-time Database', 'JavaScript'],
        'github': '#',
        
        'problem': {
            'title': 'Problem / Context',
            'content': '市面上的音乐游戏大多需要下载客户端，操作复杂。我想创建一个轻量级的网页版音乐问答游戏，让用户无需安装即可多人对战，随时随地享受猜歌乐趣。',
            'highlights': [
                '目标用户：音乐爱好者、休闲游戏玩家',
                '核心需求：快速开始、多人互动、实时反馈',
                '技术挑战：音频存储、实时同步、低延迟'
            ]
        },
        'ideation': {
            'title': 'Ideation & Design Thinking',
            'content': '设计了简单的游戏流程：创建/加入房间 → 听歌片段 → 快速抢答 → 实时排行。关注用户的社交需求，添加排行榜和对战机制增加竞争性和趣味性。',
            'highlights': [
                '游戏机制：限时抢答、积分系统、排行榜',
                '社交设计：多人房间、实时对战、成就分享',
                '音频策略：15秒片段、渐进式加载、云存储'
            ]
        },
        'solution': {
            'title': 'Solution & Technical Implementation',
            'content': '使用Firebase Realtime Database实现多设备实时同步，自建音频云存储系统绕过API限制。前端采用原生JavaScript，确保快速响应。所有状态变化立即同步到所有客户端。',
            'highlights': [
                'Firebase Realtime Database：毫秒级同步',
                '云存储OSS：自建音频库，无API依赖',
                'WebSocket：实时通信，低延迟',
                '缓存策略：预加载下一首，流畅体验'
            ]
        },
        'ux': {
            'title': 'User Experience & Interface Design',
            'content': '简洁的游戏界面，大号按钮便于快速操作。实时显示所有玩家状态，增强对战氛围。音频波形可视化，视觉反馈丰富。排行榜设计带动画，成就感强烈。',
            'highlights': [
                '极简UI：3秒理解规则，即刻开始',
                '实时反馈：答题瞬间显示对错',
                '音频可视化：波形动画增强沉浸感',
                '排行榜动画：数字跳动，成就满满'
            ]
        },
        'outcome': {
            'title': 'Outcome & Impact',
            'content': '成功实现多人实时对战，延迟控制在100ms以内。音频云存储方案稳定可靠，支持100+歌曲库。用户平均游戏时长15分钟，复玩率高。',
            'highlights': [
                '⚡ 实时同步延迟 < 100ms',
                '🎵 音频库包含100+歌曲',
                '👥 支持同时10人对战',
                '🔄 用户平均游戏时长15分钟'
            ]
        },
        'reflection': {
            'title': 'Reflection',
            'content': '从0到1独立开发一个实时游戏，学会了云服务集成、实时通信、性能优化等技能。最大的收获是理解了"实时性"对用户体验的重要性。',
            'learnings': [
                '实时性是多人游戏的核心体验',
                'Firebase非常适合快速构建实时应用',
                '音频处理需要平衡质量和加载速度',
                '下一步：添加更多游戏模式、自定义歌单'
            ]
        }
    }
,
    {
        'id': 'mahjong',
        'title': 'Digital Mahjong',
        'subtitle': 'Algorithmic Thinking Meets User Experience',
        'tags': ['Algorithm + UI', 'Early Work'],
        'icon': '🀄',
        'color': '#95E1D3',
        'description': '从功能实现入手的桌面麻将游戏算法与交互探索',
        'tech_stack': ['Python', 'Algorithm Design', 'Game Logic'],
        'github': '#',
        
        'problem': {
            'title': 'Problem / Context',
            'content': '这是我的第一个完整项目，目标是用Python实现一个功能完整的麻将游戏。重点在于算法设计：番型计算、胡牌判断、AI对手等核心逻辑。',
            'highlights': [
                '技术挑战：复杂的规则系统、状态管理',
                '学习目标：算法设计、数据结构、游戏逻辑',
                '初期思维：功能优先，追求完整实现'
            ]
        },
        'ideation': {
            'title': 'Ideation & Design Thinking',
            'content': '项目完成后，教师评价："功能完整，但缺乏用户思维"。这句话成为我的转折点。开始思考：用户真正需要什么？如何让游戏更易用？界面如何更直观？',
            'highlights': [
                '反思：功能≠用户体验',
                '转变：从"能用"到"好用"的思考',
                '启发：技术服务于人，而非炫技'
            ]
        },
        'solution': {
            'title': 'Solution & Technical Implementation',
            'content': 'Python面向对象设计，将麻将规则抽象为类和方法。状态机管理游戏流程，算法实现番型计算和胡牌判断。虽然技术实现扎实，但UI设计确实不够友好。',
            'highlights': [
                '核心算法：番型计算、胡牌判断逻辑',
                '状态机：游戏流程控制',
                '数据结构：麻将牌组的高效表示',
                'AI对手：基础策略算法'
            ]
        },
        'ux': {
            'title': 'User Experience & Interface Design',
            'content': '早期版本的UI非常简陋，只关注功能实现。按钮布局混乱，操作流程不清晰，缺少视觉反馈。这些问题让我意识到UI/UX的重要性。',
            'highlights': [
                '问题：UI简陋，缺乏视觉层次',
                '问题：操作流程不直观',
                '问题：缺少反馈动画',
                '教训：技术和体验同等重要'
            ]
        },
        'outcome': {
            'title': 'Outcome & Impact',
            'content': '虽然项目在用户体验上有不足，但算法实现获得认可。更重要的是，这次经历让我明白了用户导向设计的重要性，促使我在后续项目中更关注UX。',
            'highlights': [
                '✅ 功能完整，算法扎实',
                '⚠️ UI/UX需改进',
                '💡 重要转折点：开始关注用户体验',
                '📚 学到的比做出的更重要'
            ]
        },
        'reflection': {
            'title': 'Reflection',
            'content': '这是我的起点项目，虽不完美但意义重大。教师的批评是最好的礼物，让我从"程序员"转变为"设计者"。后续所有项目都受这次经历影响，开始真正关注用户需求。',
            'learnings': [
                '功能实现只是第一步，用户体验才是关键',
                '批评是成长的催化剂',
                '技术与设计缺一不可',
                '这个项目定义了我之后的方向'
            ]
        }
    }
,
    {
        'id': 'parrot-ordering',
        'title': 'Parrot Ordering System',
        'subtitle': 'Designing Seamless Workflows',
        'tags': ['Full-Stack', 'Web + Database + UX'],
        'icon': '🦜',
        'color': '#FFD93D',
        'description': '支持注册、点单、聊天、评价、主题切换等功能的综合性系统',
        'tech_stack': ['Full-Stack', 'AJAX', 'Firebase', 'UX Design'],
        'github': '#',
        
        'problem': {
            'title': 'Problem / Context',
            'content': '餐厅点餐系统需要协调多个角色（顾客、厨师、管理员），传统系统流程复杂、信息不透明。需要一个全流程的系统，让每个角色都能高效完成任务，同时保持体验流畅。',
            'highlights': [
                '三种角色：顾客、厨师、管理员',
                '核心需求：便捷点餐、实时通知、订单管理',
                '挑战：多角色权限、实时同步、流程优化'
            ]
        },
        'ideation': {
            'title': 'Ideation & Design Thinking',
            'content': '绘制三个角色的用户旅程图，找到各自痛点。顾客要快速点餐，厨师要清晰看到订单，管理员要统计数据。设计了角色切换界面和权限系统，让每个角色都有专属视图。',
            'highlights': [
                '顾客视角：浏览菜单 → 快速下单 → 追踪状态',
                '厨师视角：接收订单 → 标记进度 → 完成通知',
                '管理员视角：统计报表 → 菜品管理 → 用户管理'
            ]
        },
        'solution': {
            'title': 'Solution & Technical Implementation',
            'content': 'AJAX实现无刷新交互，Firebase处理实时数据同步。后端API设计RESTful风格，前端采用模块化开发。实现了主题切换、聊天、评价等增值功能。',
            'highlights': [
                'AJAX：无刷新体验，快速响应',
                'Firebase：实时订单同步',
                'RESTful API：清晰的接口设计',
                '主题系统：用户可自定义界面风格'
            ]
        },
        'ux': {
            'title': 'User Experience & Interface Design',
            'content': '针对不同角色设计专属界面。顾客端简洁友好，厨师端信息密集但清晰，管理端功能强大。添加实时通知、进度条、状态标签等反馈元素。主题切换让用户个性化体验。',
            'highlights': [
                '角色化设计：每个角色专属界面',
                '实时通知：订单状态变化即时推送',
                '进度可视化：订单状态清晰展示',
                '个性化：多主题、自定义头像'
            ]
        },
        'outcome': {
            'title': 'Outcome & Impact',
            'content': '完整实现了餐厅点餐的全流程管理，三个角色都能高效工作。实时同步保证信息一致，用户反馈流程顺畅。这是我第一个完整的全栈项目。',
            'highlights': [
                '✅ 全流程覆盖：注册到评价完整闭环',
                '⚡ 实时同步：多端数据一致',
                '👥 多角色：三种角色无缝协作',
                '🎨 个性化：主题切换受欢迎'
            ]
        },
        'reflection': {
            'title': 'Reflection',
            'content': '第一次完整设计多角色系统，学会了从不同视角思考产品。全栈开发让我理解了前后端如何配合。最重要的是学会了"workflow design"——如何让复杂流程变得简单高效。',
            'learnings': [
                '多角色系统需要分别设计用户体验',
                '工作流设计是系统成功的关键',
                '实时同步提升协作效率',
                '下一步：添加数据分析，帮助商家决策'
            ]
        }
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

@app.route('/')
def home():
    # 全屏滚动单页版本
    return render_template('index_fullpage.html', timeline=TIMELINE, projects=PROJECTS)

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

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
