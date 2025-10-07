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
        this.scrollDelay = 1000; // 滚动间隔时间
        
        // 项目幻灯片
        this.projectsContainer = document.querySelector('.projects-slider-container');
        this.projectSlides = document.querySelectorAll('.project-slide');
        this.totalProjects = this.projectSlides.length;
        this.currentProject = 1; // 从1开始，因为0是克隆的最后一个
        this.isTransitioning = false;
        
        // 自动播放
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5秒
        this.lastInteraction = Date.now();
        
        this.init();
    }
    
    init() {
        this.setupInfiniteScroll();
        this.addEventListeners();
        this.updateActiveDot();
        this.updateActiveNav();
        this.initProjectSlider();
        console.log('Full-page scrolling initialized ✨');
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
        
        // 如果正在滚动中，直接返回，防止连续触发
        if (this.isScrolling) return;
        
        // 只响应明显的滚动动作
        const threshold = 50; // 滚动阈值
        if (Math.abs(e.deltaY) < threshold) return;
        
        if (e.deltaY > 0) {
            // 向下滚动
            this.goToSection(this.currentSection + 1);
        } else {
            // 向上滚动
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
                // 延迟设置 visibility 以保证淡出动画完成
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
                // 最后一页：显示向上箭头
                scrollArrow.textContent = '↑';
                scrollText.textContent = 'Scroll up';
            } else {
                // 其他页：显示向下箭头
                scrollArrow.textContent = '↓';
                scrollText.textContent = 'Scroll to explore';
            }
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
        // 上一个按钮
        document.querySelector('.project-nav-btn.prev').addEventListener('click', () => {
            this.userInteraction();
            this.prevProject();
        });
        
        // 下一个按钮
        document.querySelector('.project-nav-btn.next').addEventListener('click', () => {
            this.userInteraction();
            this.nextProject(false);
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
                // 离开项目区域且当前在项目页面时，重新启动自动播放
                if (this.currentSection === 2) {
                    this.startAutoPlay();
                }
            });
        }
    }
    
    goToProject(index, isAuto = false) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // 启用过渡动画
        this.projectsContainer.style.transition = 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)';
        
        // 移动到目标位置（包括克隆的项目）
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
        
        // 如果不是自动播放，则重置自动播放计时器
        if (!isAuto) {
            this.userInteraction();
        }
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
    
    nextProject(isAuto = false) {
        this.goToProject(this.currentProject + 1, isAuto);
    }
    
    prevProject() {
        this.goToProject(this.currentProject - 1, false);
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
                this.nextProject(true);
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
    
    // 添加加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // 项目卡片3D效果（项目页面）
    initProjectCardEffects();
    
    // 视差效果
    initParallaxEffect();
    
    // 初始化动态背景
    initDynamicBackground();
});

// ============================================
// 项目卡片3D悬停效果
// ============================================
function initProjectCardEffects() {
    const cards = document.querySelectorAll('.timeline-card, .flip-card');
    
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
// 视差效果（背景元素）
// ============================================
function initParallaxEffect() {
    const sections = document.querySelectorAll('.fullpage-section');
    
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        sections.forEach(section => {
            const bg = section.querySelector('::before');
            if (bg) {
                const moveX = (mouseX - 0.5) * 30;
                const moveY = (mouseY - 0.5) * 30;
                section.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
            }
        });
    });
}

