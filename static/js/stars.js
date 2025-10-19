// ============================================
// Three.js 星空背景效果 - 调试版本
// ============================================

function initStarsBackground() {
    console.log('=== 开始初始化星空背景 ===');
    
    // 检查Three.js是否加载
    if (typeof THREE === 'undefined') {
        console.error('❌ Three.js库未加载');
        return;
    }
    console.log('✅ Three.js库已加载');
    
    const canvas = document.getElementById('starsCanvas');
    if (!canvas) {
        console.error('❌ 找不到starsCanvas元素');
        return;
    }
    console.log('✅ 找到canvas元素:', canvas);
    
    try {
        console.log('开始创建Three.js场景...');
        
        // 场景设置
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true,
            antialias: true 
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        
        // 添加背景渐变
        const backgroundGeometry = new THREE.PlaneGeometry(2000, 2000);
        const backgroundMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 }
            },
            vertexShader: `
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                void main() {
                    vec2 uv = gl_FragCoord.xy / vec2(1920.0, 1080.0);
                    
                    // 创建旋转的渐变中心
                    vec2 center = vec2(0.5 + 0.2 * sin(time * 0.5), 0.5 + 0.2 * cos(time * 0.3));
                    float distance = length(uv - center);
                    
                    // 深浅渐变：中心深，边缘浅
                    float intensity = 1.0 - smoothstep(0.0, 0.8, distance);
                    intensity = mix(0.1, 0.8, intensity);
                    
                    gl_FragColor = vec4(0.0, 0.0, 0.0, intensity);
                }
            `,
            transparent: true
        });
        
        const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        background.position.z = -100;
        scene.add(background);
        
        console.log('✅ Three.js场景创建完成');
        console.log('Canvas尺寸:', window.innerWidth, 'x', window.innerHeight);

        // 创建简单的星空粒子
        const starCount = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);

        // 生成随机星星位置
        for (let i = 0; i < starCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 2000;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        console.log('✅ 星星位置生成完成');

        // 使用自定义着色器材质创建圆形粒子
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 }
            },
            vertexShader: `
                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = 8.0 * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                void main() {
                    // 创建圆形粒子
                    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    
                    // 白色粒子
                    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * 1.0);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const stars = new THREE.Points(geometry, material);
        scene.add(stars);
        console.log('✅ 星星添加到场景');

        // 相机位置
        camera.position.z = 1000;
        console.log('✅ 相机位置设置完成');

        // 动画循环
        let frameCount = 0;
        let time = 0;
        let rotationSpeed = { x: 0.001, y: 0.002 };
        let targetSpeed = { x: 0.001, y: 0.002 };
        
        function animate() {
            requestAnimationFrame(animate);
            
            frameCount++;
            time += 0.01;
            
            if (frameCount % 60 === 0) {
                console.log('动画运行中... 帧数:', frameCount);
            }
            
            // 平滑过渡到目标速度
            rotationSpeed.x += (targetSpeed.x - rotationSpeed.x) * 0.1;
            rotationSpeed.y += (targetSpeed.y - rotationSpeed.y) * 0.1;
            
            // 更新背景渐变时间
            backgroundMaterial.uniforms.time.value = time;
            
            // 旋转星空
            stars.rotation.x += rotationSpeed.x;
            stars.rotation.y += rotationSpeed.y;
            
            renderer.render(scene, camera);
        }
        
        // 暴露速度控制函数
        window.starsController = {
            accelerate: function() {
                targetSpeed.x = 0.005;
                targetSpeed.y = 0.008;
                console.log('⚡ 星空加速');
            },
            decelerate: function() {
                targetSpeed.x = 0.001;
                targetSpeed.y = 0.002;
                console.log('🐌 星空减速');
            }
        };

        // 窗口大小调整
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            console.log('窗口大小调整:', window.innerWidth, 'x', window.innerHeight);
        }

        window.addEventListener('resize', onWindowResize);

        // 启动动画
        animate();
        
        console.log('🎉 星空背景动画已启动！粒子数:', starCount);
        console.log('=== 初始化完成 ===');
        
    } catch (error) {
        console.error('❌ 创建星空背景时出错:', error);
        console.error('错误详情:', error.stack);
    }
}

// ============================================
// Projects页面粒子旋转效果（原始设置）
// ============================================
function initProjectsParticles() {
    console.log('=== 开始初始化Projects粒子效果 ===');
    
    if (typeof THREE === 'undefined') {
        console.error('❌ Three.js库未加载');
        return null;
    }
    
    const canvas = document.getElementById('projectsCanvas');
    if (!canvas) {
        console.error('❌ 找不到projectsCanvas元素');
        return null;
    }
    
    try {
        // 场景设置
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true,
            antialias: true 
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        
        // 添加背景渐变
        const backgroundGeometry = new THREE.PlaneGeometry(2000, 2000);
        const backgroundMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 }
            },
            vertexShader: `
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                void main() {
                    vec2 uv = gl_FragCoord.xy / vec2(1920.0, 1080.0);
                    
                    // 创建旋转的渐变中心
                    vec2 center = vec2(0.5 + 0.2 * sin(time * 0.5), 0.5 + 0.2 * cos(time * 0.3));
                    float distance = length(uv - center);
                    
                    // 深浅渐变：中心深，边缘浅
                    float intensity = 1.0 - smoothstep(0.0, 0.8, distance);
                    intensity = mix(0.1, 0.8, intensity);
                    
                    gl_FragColor = vec4(0.0, 0.0, 0.0, intensity);
                }
            `,
            transparent: true
        });
        
        const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        background.position.z = -100;
        scene.add(background);

        // 创建丰富的星空粒子 - 原始数量
        const starCount = 1500;  // project页面保持原始数量
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);

        // 生成随机星星位置 - 扩大空间
        for (let i = 0; i < starCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 2500;  // 从2000扩大到2500
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // 使用自定义着色器材质创建圆形粒子
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 }
            },
            vertexShader: `
                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = 6.0 * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                void main() {
                    // 创建圆形粒子
                    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    
                    // 原始亮度的白色粒子
                    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * 0.8);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const stars = new THREE.Points(geometry, material);
        scene.add(stars);

        // 相机位置
        camera.position.z = 1000;

        // 动画状态
        let time = 0;
        let isActive = false;
        let animationId = null;
        let startTime = null;

        function animate(currentTime) {
            if (!isActive) return;
            
            // 初始化开始时间
            if (startTime === null) {
                startTime = currentTime;
            }
            
            // 计算相对于开始时间的经过时间
            const elapsedTime = currentTime - startTime;
            
            animationId = requestAnimationFrame(animate);
            time += 0.01;
            
            // 更新背景渐变时间
            backgroundMaterial.uniforms.time.value = time;
            
            // 旋转星空 - 基于经过时间计算旋转，确保速度恒定
            stars.rotation.x = elapsedTime * 0.00005;
            stars.rotation.y = elapsedTime * 0.00008;
            
            renderer.render(scene, camera);
        }

        // 窗口大小调整
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', onWindowResize);

        console.log('🎉 Projects粒子效果创建完成！粒子数:', starCount);
        
        return {
            start: () => {
                isActive = true;
                startTime = null; // 重置开始时间
                animate(performance.now());
                console.log('▶️ Projects粒子动画启动');
            },
            stop: () => {
                isActive = false;
                startTime = null; // 重置开始时间
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
                console.log('⏸️ Projects粒子动画停止');
            }
        };
        
    } catch (error) {
        console.error('❌ 创建Projects粒子时出错:', error);
        return null;
    }
}

