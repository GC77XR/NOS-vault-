let audioCtx;
const startBtn = document.getElementById('start-btn');
const bootScreen = document.getElementById('boot-screen');
const vessel = document.getElementById('vessel-container');

const bpm = 118;
const beatInterval = 60 / bpm;

startBtn.addEventListener('click', () => {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    bootScreen.classList.add('hidden');
    vessel.classList.remove('hidden');
    initiateCalibration();
});

function initiateCalibration() {
    console.log("NOS Vessel Ignited at 118 BPM...");
    setInterval(() => {
        playHeartbeat();
    }, beatInterval * 1000);
}

function playHeartbeat() {
    const now = audioCtx.currentTime;

    // LUB
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.frequency.setValueAtTime(60, now);
    gain1.gain.setValueAtTime(0.5, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.1);

    // DUB
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
