const CONFIG = { p: 2, q: 5, points: 32000, duration: 11 * 60 * 1000 };

let scene, camera, renderer, material;
let totalElapsed = 0, lastTime = 0, isRunning = false;

const vertexShader = `
    uniform float uTime;
    uniform float uProgress;
    attribute float t;
    void main() {
        float p = 2.0; float q = 5.0; float r = 150.0;
        float x = r * (cos(p * t) * (2.0 + cos(q * t)));
        float y = r * (sin(p * t) * (2.0 + cos(q * t)));
        float z = r * sin(q * t);
        float intensity = pow(1.0 - uProgress, 3.0);
        float nX = sin(t * 100.0 + uTime * 20.0) * intensity * 15.0;
        float nY = cos(t * 120.0 + uTime * 15.0) * intensity * 15.0;
        float nZ = sin(t * 80.0 + uTime * 25.0) * intensity * 15.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(x + nX, y + nY, z + nZ, 1.0);
        gl_PointSize = mix(8.0, 2.0, uProgress);
    }
`;

const fragmentShader = `
    uniform float uProgress;
    void main() {
        float dist = distance(gl_PointCoord, vec2(0.5));
        float mask = 1.0 - smoothstep(0.0, 0.5, dist);
        vec3 startColor = vec3(0.0, 1.0, 1.0);
        vec3 endColor = vec3(0.58, 0.0, 0.83);
        gl_FragColor = vec4(mix(startColor, endColor, uProgress), mask);
    }
`;

function init() {
    scene = new THREE.Scene();
    const aspect = window.innerWidth / window.innerHeight;
    const d = 300;
    camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    camera.position.z = 500;

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('vesselCanvas'), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BufferGeometry();
    const tValues = new Float32Array(CONFIG.points);
    for (let i = 0; i < CONFIG.points; i++) tValues[i] = (i / CONFIG.points) * Math.PI * 2;
    geometry.setAttribute('t', new THREE.BufferAttribute(tValues, 1));

    material = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uProgress: { value: 0 } },
        vertexShader, fragmentShader, transparent: true, blending: THREE.AdditiveBlending
    });

    scene.add(new THREE.Points(geometry, material));
}

function animate(now) {
    if (!lastTime) lastTime = now;
    const delta = now - lastTime;
    lastTime = now;
    if (isRunning && document.visibilityState === 'visible') totalElapsed += delta;
    const progress = Math.min(totalElapsed / CONFIG.duration, 1.0);
    material.uniforms.uProgress.value = progress;
    material.uniforms.uTime.value = now / 1000;
    if (progress >= 1.0) document.getElementById('status-display').classList.add('visible');
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'none';
    isRunning = true;
    lastTime = performance.now();
});

init();
requestAnimationFrame(animate);
