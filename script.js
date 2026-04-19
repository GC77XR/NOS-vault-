let audioCtx;

// 1. System Boot Confirmation
alert("NOS ALPHA: System Online. Awaiting Handshake.");

function initiateSataCodaPulse() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Force mobile browsers to wake up the audio engine
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
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

// 2. The Handshake Listener (Upgraded for all touch types)
['click', 'touchstart'].forEach(eventType => {
    document.body.addEventListener(eventType, function() {
        alert("Handshake Detected 🤝. Initiating 118 BPM Pulse.");
        initiateSataCodaPulse();
    }, { once: true });
});
