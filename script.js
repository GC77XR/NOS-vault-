// 1. Core State
let scene, camera, renderer, material, points;
let isRunning = false;
let lastTime = 0;
const totalDuration = 660000; // 11 mins

function init() {
    scene = new THREE.Scene();
    
    // Wide Field of View (75) and moved back (z:30) to ensure visibility
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);

    const canvas = document.getElementById('vesselCanvas');
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true, 
        alpha: true,
        precision: "highp" // Ensures high detail on mobile screens
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create Geometry
    const geometry = new THREE.BufferGeometry();
    const count = 25000; // Slightly reduced for mobile performance
    const tValues = new Float32Array(count);
    for(let i=0; i<count; i++) tValues[i] = (i/count) * Math.PI * 2;
    geometry.setAttribute('t', new THREE.BufferAttribute(tValues, 1));

    // Mobile-Optimized Shaders
    material = new THREE.ShaderMaterial({
        uniforms: { 
            uProgress: { value: 0 },
            uTime: { value: 0 }
        },
        vertexShader: `
            attribute float t;
            uniform float uProgress;
            uniform float uTime;
            varying float vIntensity;
            void main() {
                float r = 5.0; // Scale up the object size
                float x = r * (cos(2.0 * t) * (2.0 + cos(5.0 * t + uTime)));
                float y = r * (sin(2.0 * t) * (2.0 + cos(5.0 * t + uTime)));
                float z = r * sin(5.0 * t);
                
                vec4 mvPosition = modelViewMatrix * vec4(x, y, z, 1.0);
                vIntensity = 1.0 - uProgress;
                
                // Force point size to be visible (min 2.0 pixels)
                gl_PointSize = max(2.0, 300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform float uProgress;
            varying float vIntensity;
            void main() {
                vec3 color = mix(vec3(0.0, 1.0, 1.0), vec3(1.0, 0.5, 0.0), uProgress);
                gl_FragColor = vec4(color, vIntensity);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);

    animate();
}

function animate(now) {
    requestAnimationFrame(animate);
    
    if (isRunning) {
        if (!lastTime) lastTime = now;
        let elapsed = now - lastTime;
        let progress = Math.min(elapsed / totalDuration, 1.0);
        
        material.uniforms.uProgress.value = progress;
        material.uniforms.uTime.value = now * 0.001;
        points.rotation.y += 0.005;
        points.rotation.x += 0.002;
    }
    
    renderer.render(scene, camera);
}

// Window Resize Fix
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start Event
document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'none';
    isRunning = true;
});

init();
