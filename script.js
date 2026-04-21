let totalSeconds = 0;
let timerInterval, heartbeatInterval;

// Selectors
const bootScreen = document.getElementById('boot-screen');
const vessel = document.getElementById('vessel');
const vesselContainer = document.getElementById('vessel-container');
const nosAsset = document.getElementById('asset-nos');
const sonicAsset = document.getElementById('asset-sonic');
const timestampDisplay = document.getElementById('timestamp');
const reEnterBtn = document.getElementById('re-enter-btn');

function startVessel(mode) {
    // Reset state
    clearInterval(timerInterval);
    clearInterval(heartbeatInterval);
    window.speechSynthesis.cancel();
    totalSeconds = 0;
    vessel.classList.remove('fade-out-active');

    // UI Toggle
    bootScreen.classList.add('hidden');
    vessel.classList.remove('hidden');

    if (mode === 'nos') {
        vesselContainer.classList.remove('interceptor-bg');
        nosAsset.classList.remove('hidden');
        nosAsset.classList.add('nos-breathing');
        sonicAsset.classList.add('hidden');
        sonicAsset.classList.remove('sonic-core');
    } else {
        vesselContainer.classList.add('interceptor-bg');
        sonicAsset.classList.remove('hidden');
        sonicAsset.classList.add('sonic-core');
        nosAsset.classList.add('hidden');
        nosAsset.classList.remove('nos-breathing');
    }

    timerInterval = setInterval(updateDataLog, 1000);
}

function updateDataLog() {
    totalSeconds++;
    
    if (totalSeconds >= 660) {
        terminateSession();
        return;
    }

    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    timestampDisplay.innerText = `SYNC: 00:${mins}:${secs}`;
}

function terminateSession() {
    clearInterval(timerInterval);
    clearInterval(heartbeatInterval);
    
    // 1s delay before fade begins
    setTimeout(() => {
        vessel.classList.add('fade-out-active');
        
        // 2s fade duration
        setTimeout(() => {
            vessel.classList.add('hidden');
            document.getElementById('interface').classList.remove('hidden');
            reEnterBtn.classList.remove('hidden');
        }, 2000);
    }, 1000);
}

// Event Listeners
document.getElementById('btn-nos').addEventListener('click', () => startVessel('nos'));
document.getElementById('btn-sonic').addEventListener('click', () => startVessel('sonic'));
reEnterBtn.addEventListener('click', () => window.location.reload());
