// --- CONFIGURATION ---
const BPM = 118;
const BEAT_DURATION = 60 / BPM; 
const TOTAL_SESSION_TIME = 11 * 60; // 660 seconds
let audioCtx, nextBeatTime, timerStart;
let isRunning = false;

// --- AUDIO SYNTHESIS ---
function playHeartbeat(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = 50; // Pure Sub-Bass
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.1);
}

function playChirp(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(200, time);
    osc.frequency.exponentialRampToValueAtTime(800, time + 0.1);
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1); // Ping Fade
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.1);
}

function playGong() {
    const frequencies = [110, 143, 210]; // Additive Gong Sound
    frequencies.forEach(f => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 4);
    });
}

// --- ENGINE LOGIC ---
function scheduler() {
    while (nextBeatTime < audioCtx.currentTime + 0.1) {
        playHeartbeat(nextBeatTime);
        // Play chirp every 4 beats
        if (Math.round(nextBeatTime / BEAT_DURATION) % 4 === 0) {
            playChirp(nextBeatTime);
        }
        nextBeatTime += BEAT_DURATION;
    }
    
    // Check 11-minute Timer
    const elapsed = (Date.now() - timerStart) / 1000;
    if (elapsed >= TOTAL_SESSION_TIME) {
        stopSession();
    } else {
        requestAnimationFrame(scheduler);
    }
}

function stopSession() {
    isRunning = false;
    playGong();
    // Reveal Reset-Ignite-Integrate Button
    const btn = document.getElementById('finalButton');
    btn.style.display = 'block';
    // Logic to fade vessel to white goes here
}

document.getElementById('startButton').addEventListener('click', () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtx.resume();
    timerStart = Date.now();
    nextBeatTime = audioCtx.currentTime;
    isRunning = true;
    scheduler();
    document.getElementById('overlay').style.display = 'none';
});
