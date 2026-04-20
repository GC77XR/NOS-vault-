let audioCtx;
let totalSeconds = 0;
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
    console.log("NOS Vessel Ignited...");
    
    // Start the visual pulse
    document.getElementById('main-asset').classList.add('pulse-lub');
    // Targets the second image (7996.png)
    document.querySelector('img[src*="7996.png"]').classList.add('pulse-dub');

    // Start the Timer (1 tick per second)
    setInterval(updateDataLog, 1000);

    // Start the Audio Heartbeat
    setInterval(playHeartbeat, beatInterval * 1000);
}

function updateDataLog() {
    totalSeconds++;
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    document.getElementById('timestamp').innerText = `SYNC: 00:${mins}:${secs}`;
}

function playHeartbeat() {
    const now = audioCtx.currentTime;
    const osc = (freq, time, gainVal) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.frequency.setValueAtTime(freq, time);
        g.gain.setValueAtTime(gainVal, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start(time);
        o.stop(time + 0.1);
    };
    osc(60, now, 0.5); // Lub
    osc(90, now + 0.15, 0.3); // Dub
}
