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
        console.log('✅ 星星添加到场景');

        // 相机位置
        camera.position.z = 1000;
        console.log('✅ 相机位置设置完成');

        // 动画循环
        let frameCount = 0;
        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            
            frameCount++;
            time += 0.01;
            
            if (frameCount % 60 === 0) {
                console.log('动画运行中... 帧数:', frameCount);
            }
            
            // 更新背景渐变时间
            backgroundMaterial.uniforms.time.value = time;
            
            // 旋转星空
            stars.rotation.x += 0.001;
            stars.rotation.y += 0.002;
            
            renderer.render(scene, camera);
        }

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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM加载完成，准备初始化星空背景...');
    
    // 等待Three.js库加载
    function checkThreeJS() {
        if (typeof THREE !== 'undefined') {
            console.log('✅ Three.js库已加载，开始初始化...');
            initStarsBackground();
        } else {
            console.log('⏳ 等待Three.js库加载...');
            setTimeout(checkThreeJS, 100);
        }
    }
    
    checkThreeJS();
});
