// ============================================
// Three.js 高级星空背景效果 - 波浪和动态颜色
// ============================================

function initAdvancedStarsBackground() {
    console.log('开始初始化高级星空背景...');
    
    // 检查Three.js是否加载
    if (typeof THREE === 'undefined') {
        console.error('Three.js库未加载');
        return;
    }
    
    const canvas = document.getElementById('starsCanvas');
    if (!canvas) {
        console.error('找不到starsCanvas元素');
        return;
    }
    
    console.log('找到canvas元素，开始创建高级星空场景...');

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

        console.log('Three.js场景创建完成，开始生成高级星星...');

        // 创建星空粒子
        const starCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        // 生成随机星星位置和属性
        for (let i = 0; i < starCount; i++) {
            // 球面分布位置
            const radius = Math.random() * 800 + 400;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // 初始颜色
            colors[i * 3] = 0.5 + Math.random() * 0.5;     // R
            colors[i * 3 + 1] = 0.7 + Math.random() * 0.3; // G
            colors[i * 3 + 2] = 1.0;                        // B

            // 大小
            sizes[i] = Math.random() * 2 + 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // 自定义着色器材质
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                mousePos: { value: new THREE.Vector2(0, 0) }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                varying float vSize;
                uniform float time;
                uniform vec2 mousePos;
                
                void main() {
                    vColor = color;
                    vSize = size;
                    
                    // 波浪效果 - 使用sin函数
                    vec3 pos = position;
                    float wave = sin(time * 0.8 + position.x * 0.005 + position.y * 0.005) * 15.0;
                    pos.z += wave;
                    
                    // 鼠标交互效果
                    float mouseInfluence = 1.0 - distance(pos.xy, mousePos * 200.0) * 0.001;
                    mouseInfluence = max(0.0, mouseInfluence);
                    pos.z += mouseInfluence * 20.0;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + mouseInfluence);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vSize;
                uniform float time;
                
                void main() {
                    // 动态颜色变化 - 使用sin函数
                    float colorShift = sin(time * 0.4) * 0.3 + 0.7;
                    vec3 finalColor = vColor * colorShift;
                    
                    // 添加一些彩虹效果
                    float rainbow = sin(time * 0.6 + gl_FragCoord.x * 0.01) * 0.1;
                    finalColor.r += rainbow;
                    finalColor.g += sin(time * 0.6 + gl_FragCoord.x * 0.01 + 2.0) * 0.1;
                    finalColor.b += sin(time * 0.6 + gl_FragCoord.x * 0.01 + 4.0) * 0.1;
                    
                    // 圆形粒子
                    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    
                    // 闪烁效果
                    float twinkle = sin(time * 2.0 + vSize * 10.0) * 0.3 + 0.7;
                    alpha *= twinkle;
                    
                    gl_FragColor = vec4(finalColor, alpha * 0.9);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });

        const stars = new THREE.Points(geometry, material);
        scene.add(stars);

        console.log('高级星空场景创建完成，设置相机位置...');

        // 相机位置
        camera.position.z = 1000;

        // 鼠标交互
        let mouse = new THREE.Vector2();
        function onMouseMove(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            material.uniforms.mousePos.value.set(mouse.x, mouse.y);
        }
        window.addEventListener('mousemove', onMouseMove);

        // 动画循环
        let startTime = Date.now();
        
        function animate() {
            const currentTime = (Date.now() - startTime) * 0.001;
            
            // 更新着色器时间
            material.uniforms.time.value = currentTime;
            
            // 缓慢旋转星空
            stars.rotation.x = currentTime * 0.02;
            stars.rotation.y = currentTime * 0.03;
            
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }

        // 窗口大小调整
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener('resize', onWindowResize);

        // 启动动画
        animate();
        
        console.log('高级星空背景动画已启动 ✨ - 粒子数:', starCount);
        
    } catch (error) {
        console.error('创建高级星空背景时出错:', error);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，准备初始化高级星空背景...');
    
    // 等待Three.js库加载
    function checkThreeJS() {
        if (typeof THREE !== 'undefined') {
            console.log('Three.js库已加载');
            initAdvancedStarsBackground();
        } else {
            console.log('等待Three.js库加载...');
            setTimeout(checkThreeJS, 100);
        }
    }
    
    checkThreeJS();
});