// ============================================
// Creative Works页面粒子旋转效果
// ============================================
function initCreativeWorksParticles() {
    console.log('=== 开始初始化Creative Works粒子效果 ===');
    
    if (typeof THREE === 'undefined') {
        console.error('❌ Three.js库未加载');
        return null;
    }
    
    const canvas = document.getElementById('experimentsCanvas');
    if (!canvas) {
        console.error('❌ 找不到experimentsCanvas元素');
        return null;
    }
    
    try {
        // 场景设置
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true,
            antialias: true 
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        
        // 添加背景渐变
        const backgroundGeometry = new THREE.PlaneGeometry(2000, 2000);
        const backgroundMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 }
            },
            vertexShader: `
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                void main() {
                    vec2 uv = gl_FragCoord.xy / vec2(1920.0, 1080.0);
                    
                    // 创建旋转的渐变中心
                    vec2 center = vec2(0.5 + 0.2 * sin(time * 0.5), 0.5 + 0.2 * cos(time * 0.3));
                    float distance = length(uv - center);
                    
                    // 深浅渐变：中心深，边缘浅
                    float intensity = 1.0 - smoothstep(0.0, 0.8, distance);
                    intensity = mix(0.1, 0.8, intensity);
                    
                    gl_FragColor = vec4(0.0, 0.0, 0.0, intensity);
                }
            `,
            transparent: true
        });
        
        const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        background.position.z = -100;
        scene.add(background);

        // 创建丰富的星空粒子
        const starCount = 1500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);

        // 生成随机星星位置
        for (let i = 0; i < starCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 2500;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // 使用自定义着色器材质创建圆形粒子
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 }
            },
            vertexShader: `
                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = 6.0 * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                void main() {
                    // 创建圆形粒子
                    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    
                    // 白色粒子
                    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * 0.8);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const stars = new THREE.Points(geometry, material);
        scene.add(stars);

        // 相机位置
        camera.position.z = 1000;

        // 动画状态
        let time = 0;
        let isActive = false;
        let animationId = null;
        let startTime = null;

        function animate(currentTime) {
            if (!isActive) return;
            
            // 初始化开始时间
            if (startTime === null) {
                startTime = currentTime;
            }
            
            // 计算相对于开始时间的经过时间
            const elapsedTime = currentTime - startTime;
            
            animationId = requestAnimationFrame(animate);
            time += 0.01;
            
            // 更新背景渐变时间
            backgroundMaterial.uniforms.time.value = time;
            
            // 旋转星空 - 基于经过时间计算旋转，确保速度恒定
            stars.rotation.x = elapsedTime * 0.00005;
            stars.rotation.y = elapsedTime * 0.00008;
            
            renderer.render(scene, camera);
        }

        // 窗口大小调整
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', onWindowResize);

        console.log('🎉 Creative Works粒子效果创建完成！粒子数:', starCount);
        
        return {
            start: () => {
                isActive = true;
                startTime = null; // 重置开始时间
                animate(performance.now());
                console.log('▶️ Creative Works粒子动画启动');
            },
            stop: () => {
                isActive = false;
                startTime = null; // 重置开始时间
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
                console.log('⏸️ Creative Works粒子动画停止');
            }
        };
        
    } catch (error) {
        console.error('❌ 创建Creative Works粒子时出错:', error);
        return null;
    }
}

// ============================================
// Contact页面粒子旋转效果（与Projects相同）
// ============================================
function initContactParticles() {
    console.log('=== 开始初始化Contact粒子效果 ===');
    
    if (typeof THREE === 'undefined') {
        console.error('❌ Three.js库未加载');
        return null;
    }
    
    const canvas = document.getElementById('contactCanvas');
    if (!canvas) {
        console.error('❌ 找不到contactCanvas元素');
        return null;
    }
    
    try {
        // 场景设置
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true,
            antialias: true 
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 1);
        
        // 纯黑色背景 - 不需要额外的背景几何体

        // 创建丰富的星空粒子 - 原始数量
        const starCount = 1500;  // contact页面保持原始数量
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);

        // 生成随机星星位置 - 扩大空间
        for (let i = 0; i < starCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 2500;  // 从2000扩大到2500
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // 使用自定义着色器材质创建圆形粒子
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 }
            },
            vertexShader: `
                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = 6.0 * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                void main() {
                    // 创建圆形粒子
                    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    
                    // 原始亮度的白色粒子
                    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * 0.8);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const stars = new THREE.Points(geometry, material);
        scene.add(stars);

        // 相机位置
        camera.position.z = 1000;

        // 动画状态
        let time = 0;
        let isActive = false;
        let animationId = null;
        let startTime = null;

        function animate(currentTime) {
            if (!isActive) return;
            
            // 初始化开始时间
            if (startTime === null) {
                startTime = currentTime;
            }
            
            // 计算相对于开始时间的经过时间
            const elapsedTime = currentTime - startTime;
            
            animationId = requestAnimationFrame(animate);
            time += 0.01;
            
            // 旋转星空 - 基于经过时间计算旋转，确保速度恒定
            stars.rotation.x = elapsedTime * 0.00005;
            stars.rotation.y = elapsedTime * 0.00008;
            
            renderer.render(scene, camera);
        }

        // 窗口大小调整
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', onWindowResize);

        console.log('🎉 Contact粒子效果创建完成！粒子数:', starCount);
        
        return {
            start: () => {
                isActive = true;
                startTime = null; // 重置开始时间
                animate(performance.now());
                console.log('▶️ Contact粒子动画启动');
            },
            stop: () => {
                isActive = false;
                startTime = null; // 重置开始时间
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
                console.log('⏸️ Contact粒子动画停止');
            }
        };
        
    } catch (error) {
        console.error('❌ 创建Contact粒子时出错:', error);
        return null;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM加载完成，准备初始化星空背景...');
    
    // 等待Three.js库加载
    function checkThreeJS() {
        if (typeof THREE !== 'undefined') {
            console.log('✅ Three.js库已加载，开始初始化...');
            initStarsBackground();
            
            // 初始化Projects粒子（但不立即启动）
            window.projectsParticles = initProjectsParticles();
            
            // 初始化Creative Works粒子（但不立即启动）
            window.creativeWorksParticles = initCreativeWorksParticles();
            
            // 初始化Contact粒子（但不立即启动）
            window.contactParticles = initContactParticles();
        } else {
            console.log('⏳ 等待Three.js库加载...');
            setTimeout(checkThreeJS, 100);
        }
    }
    
    checkThreeJS();
});
