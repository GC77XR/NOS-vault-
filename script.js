let audioCtx;
let totalSeconds = 0;
let heartbeatInterval;
let timerInterval;

const startBtn = document.getElementById('start-btn');
const bootScreen = document.getElementById('boot-screen');
const vessel = document.getElementById('vessel-container');
const terminateBtn = document.getElementById('exit-cmd');
const imageA = document.getElementById('main-asset'); // 8419.png
const imageB = document.querySelector('img[src*="7996.png"]');

const bpm = 118;
const beatInterval = 60 / bpm;

// --- SPEECH ENGINE ---
function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.8; // Calm pace
    msg.pitch = 1.1; // Warm tone
    window.speechSynthesis.speak(msg);
}

startBtn.addEventListener('click', () => {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    bootScreen.classList.add('hidden');
    vessel.classList.remove('hidden');
    
    // Initial state for cross-fade
    imageA.classList.add('visible');
    imageB.classList.add('faded');
    
    initiateCalibration();
});

function initiateCalibration() {
    // 0s: Reset
    speak("Calibration Reset");
    
    // 12s: Ignite
    setTimeout(() => speak("Ignite"), 12000);
    
    // 15s: Cross-fade Start
    setTimeout(() => {
        imageA.classList.replace('visible', 'faded');
        imageB.classList.replace('faded', 'visible');
    }, 15000);
    
    // 25s: Integration
    setTimeout(() => speak("Integration Complete"), 25000);
    
    // 30s: Final Signature
    setTimeout(() => speak("NOS VESSEL by MICRO HAUS"), 30000);

    timerInterval = setInterval(updateDataLog, 1000);
    heartbeatInterval = setInterval(playHeartbeat, beatInterval * 1000);
}

function updateDataLog() {
    totalSeconds++;
    if (totalSeconds >= 31) { // Stop slightly after the final voice line
        terminateSession();
        return;
    }
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    document.getElementById('timestamp').innerText = `SYNC: 00:${mins}:${secs}`;
}

function terminateSession() {
    clearInterval(timerInterval);
    clearInterval(heartbeatInterval);
    imageA.classList.remove('pulse-lub');
    imageB.classList.remove('pulse-dub');
    alert("30-Second Proof of Concept Successful.");
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
    osc(60, now, 0.5);
    osc(90, now + 0.15, 0.3);
}
