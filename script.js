const audio = document.getElementById('calibration-track');
const root = document.getElementById('vessel-root');
const overlay = document.getElementById('vessel-overlay');
const logo = document.getElementById('micro-haus-logo');
const seal = document.getElementById('final-seal');

// Tap anywhere to start the experience and unlock audio
window.addEventListener('click', () => {
    audio.play().catch(() => console.log("Audio waiting for file..."));
    
    // Fade in the logo experience
    overlay.classList.remove('hidden');
    
    // Start transition to Gold after a short delay for testing
    setTimeout(() => {
        root.classList.add('coda-state');
    }, 3000);
}, { once: true });

logo.onclick = (e) => {
    e.stopPropagation(); // Prevents restarting the intro
    logo.classList.add('stardust-evaporate');
    setTimeout(() => {
        seal.classList.remove('hidden');
    }, 2032);
};
