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
    // The heartbeat oscillators will be added here next!
}
