// 1. Global Configurations and Variables
const CONFIG = { p: 2, q: 5, points: 32000 };
let scene, camera, renderer, material, points;
let isRunning = false;
let totalElapsed = 0, lastTime = 0;

// 2. Shader Programs
const vertexShader = `
    uniform float uTime;
    uniform float uProgress;
    attribute float t;
    varying float vIntensity;
    void main() {
        float p = 2.0; float q = 5.0; float r = 2.0;
        float x = r * (cos(p * t) * (2.0 + cos(q * t)));
        float y = r * (sin(p * t) * (2.0 + cos(q * t)));
        float z = r * sin(q * t);
        
        vec3 pos = vec3(x, y, z);
        float intensity = pow(1.0 - uProgress, 2.0);
        vIntensity = intensity;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = mix(8.0, 2.0, uProgress) * (10.0 / -mvPosition.z);
    }
`;

const fragmentShader = `
    uniform float uProgress;
    varying float vIntensity;
    void main() {
        vec3 color = mix(vec3(0.0, 1.0, 1.0), vec3(1.0, 0.5, 0.0), uProgress);
        gl_FragColor = vec4(color, vIntensity);
    }
`;

// 3. Initialization Function
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    const canvas = document.getElementById('vesselCanvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.BufferGeometry();
    const tValues = new Float32Array(CONFIG.points);
    for (let i = 0; i < CONFIG.points; i++) {
        tValues[i] = (i / CONFIG.points) * Math.PI * 2;
    }
    geometry.setAttribute('t', new THREE.BufferAttribute(tValues, 1));

    material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uProgress: { value: 0 }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
}

// 4. Animation Loop
function animate(now) {
    if (!lastTime) lastTime = now;
    const delta = now - lastTime;
    lastTime = now;

    if (isRunning) {
        totalElapsed += delta;
        const progress = Math.min(totalElapsed / 660000, 1.0); // 11 minute countdown
        material.uniforms.uProgress.value = progress;
        material.uniforms.uTime.value = now * 0.001;
        
        points.rotation.y += 0.002;
        points.rotation.z += 0.001;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// 5. Execution and Event Listeners
document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'none';
    isRunning = true;
    lastTime = performance.now();
});

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the System
init();
requestAnimationFrame(animate);
