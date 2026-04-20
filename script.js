let audioCtx;
const startBtn = document.getElementById('start-btn');
const bootScreen = document.getElementById('boot-screen');
const vessel = document.getElementById('vessel-container');

// 118 BPM Constants
const bpm = 118;
const beatInterval = 60 / bpm; // 0.508 seconds

startBtn.addEventListener('click', () => {
    // Initialize Audio Context
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // UI Transition
    bootScreen.style.display = 'none';
    vessel.classList.remove('hidden');
    
    // Start the Ritual Sequence
    initiateCalibration();
});

function initiateCalibration() {
    console.log("NOS Vessel Ignited at 118 BPM...");
    
    // Schedule the heartbeat to start
    setInterval(() => {
        playHeartbeat();
    }, beatInterval * 1000);
}

function playHeartbeat() {
    const now = audioCtx.currentTime;

    // THE LUB (Deep Thump)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.frequency.setValueAtTime(60, now);
    gain1.gain.setValueAtTime(0.5, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.1);

    // THE DUB (Higher Snap)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.frequency.setValueAtTime(90, now + 0.15);
    gain2.gain.setValueAtTime(0.3, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.25);
}
