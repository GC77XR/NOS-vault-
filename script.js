// --- 1. CONFIGURATION & STATE ---
let totalSeconds = 0;
let timerInterval, heartbeatInterval;
let beatInterval = 0.508; // Default Timing

// Element Selectors
const bootScreen = document.getElementById('boot-screen');
const vessel = document.getElementById('vessel');
const vesselContainer = document.getElementById('vessel-container');
const nosAsset = document.getElementById('asset-nos');
const sonicAsset = document.getElementById('asset-sonic');
const timestampDisplay = document.getElementById('timestamp');
const reEnterBtn = document.getElementById('re-enter-btn');

// --- 2. THE ENGINE ---

function startVessel(mode) {
    // Safety Reset: Clear any existing processes
    clearInterval(timerInterval);
    clearInterval(heartbeatInterval);
    window.speechSynthesis.cancel();
    totalSeconds = 0;

    // UI Transition
    bootScreen.classList.add('hidden');
    vessel.classList.remove('hidden');
    document.getElementById('interface').classList.add('hidden');

    // Mode-Specific Configuration
    if (mode === 'nos') {
        vesselContainer.classList.remove('interceptor-bg');
        nosAsset.classList.remove('hidden');
        sonicAsset.classList.add('hidden');
        sonicAsset.classList.remove('sonic-core');
        beatInterval = 0.8; // Meditative pulse
        speak("Calibration Reset. Beginning NOS Vessel integration.");
    } else {
        vesselContainer.classList.add('interceptor-bg');
        sonicAsset.classList.remove('hidden');
        sonicAsset.classList.add('sonic-core'); // Start rotation/pulse
        nosAsset.classList.add('hidden');
        beatInterval = 0.508; // High-energy calibration
        speak("Ignite. Sonic Calibration active.");
    }

    // Start 11-Minute Master Timer (660 seconds)
    timerInterval = setInterval(updateDataLog, 1000);
    // Note: Ensure your playHeartbeat() function is defined to use beatInterval
    heartbeatInterval = setInterval(playHeartbeat, beatInterval * 1000);
}

function updateDataLog() {
    totalSeconds++;
    
    // The 11-Minute Gatekeeper
    if (totalSeconds >= 660) {
        terminateSession();
        return;
    }

    // Update Visual Clock (00:MM:SS)
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    timestampDisplay.innerText = `SYNC: 00:${mins}:${secs}`;
}

function terminateSession() {
    clearInterval(timerInterval);
    clearInterval(heartbeatInterval);
    
    // Final UI Swap
    vessel.classList.add('hidden');
    document.getElementById('interface').classList.remove('hidden');
    reEnterBtn.classList.remove('hidden');
    
    speak("Integration Complete. You may now re-enter.");
}

// --- 3. EVENT LISTENERS ---
document.getElementById('btn-nos').addEventListener('click', () => startVessel('nos'));
document.getElementById('btn-sonic').addEventListener('click', () => startVessel('sonic'));
reEnterBtn.addEventListener('click', () => window.location.reload());