// ============================================
// 粒子背景效果（可选）
// ============================================
function initParticlesBackground() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
    `;
    
    document.body.prepend(canvas);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 80;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.radius = Math.random() * 1.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.fillStyle = `rgba(0, 217, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // 连接邻近粒子
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.strokeStyle = `rgba(0, 217, 255, ${0.15 * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
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
    const particleCount = 50; // 增加粒子数量
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2.5 + 1; // 增大粒子
            this.opacity = Math.random() * 0.6 + 0.3; // 增加不透明度
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // 边界检测
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
            ctx.fillStyle = `rgba(0, 217, 255, ${this.opacity})`;
            ctx.fill();
            
            // 发光效果
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0, 217, 255, 0.5)';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    // 初始化粒子
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // 绘制网格线
    function drawGrid() {
        ctx.strokeStyle = 'rgba(0, 217, 255, 0.08)'; // 增加网格可见度
        ctx.lineWidth = 1;
        
        // 垂直线
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // 水平线
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
    
    // 绘制连接线
    function drawConnections() {
        ctx.strokeStyle = 'rgba(0, 217, 255, 0.2)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.4; // 增加连接线可见度
                    ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
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
        const radius = gridSize * 2; // 高亮半径
        
        // 绘制径向渐变背景（中间亮，边缘淡）
        const bgGradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, radius);
        bgGradient.addColorStop(0, 'rgba(0, 217, 255, 0.12)');   // 中心最亮
        bgGradient.addColorStop(0.5, 'rgba(0, 217, 255, 0.06)'); // 中间
        bgGradient.addColorStop(1, 'rgba(0, 217, 255, 0)');      // 边缘完全透明
        
        ctx.fillStyle = bgGradient;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制渐变网格线（3x3区域，中间最亮）
        for (let x = gridX - gridSize; x <= gridX + gridSize; x += gridSize) {
            // 计算这条线到鼠标的距离，用于渐变
            const distanceX = Math.abs(x - mouseX);
            const opacity = Math.max(0, 1 - distanceX / radius) * 0.4; // 根据距离计算不透明度
            
            ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
            ctx.lineWidth = 1.5;
            
            // 垂直线使用渐变
            const gradient = ctx.createLinearGradient(x, gridY - gridSize, x, gridY + gridSize * 2);
            const centerY = mouseY;
            const distTop = Math.abs((gridY - gridSize) - centerY);
            const distBottom = Math.abs((gridY + gridSize * 2) - centerY);
            
            gradient.addColorStop(0, `rgba(0, 217, 255, ${Math.max(0, 1 - distTop / radius) * 0.4})`);
            gradient.addColorStop(0.5, `rgba(0, 217, 255, ${opacity})`);
            gradient.addColorStop(1, `rgba(0, 217, 255, ${Math.max(0, 1 - distBottom / radius) * 0.4})`);
            
            ctx.strokeStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(x, gridY - gridSize);
            ctx.lineTo(x, gridY + gridSize * 2);
            ctx.stroke();
        }
        
        // 高亮的水平线（同样使用渐变）
        for (let y = gridY - gridSize; y <= gridY + gridSize; y += gridSize) {
            const distanceY = Math.abs(y - mouseY);
            const opacity = Math.max(0, 1 - distanceY / radius) * 0.4;
            
            // 水平线使用渐变
            const gradient = ctx.createLinearGradient(gridX - gridSize, y, gridX + gridSize * 2, y);
            const centerX = mouseX;
            const distLeft = Math.abs((gridX - gridSize) - centerX);
            const distRight = Math.abs((gridX + gridSize * 2) - centerX);
            
            gradient.addColorStop(0, `rgba(0, 217, 255, ${Math.max(0, 1 - distLeft / radius) * 0.4})`);
            gradient.addColorStop(0.5, `rgba(0, 217, 255, ${opacity})`);
            gradient.addColorStop(1, `rgba(0, 217, 255, ${Math.max(0, 1 - distRight / radius) * 0.4})`);
            
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
        
        // 绘制网格
        drawGrid();
        
        // 绘制鼠标高亮
        drawMouseHighlight();
        
        // 更新和绘制粒子
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // 绘制连接线
        drawConnections();
        
        requestAnimationFrame(animate);
    }
    
    animate();
    console.log('动态背景已启动 ✨ - 粒子数:', particleCount);
}

// ============================================
// 性能优化：防抖和节流
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

