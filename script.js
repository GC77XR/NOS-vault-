let audioCtx;

function initiateSataCodaPulse() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine'; 
    oscillator.frequency.setValueAtTime(55, audioCtx.currentTime);

    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();

    const beatIntervalMs = (60 / 118) * 1000; 
    
    setInterval(() => {
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.1, audioCtx.currentTime + 0.2);
    }, beatIntervalMs);
}

document.body.addEventListener('touchstart', function() {
    initiateSataCodaPulse();
}, { once: true });
