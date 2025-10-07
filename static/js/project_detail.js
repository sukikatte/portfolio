// ============================================
// Project Detail Page Interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // 页面加载动画
    initPageAnimation();
    
    // 滚动动画
    initScrollAnimations();
    
    // 平滑滚动
    initSmoothScroll();
    
    console.log('项目详情页已加载 ✨');
});

// ============================================
// 页面加载动画
// ============================================
function initPageAnimation() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
    });
    
    // 延迟显示每个section
    setTimeout(() => {
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.transition = 'all 0.6s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
}

// ============================================
// 滚动触发动画
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有内容区块
    const elements = document.querySelectorAll('.content-section, .highlight-item, .outcome-card, .learning-item');
    elements.forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// 平滑滚动
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// 数字计数动画（如果有数据统计）
// ============================================
function animateNumber(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

