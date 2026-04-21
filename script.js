const BPM = 118;
const BEAT_INTERVAL = 60 / BPM;
const SESSION_LIMIT = 11 * 60; 
let audioCtx, timerStart, nextBeatTime;
let appState = 'LOBBY';

// --- 3D SCENE SETUP ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('vesselCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create the Arcs from your video
const arcs = [];
const arcData = [
    { rad: 0.8, speed: 0.01, op: 0.8 },
    { rad: 1.0, speed: -0.008, op: 0.5 },
    { rad: 1.2, speed: 0.005, op: 0.3 }
];

arcData.forEach(data => {
    const geo = new THREE.TorusGeometry(data.rad, 0.01, 2, 100, Math.PI * 1.4);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: data.op });
    const arc = new THREE.Mesh(geo, mat);
    arc.rotation.z = Math.random() * Math.PI;
    scene.add(arc);
    arcs.push({ mesh: arc, speed: data.speed });
});

// Central Glow
const coreGeo = new THREE.CircleGeometry(0.3, 32);
const coreMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6 });
const core = new THREE.Mesh(coreGeo, coreMat);
scene.add(core);

camera.position.z = 3;

// --- AUDIO ENGINE ---
function playHeartbeat(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = 50; 
    gain.gain.setValueAtTime(0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(time); osc.stop(time + 0.1);
}

function playGong() {
    [110, 144, 210].forEach(f => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 6);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 6);
    });
}

// --- MAIN LOOP ---
function animate() {
    requestAnimationFrame(animate);
    if (appState === 'ACTIVE') {
        // Update Visuals
        arcs.forEach(a => a.mesh.rotation.z += a.speed);
        core.scale.set(1 + Math.sin(Date.now() * 0.005) * 0.05, 1 + Math.sin(Date.now() * 0.005) * 0.05, 1);

        // Sync Audio
        while (nextBeatTime < audioCtx.currentTime + 0.1) {
            playHeartbeat(nextBeatTime);
            nextBeatTime += BEAT_INTERVAL;
        }

        // Timer Check
        if ((Date.now() - timerStart) / 1000 >= SESSION_LIMIT) {
            appState = 'END';
            playGong();
            // Freeze and Fade to White
            arcs.forEach(a => a.mesh.material.color.set(0xffffff));
            core.material.color.set(0xffffff);
            document.getElementById('finalState').style.display = 'flex';
        }
    }
    renderer.render(scene, camera);
}

document.getElementById('startButton').addEventListener('click', () => {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtx.resume();
    nextBeatTime = audioCtx.currentTime;
    timerStart = Date.now();
    appState = 'ACTIVE';
    document.getElementById('overlay').style.display = 'none';
});

animate();
