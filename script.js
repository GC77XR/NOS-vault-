const audio = document.getElementById('calibration-track');
const root = document.getElementById('vessel-root');
const overlay = document.getElementById('vessel-overlay');
const logo = document.getElementById('micro-haus-logo');
const seal = document.getElementById('final-seal');

let transitionTriggered = false;

audio.ontimeupdate = () => {
    // 1. Start transition at 650s (10s remaining)
    if (audio.currentTime >= 650 && !transitionTriggered) {
        transitionTriggered = true;
        
        // Background color morph
        root.classList.add('coda-state');
        
        // Reveal rising logo
        overlay.classList.remove('hidden');
        logo.parentElement.classList.add('rising-entrance');
        
        // Sinking the 3D octahedron (if using a 3D library like Three.js)
        // sinkOctahedron(); 
    }
};

// 2. The Final Interaction
logo.onclick = () => {
    logo.classList.add('stardust-evaporate');
    
    // After 4 beats (2.032s), show the final seal
    setTimeout(() => {
        seal.classList.remove('hidden');
    }, 2032);
};
