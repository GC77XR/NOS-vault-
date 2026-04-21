// 1. Core State
let scene, camera, renderer, material, points;
let isRunning = false;
let lastTime = 0;
const totalDuration = 660000; // 11 mins

// 2. Shaders (Simplified for Mobile Compatibility)
const vertexShader = `
    attribute float t;
    uniform float uProgress;
    varying float vIntensity;
    void main() {
        float r = 3.0;
        float x = r * (cos(2.0 * t) * (2.0 + cos(5.0 * t)));
        float y = r * (sin(2.0 * t) * (2.0 + cos(5.0 * t)));
        float z = r * sin(5.0 * t);
        
        vec4 mvPosition = modelViewMatrix * vec4(x, y, z, 1.0);
        vIntensity = 1.0 - uProgress;
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = 4.0 * (20.0 / -mvPosition.z);
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

function init() {
    scene = new THREE.Scene();
    
    // Wide FOV and far camera to ensure we don't "miss" the object
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 25);
    camera.lookAt(0, 0, 0);

    const canvas = document.getElementById('vesselCanvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.BufferGeometry();
    const count = 32000;
    const tValues = new Float32Array(count);
    for(let i=0; i<count; i++) tValues[i] = (i/count) * Math.PI * 2;
    geometry.setAttribute('t', new THREE.BufferAttribute(tValues, 1));

    material = new THREE.ShaderMaterial({
        uniforms: { uProgress: { value: 0 } },
        vertexShader,
        fragmentShader,
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
        points.rotation.y += 0.005;
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

// Launch
init();
