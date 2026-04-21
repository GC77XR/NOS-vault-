const BPM = 118;
const BEAT_INTERVAL = 60 / BPM;
const SESSION_LIMIT = 11 * 60; 
let audioCtx, timerStart, nextBeatTime;
let appState = 'LOBBY';

// Visuals
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('vesselCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const arcs = [];
const createArc = (radius, op, speed) => {
    const geo = new THREE.TorusGeometry(radius, 0.01, 2, 100, Math.PI * 1.5);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: op });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    return { mesh, speed };
};

arcs.push(createArc(1.2, 0.7, 0.01));
arcs.push(createArc(1.5, 0.3, -0.005));
camera.position.z = 3;

function playHeartbeat(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = 55; 
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(time); osc.stop(time + 0.12);
}

function animate() {
    requestAnimationFrame(animate);
    if (appState === 'ACTIVE') {
        arcs.forEach(a => a.mesh.rotation.z += a.speed);
        
        const elapsed = (Date.now() - timerStart) / 1000;
        const remaining = Math.max(0, SESSION_LIMIT - elapsed);
        
        document.getElementById('timer').innerText = `${Math.floor(remaining / 60)}:${Math.floor(remaining % 60).toString().padStart(2, '0')}`;
        document.getElementById('percent').innerText = Math.floor((elapsed / SESSION_LIMIT) * 100);

        while (nextBeatTime < audioCtx.currentTime + 0.1) {
            playHeartbeat(nextBeatTime);
            nextBeatTime += BEAT_INTERVAL;
        }

        if (elapsed >= SESSION_LIMIT) {
            appState = 'END';
            arcs.forEach(a => a.mesh.material.color.set(0xffffff));
            document.getElementById('finalState').style.display = 'flex';
        }
    }
    renderer.render(scene, camera);
}

document.getElementById('startButton').addEventListener('click', () => {
    const mainUI = document.getElementById('main-ui');
    mainUI.classList.add('boot-flicker'); 
    
    setTimeout(() => {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        nextBeatTime = audioCtx.currentTime;
        timerStart = Date.now();
        appState = 'ACTIVE';
        mainUI.classList.remove('boot-flicker');
        document.body.classList.add('is-active'); 
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('hud').style.display = 'block';
    }, 400); 
});

animate();
