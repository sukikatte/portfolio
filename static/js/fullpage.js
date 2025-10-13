// ============================================
// Full-Page Scrolling Portfolio
// ============================================

class FullPageScroll {
    constructor() {
        this.currentSection = 0;
        this.sections = document.querySelectorAll('.fullpage-section');
        this.totalSections = this.sections.length;
        this.container = document.querySelector('.fullpage-container');
        this.isScrolling = false;
        this.scrollDelay = 1000;
        
        // 项目幻灯片
        this.projectsContainer = document.querySelector('.projects-slider-container');
        this.projectSlides = document.querySelectorAll('.project-slide');
        this.totalProjects = this.projectSlides.length;
        this.currentProject = 1; // 从1开始（0是克隆的最后一个）
        this.isTransitioning = false;
        
        // 自动播放
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
        this.lastInteraction = Date.now();
        
        this.init();
    }
    
    init() {
        this.setupInfiniteScroll();
        this.addEventListeners();
        this.updateActiveDot();
        this.updateActiveNav();
        this.initProjectSlider();
        console.log(`Full-page scrolling initialized ✨ - ${this.totalSections} sections`);
    }
    
    setupInfiniteScroll() {
        // 克隆第一个和最后一个项目以实现无限循环
        if (this.projectSlides.length > 0) {
            const firstSlide = this.projectSlides[0].cloneNode(true);
            const lastSlide = this.projectSlides[this.projectSlides.length - 1].cloneNode(true);
            
            // 在末尾添加第一个的克隆
            this.projectsContainer.appendChild(firstSlide);
            // 在开头添加最后一个的克隆
            this.projectsContainer.insertBefore(lastSlide, this.projectSlides[0]);
            
            // 重新获取所有项目（包括克隆的）
            this.allSlides = this.projectsContainer.querySelectorAll('.project-slide');
            
            // 设置初始位置（显示第一个真实项目）
            this.projectsContainer.style.transform = `translateX(-${this.currentProject * 100}%)`;
            this.projectsContainer.style.transition = 'none';
        }
    }
    
