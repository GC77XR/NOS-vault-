// --- 1. GLOBAL STATE ---
let audioCtx;
let masterGain;
let timerInterval;
let timeLeft = 660;

// --- 2. AUDIO ENGINE ---
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.connect(audioCtx.destination);
    }
}

function playPulse(type, time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    if (type === 'nos') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, time); // Deep Bass
    } else {
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, time); // High Ping
    }

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.1);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + 0.1);
}

// --- 3. CORE LOGIC ---
function startVessel(mode) {
    initAudio();
    const now = audioCtx.currentTime;
    
    // UI Resets
    document.getElementById('boot-screen').classList.add('hidden');
    document.getElementById('vessel').classList.remove('hidden');
    masterGain.gain.setValueAtTime(1, now);

    if (mode === 'sonic') {
        document.getElementById('asset-sonic').classList.remove('hidden');
        document.getElementById('asset-nos').classList.add('hidden');
        document.getElementById('vessel').classList.add('sonic-theme');

        // Sonic Burst (Rapid Pings)
        for (let i = 0; i < 10; i++) {
            playPulse('sonic', now + (i * 0.05));
        }
        // Start steady 236 BPM rhythm after burst
        scheduleLoop('sonic', now + 0.5);
    } else {
        document.getElementById('asset-nos').classList.remove('hidden');
        document.getElementById('asset-sonic').classList.add('hidden');
        document.getElementById('vessel').classList.remove('sonic-theme');
        
        // Start 118 BPM heartbeat
        scheduleLoop('nos', now);
    }

    runTimer();
}

function scheduleLoop(type, startTime) {
    const interval = (type === 'nos') ? 0.508 : 0.254;
    for (let i = 0; i < 100; i++) {
        playPulse(type, startTime + (i * interval));
    }
}

function runTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft === 2) startFinalFade();
        if (timeLeft <= 0) endSession();
    }, 1000);
}

function updateDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById('timestamp').innerText = `SYNC: 00:${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
}

function startFinalFade() {
    document.getElementById('vessel').style.opacity = '0';
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 2);
}

function endSession() {
    clearInterval(timerInterval);
    document.getElementById('re-enter-btn').classList.remove('hidden');
}

// --- 4. EVENT LISTENERS ---
document.getElementById('btn-nos').addEventListener('click', () => startVessel('nos'));
document.getElementById('btn-sonic').addEventListener('click', () => startVessel('sonic'));
document.getElementById('re-enter-btn').addEventListener('click', () => location.reload());
