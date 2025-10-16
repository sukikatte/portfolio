// 项目详情页 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('项目详情页已加载');
    
    // 初始化返回按钮
    initBackButton();
    
    // 初始化动态背景
    initDynamicBackground();
});

// 初始化返回按钮
function initBackButton() {
    const backLink = document.querySelector('.back-link');
    if (!backLink) return;
    
    // 添加点击事件
    backLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        console.log('点击返回按钮');
        
        // 添加点击动画
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // 直接返回上一页
        setTimeout(() => {
            window.history.back();
        }, 200);
    });
}

// ============================================
// 动态背景：网格线条 + 流动粒子 + 鼠标交互
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
            this.radius = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.6 + 0.3;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // 鼠标交互 - 粒子闪避效果
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
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
            
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // 绘制网格线 - 已删除静态网格，只保留鼠标跟随效果
    function drawGrid() {
        // 静态网格线已移除，只保留鼠标跟随的交互效果
    }
    
    // 绘制粒子之间的连接线
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 1;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 1.5;
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
        bgGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        bgGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
        bgGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
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
            
            gradient.addColorStop(0, `rgba(255, 255, 255, ${Math.max(0, 1 - distTop / radius) * 1})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, ${Math.max(0, 1 - distBottom / radius) * 1})`);
            
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
            
            gradient.addColorStop(0, `rgba(255, 255, 255, ${Math.max(0, 1 - distLeft / radius) * 1})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, ${Math.max(0, 1 - distRight / radius) * 1})`);
            
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