    addEventListeners() {
        // 鼠标滚轮
        window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        
        // 键盘方向键
        window.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // 触摸滑动
        let touchStartY = 0;
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        window.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.goToSection(this.currentSection + 1);
                } else {
                    this.goToSection(this.currentSection - 1);
                }
            }
        });
        
        // 导航点点击
        document.querySelectorAll('.nav-dot').forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSection(index);
            });
        });
        
        // 导航链接点击
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionIndex = parseInt(link.dataset.section);
                this.goToSection(sectionIndex);
            });
        });
    }
    
    handleWheel(e) {
        e.preventDefault();
        
        if (this.isScrolling) return;
        
        const threshold = 50;
        if (Math.abs(e.deltaY) < threshold) return;
        
        if (e.deltaY > 0) {
            this.goToSection(this.currentSection + 1);
        } else {
            this.goToSection(this.currentSection - 1);
        }
    }
    
    handleKeydown(e) {
        if (this.isScrolling) return;
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            this.goToSection(this.currentSection + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            this.goToSection(this.currentSection - 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            this.goToSection(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            this.goToSection(this.totalSections - 1);
        }
    }
    
    goToSection(index) {
        if (index < 0 || index >= this.totalSections || index === this.currentSection) {
            return;
        }
        
        this.isScrolling = true;
        this.currentSection = index;
        
        // 移动容器
        const offset = -index * 100;
        this.container.style.transform = `translateY(${offset}vh)`;
        
        // 更新活动状态
        this.sections.forEach((section, i) => {
            section.classList.toggle('active', i === index);
        });
        
        this.updateActiveDot();
        this.updateActiveNav();
        
        // 控制键盘提示显示/隐藏（只在首页显示）
        const keyboardHint = document.querySelector('.keyboard-hint');
        if (keyboardHint) {
            if (index === 0) {
                keyboardHint.style.opacity = '1';
                keyboardHint.style.visibility = 'visible';
            } else {
                keyboardHint.style.opacity = '0';
                setTimeout(() => {
                    if (this.currentSection !== 0) {
                        keyboardHint.style.visibility = 'hidden';
                    }
                }, 500);
            }
        }
        
        // 控制滚动箭头方向（最后一页向上，其他页向下）
        const scrollArrow = document.querySelector('.scroll-arrow');
        const scrollText = document.querySelector('.scroll-text');
        if (scrollArrow && scrollText) {
            if (index === this.totalSections - 1) {
                scrollArrow.textContent = '↑';
                scrollText.textContent = 'Scroll up';
            } else {
                scrollArrow.textContent = '↓';
                scrollText.textContent = 'Scroll to explore';
            }
        }
        
        // 控制背景显示：首页显示Three.js星空，其他页面显示网格星空
        const bgCanvas = document.getElementById('bgCanvas');
        const starsCanvas = document.getElementById('starsCanvas');
        
        if (index === 0) {
            // 首页：隐藏网格背景，显示Three.js星空
            if (bgCanvas) bgCanvas.style.display = 'none';
            if (starsCanvas) starsCanvas.style.display = 'block';
        } else {
            // 其他页面：显示网格背景，隐藏Three.js星空
            if (bgCanvas) bgCanvas.style.display = 'block';
            if (starsCanvas) starsCanvas.style.display = 'none';
        }
        
        // 如果进入项目页面（index = 2），启动自动播放
        if (index === 2) {
            this.startAutoPlay();
        } else {
            this.stopAutoPlay();
        }
        
        // 延迟后允许下次滚动
        setTimeout(() => {
            this.isScrolling = false;
        }, this.scrollDelay);
    }
    
    updateActiveDot() {
        document.querySelectorAll('.nav-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSection);
        });
    }
    
    updateActiveNav() {
        document.querySelectorAll('.nav-link').forEach((link) => {
            const sectionIndex = parseInt(link.dataset.section);
            link.classList.toggle('active', sectionIndex === this.currentSection);
        });
    }
    
    // ============================================
    // 项目幻灯片功能
    // ============================================
    initProjectSlider() {
        const prevBtn = document.querySelector('.project-nav-btn.prev');
        const nextBtn = document.querySelector('.project-nav-btn.next');
        
        if (!prevBtn || !nextBtn) return;
        
        // 上一个按钮
        prevBtn.addEventListener('click', () => {
            this.userInteraction();
            this.goToProject(this.currentProject - 1);
        });
        
        // 下一个按钮
        nextBtn.addEventListener('click', () => {
            this.userInteraction();
            this.goToProject(this.currentProject + 1);
        });
        
        // 指示器点击
        document.querySelectorAll('.project-indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.userInteraction();
                // 转换为实际索引（+1因为第一个是克隆的）
                this.goToProject(index + 1);
            });
        });
        
        // 鼠标悬停在项目区域时暂停自动播放
        const projectsSection = document.querySelector('#projects');
        if (projectsSection) {
            projectsSection.addEventListener('mouseenter', () => {
                this.stopAutoPlay();
            });
            
            projectsSection.addEventListener('mouseleave', () => {
                if (this.currentSection === 2) {
                    this.startAutoPlay();
                }
            });
        }
    }
    
    goToProject(index) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // 启用过渡动画
        this.projectsContainer.style.transition = 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)';
        
        // 移动到目标位置
        this.currentProject = index;
        const offset = -this.currentProject * 100;
        this.projectsContainer.style.transform = `translateX(${offset}%)`;
        
        // 更新指示器（只针对真实项目）
        const realIndex = this.getRealIndex(index);
        document.querySelectorAll('.project-indicator').forEach((indicator, i) => {
            indicator.classList.toggle('active', i === realIndex);
        });
        
        // 动画结束后检查是否需要跳转
        setTimeout(() => {
            this.handleInfiniteLoop();
            this.isTransitioning = false;
        }, 600);
    }
    
    getRealIndex(index) {
        // 将实际索引转换为真实项目索引（0到totalProjects-1）
        if (index === 0) {
            return this.totalProjects - 1; // 克隆的最后一个
        } else if (index === this.totalProjects + 1) {
            return 0; // 克隆的第一个
        } else {
            return index - 1; // 真实项目
        }
    }
    
    handleInfiniteLoop() {
        // 如果在克隆的最后一个（第一个的克隆）
        if (this.currentProject === this.totalProjects + 1) {
            this.projectsContainer.style.transition = 'none';
            this.currentProject = 1; // 跳转到真实的第一个
            this.projectsContainer.style.transform = `translateX(-${this.currentProject * 100}%)`;
        }
        // 如果在克隆的第一个（最后一个的克隆）
        else if (this.currentProject === 0) {
            this.projectsContainer.style.transition = 'none';
            this.currentProject = this.totalProjects; // 跳转到真实的最后一个
            this.projectsContainer.style.transform = `translateX(-${this.currentProject * 100}%)`;
        }
    }
    
    userInteraction() {
        // 记录用户交互时间
        this.lastInteraction = Date.now();
        // 停止当前自动播放
        this.stopAutoPlay();
        // 3秒后如果没有新的交互，重新启动自动播放
        setTimeout(() => {
            if (Date.now() - this.lastInteraction >= 3000 && this.currentSection === 2) {
                this.startAutoPlay();
            }
        }, 3000);
    }
    
    startAutoPlay() {
        // 清除已有的定时器
        this.stopAutoPlay();
        
        // 创建新的自动播放定时器
        this.autoPlayInterval = setInterval(() => {
            // 只在项目页面时自动播放
            if (this.currentSection === 2) {
                this.goToProject(this.currentProject + 1);
            } else {
                this.stopAutoPlay();
            }
        }, this.autoPlayDelay);
        
        console.log('项目自动播放已启动 🎬');
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
            console.log('项目自动播放已停止 ⏸️');
        }
    }
}

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    new FullPageScroll();
    
    // 页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // 初始化背景显示状态（首页显示Three.js星空，隐藏网格背景）
    const bgCanvas = document.getElementById('bgCanvas');
    const starsCanvas = document.getElementById('starsCanvas');
    if (bgCanvas) bgCanvas.style.display = 'none'; // 首页默认隐藏网格背景
    if (starsCanvas) starsCanvas.style.display = 'block'; // 首页显示Three.js星空
    
    // 初始化动态背景（即使初始隐藏也要初始化，以便切换时能正常显示）
    initDynamicBackground();
    
    // 项目卡片3D效果
    initProjectCardEffects();
    
    // 初始化Journey时间轴交互
    initJourneyTimeline();
});

