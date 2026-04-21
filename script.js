// 1. Global Setup
const CONFIG = { points: 32000 };
let scene, camera, renderer, material, points;
let isRunning = false;
let totalElapsed = 0, lastTime = 0;

// 2. Mobile-Optimized Shaders
const vertexShader = `
    uniform float uTime;
    uniform float uProgress;
    attribute float t;
    varying float vIntensity;
    void main() {
        float r = 2.0;
        float x = r * (cos(2.0 * t) * (2.0 + cos(5.0 * t)));
        float y = r * (sin(2.0 * t) * (2.0 + cos(5.0 * t)));
        float z = r * sin(5.0 * t);
        
        vec3 pos = vec3(x, y, z);
        vIntensity = pow(1.0 - uProgress, 2.0);
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Size attenuation: keeps points visible on small mobile screens
        gl_PointSize = mix(6.0, 2.0, uProgress) * (20.0 / -mvPosition.z);
    }
`;

const fragmentShader = `
    uniform float uProgress;
    varying float vIntensity;
    void main() {
        vec3 color = mix(vec3(0.0, 1.0, 1.0), vec3(1.0, 0.4, 0.0), uProgress);
        gl_FragColor = vec4(color, vIntensity);
    }
`;

// 3. Initialization Logic
function init() {
    scene = new THREE.Scene();
    
    // Adjusted FOV for mobile vertical viewing
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25; 

    const canvas = document.getElementById('vesselCanvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BufferGeometry();
    const tValues = new Float32Array(CONFIG.points);
    for (let i = 0; i < CONFIG.points; i++) {
        tValues[i] = (i / CONFIG.points) * Math.PI * 2;
    }
    geometry.setAttribute('t', new THREE.BufferAttribute(tValues, 1));

    material = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uProgress: { value: 0 } },
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
}

// 4. Animation Engine
function animate(now) {
    if (!lastTime) lastTime = now;
    const delta = now - lastTime;
    lastTime = now;

    if (isRunning) {
        totalElapsed += delta;
        const progress = Math.min(totalElapsed / 660000, 1.0);
        material.uniforms.uProgress.value = progress;
        material.uniforms.uTime.value = now * 0.001;
        
        points.rotation.y += 0.003;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// 5. Activation & Resize Listeners
const startButton = document.getElementById('startButton');

const startSequence = () => {
    document.getElementById('overlay').style.display = 'none';
    isRunning = true;
    lastTime = performance.now();
};

// Double listener for desktop click and mobile touch
startButton.addEventListener('click', startSequence);
startButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startSequence();
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Execute Launch
init();
requestAnimationFrame(animate);
