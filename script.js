let audioCtx;
let totalSeconds = 0;
let heartbeatInterval; // Named interval
let timerInterval; // Named interval

const startBtn = document.getElementById('start-btn');
const bootScreen = document.getElementById('boot-screen');
const vessel = document.getElementById('vessel-container');
const terminateBtn = document.getElementById('exit-cmd'); // Get the exit command

const bpm = 118;
const beatInterval = 60 / bpm;

// Start Logic
startBtn.addEventListener('click', () => {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    bootScreen.classList.add('hidden');
    vessel.classList.remove('hidden');
    initiateCalibration();
});

// Manual Termination Logic
terminateBtn.addEventListener('click', () => {
    terminateSession();
});

function initiateCalibration() {
    console.log("NOS Vessel Ignited...");
    
    // Apply animations
    document.getElementById('main-asset').classList.add('pulse-lub');
    document.querySelector('img[src*="7996.png"]').classList.add('pulse-dub');

    // Start intervals and store them in variables
    timerInterval = setInterval(updateDataLog, 1000);
    heartbeatInterval = setInterval(playHeartbeat, beatInterval * 1000);
}

function updateDataLog() {
    totalSeconds++;
    
    // Auto-stop at 30 seconds for the PoC
    if (totalSeconds >= 30) {
        terminateSession();
        return;
    }

    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    document.getElementById('timestamp').innerText = `SYNC: 00:${mins}:${secs}`;
}

function terminateSession() {
    console.log("Calibration Complete. Terminating...");
    
    // Stop all background processes
    clearInterval(timerInterval);
    clearInterval(heartbeatInterval);
    
    // Remove animation classes
    document.getElementById('main-asset').classList.remove('pulse-lub');
    document.querySelector('img[src*="7996.png"]').classList.remove('pulse-dub');
    
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
    osc(60, now, 0.5); // Lub
    osc(90, now + 0.15, 0.3); // Dub
}