// ============================================
// 项目卡片3D悬停效果
// ============================================
function initProjectCardEffects() {
    const cards = document.querySelectorAll('.timeline-card, .flip-card, .project-overview-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// ============================================
// 视差效果
// ============================================
function initParallaxEffect() {
    const sections = document.querySelectorAll('.fullpage-section');
    
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        sections.forEach(section => {
            const moveX = (mouseX - 0.5) * 30;
            const moveY = (mouseY - 0.5) * 30;
            section.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
        });
    });
}

// ============================================
// 动态背景：网格线条 + 流动粒子
// ============================================
function initDynamicBackground() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 网格配置
    const gridSize = 50;
    let mouseX = 0;
    let mouseY = 0;
    
    // 追踪鼠标位置
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // 粒子系统
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2.5 + 1;
            this.opacity = Math.random() * 0.6 + 0.3;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // 鼠标交互
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                this.x -= (dx / distance) * force * 2;
                this.y -= (dy / distance) * force * 2;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(76, 201, 240, ${this.opacity})`;
            ctx.fill();
            
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(76, 201, 240, 0.5)';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // 绘制网格线
    function drawGrid() {
        ctx.strokeStyle = 'rgba(76, 201, 240, 0.08)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
    
    // 绘制连接线
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.4;
                    ctx.strokeStyle = `rgba(76, 201, 240, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // 绘制鼠标周围的渐变高亮网格
    function drawMouseHighlight() {
        if (!mouseX || !mouseY) return;
        
        const gridX = Math.floor(mouseX / gridSize) * gridSize;
        const gridY = Math.floor(mouseY / gridSize) * gridSize;
        const radius = gridSize * 2;
        
        // 径向渐变背景
        const bgGradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, radius);
        bgGradient.addColorStop(0, 'rgba(76, 201, 240, 0.12)');
        bgGradient.addColorStop(0.5, 'rgba(76, 201, 240, 0.06)');
        bgGradient.addColorStop(1, 'rgba(76, 201, 240, 0)');
        
        ctx.fillStyle = bgGradient;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制渐变网格线（3x3区域）
        for (let x = gridX - gridSize; x <= gridX + gridSize; x += gridSize) {
            const distanceX = Math.abs(x - mouseX);
            const opacity = Math.max(0, 1 - distanceX / radius) * 0.4;
            
            const gradient = ctx.createLinearGradient(x, gridY - gridSize, x, gridY + gridSize * 2);
            const centerY = mouseY;
            const distTop = Math.abs((gridY - gridSize) - centerY);
            const distBottom = Math.abs((gridY + gridSize * 2) - centerY);
            
            gradient.addColorStop(0, `rgba(76, 201, 240, ${Math.max(0, 1 - distTop / radius) * 0.4})`);
            gradient.addColorStop(0.5, `rgba(76, 201, 240, ${opacity})`);
            gradient.addColorStop(1, `rgba(76, 201, 240, ${Math.max(0, 1 - distBottom / radius) * 0.4})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x, gridY - gridSize);
            ctx.lineTo(x, gridY + gridSize * 2);
            ctx.stroke();
        }
        
        for (let y = gridY - gridSize; y <= gridY + gridSize; y += gridSize) {
            const distanceY = Math.abs(y - mouseY);
            const opacity = Math.max(0, 1 - distanceY / radius) * 0.4;
            
            const gradient = ctx.createLinearGradient(gridX - gridSize, y, gridX + gridSize * 2, y);
            const centerX = mouseX;
            const distLeft = Math.abs((gridX - gridSize) - centerX);
            const distRight = Math.abs((gridX + gridSize * 2) - centerX);
            
            gradient.addColorStop(0, `rgba(76, 201, 240, ${Math.max(0, 1 - distLeft / radius) * 0.4})`);
            gradient.addColorStop(0.5, `rgba(76, 201, 240, ${opacity})`);
            gradient.addColorStop(1, `rgba(76, 201, 240, ${Math.max(0, 1 - distRight / radius) * 0.4})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(gridX - gridSize, y);
            ctx.lineTo(gridX + gridSize * 2, y);
            ctx.stroke();
        }
    }
    
    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawGrid();
        drawMouseHighlight();
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        
        requestAnimationFrame(animate);
    }
    
    animate();
    console.log('动态背景已启动 ✨ - 粒子数:', particleCount);
}

