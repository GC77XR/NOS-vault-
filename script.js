// 1. Global System Configuration
const CONFIG = { p: 2, q: 5, points: 32000 };
let scene, camera, renderer, material, points;
let isRunning = false;
let totalElapsed = 0, lastTime = 0;

// 2. Optimized Shaders for Mobile Performance
const vertexShader = `
    uniform float uTime;
    uniform float uProgress;
    attribute float t;
    varying float vIntensity;
    void main() {
        // Torus Knot math for the Vessel Core
        float r = 2.0;
        float x = r * (cos(2.0 * t) * (2.0 + cos(5.0 * t)));
        float y = r * (sin(2.0 * t) * (2.0 + cos(5.0 * t)));
        float z = r * sin(5.0 * t);
        
        vec3 pos = vec3(x, y, z);
        vIntensity = pow(1.0 - uProgress, 2.0);
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Point size scales based on distance (better for phone screens)
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

// 3. System Initialization
function init() {
    scene = new THREE.Scene();
    
    // Field of View adjusted for mobile (75 degrees)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25; // Pull back so the core fits on narrow phone screens

    const canvas = document.getElementById('vesselCanvas');
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true, 
        alpha: true 
    });
    
    // Handle High-DPI phone screens (Retina/OLED)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Geometry Generation
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

// 4. Engine Loop
function animate(now) {
    if (!lastTime) lastTime = now;
    const delta = now - lastTime;
    lastTime = now;

    if (isRunning) {
        totalElapsed += delta;
        const progress = Math.min(totalElapsed / 660000, 1.0); // 11 min
        material.uniforms.uProgress.value = progress;
        material.uniforms.uTime.value = now * 0.001;
        
        points.rotation.y += 0.003;
        points.rotation.z += 0.001;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// 5. Mobile & Desktop Listeners
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'none';
    isRunning = true;
    lastTime = performance.now();
});

// Launch Sequence
init();
requestAnimationFrame(animate);