// ============================================
// Journey 项目时间轴交互
// ============================================
function initJourneyTimeline() {
    const container = document.querySelector('.journey-slider-container');
    const originalSlides = document.querySelectorAll('.journey-slide');
    const prevBtn = document.querySelector('.journey-nav-btn.prev');
    const nextBtn = document.querySelector('.journey-nav-btn.next');
    const indicators = document.querySelectorAll('.journey-indicator');
    
    if (!container || originalSlides.length === 0) {
        return;
    }
    
    const totalSlides = originalSlides.length;
    
    // 克隆前3个和后3个幻灯片以实现无限循环
    const cloneCount = 3;
    
    // 克隆后面的3个到前面（倒序遍历保持正序插入）
    for (let i = totalSlides - 1; i >= totalSlides - cloneCount; i--) {
        const clone = originalSlides[i].cloneNode(true);
        clone.classList.add('clone');
        container.insertBefore(clone, container.firstChild);
    }
    
    // 克隆前面的3个到后面
    for (let i = 0; i < cloneCount; i++) {
        const clone = originalSlides[i].cloneNode(true);
        clone.classList.add('clone');
        container.appendChild(clone);
    }
    
    // 重新获取所有幻灯片（包括克隆的）
    const allSlides = container.querySelectorAll('.journey-slide');
    let currentIndex = cloneCount; // 从第一个真实项目开始（跳过克隆的）
    let isTransitioning = false;
    
    // 计算每个卡片的宽度（包括间距）
    function getSlideWidth() {
        const slide = allSlides[0];
        const slideWidth = slide.offsetWidth;
        // 从CSS中读取gap值
        const computedStyle = getComputedStyle(container);
        const gap = parseFloat(computedStyle.gap) || 48;
        return slideWidth + gap;
    }
    
    // 更新滑块位置
    function updateSlider(animate = true) {
        const slideWidth = getSlideWidth();
        const wrapper = document.querySelector('.journey-slider-wrapper');
        const wrapperWidth = wrapper.offsetWidth;
        
        // 获取实际gap值
        const computedStyle = getComputedStyle(container);
        const gap = parseFloat(computedStyle.gap) || 48;
        
        // 计算居中偏移量
        const centerOffset = (wrapperWidth - slideWidth + gap) / 2;
        const offset = -(currentIndex * slideWidth) + centerOffset;
        
        if (!animate) {
            container.style.transition = 'none';
        } else {
            container.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        
        container.style.transform = `translateX(${offset}px)`;
        
        // 更新指示器（映射到真实索引）
        const realIndex = (currentIndex - cloneCount + totalSlides) % totalSlides;
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === realIndex);
        });
        
        // 更新中心卡片的高亮状态（添加center类）
        allSlides.forEach((slide, index) => {
            const card = slide.querySelector('.journey-card');
            if (card) {
                if (index === currentIndex) {
                    card.classList.add('center');
                } else {
                    card.classList.remove('center');
                }
            }
        });
    }
    
    // 处理无限循环的跳转
    function handleInfiniteLoop() {
        if (currentIndex <= cloneCount - 1) {
            // 到达克隆的前端，跳转到真实的后端
            currentIndex = totalSlides + cloneCount - 1;
            updateSlider(false);
        } else if (currentIndex >= totalSlides + cloneCount) {
            // 到达克隆的后端，跳转到真实的前端
            currentIndex = cloneCount;
            updateSlider(false);
        }
    }
    
    // 添加/移除卡牌变形效果
    function addSwipeEffect(direction) {
        const allCards = document.querySelectorAll('.journey-card');
        console.log('🎴 添加圆弧效果:', direction, '- 找到', allCards.length, '个卡牌');
        allCards.forEach(card => {
            card.classList.remove('swipe-left', 'swipe-right');
            if (direction === 'left') {
                card.classList.add('swipe-left');
                console.log('  → 添加 swipe-left 类');
            } else if (direction === 'right') {
                card.classList.add('swipe-right');
                console.log('  → 添加 swipe-right 类');
            }
        });
    }
    
    function removeSwipeEffect() {
        const allCards = document.querySelectorAll('.journey-card');
        console.log('🔄 移除圆弧效果 - 共', allCards.length, '个卡牌');
        allCards.forEach(card => {
            card.classList.remove('swipe-left', 'swipe-right');
        });
    }
    
    // 前一个（向左切换）
    function goToPrev() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        // 向左切换：两侧应向左同向弯曲
        addSwipeEffect('left');
        
        updateSlider(true);
        
        setTimeout(() => {
            handleInfiniteLoop();
            removeSwipeEffect();
            isTransitioning = false;
        }, 600);
    }
    
    // 后一个（向右切换）
    function goToNext() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        // 向右切换：两侧应向右同向弯曲
        addSwipeEffect('right');
        
        updateSlider(true);
        
        setTimeout(() => {
            handleInfiniteLoop();
            removeSwipeEffect();
            isTransitioning = false;
        }, 600);
    }
    
    // 跳转到指定索引
    function goToSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex = index + cloneCount;
        updateSlider(true);
        
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }
    
    // 初始化位置
    updateSlider(false);
    
    // 添加事件监听
    if (prevBtn) prevBtn.addEventListener('click', goToPrev);
    if (nextBtn) nextBtn.addEventListener('click', goToNext);
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // 键盘控制
    document.addEventListener('keydown', (e) => {
        const journeySection = document.getElementById('journey');
        if (journeySection && journeySection.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToPrev();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToNext();
            }
        }
    });
    
    // 窗口大小改变时重新计算位置
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateSlider(false);
        }, 100);
    });
    
    console.log('Journey 无限循环滑动已初始化 ✨ - 共', totalSlides, '个项目');
}

