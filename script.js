const audio = document.getElementById('calibration-track');
const root = document.getElementById('vessel-root');
const overlay = document.getElementById('vessel-overlay');
const logo = document.getElementById('micro-haus-logo');
const seal = document.getElementById('final-seal');

audio.ontimeupdate = () => {
    // Trigger transition at 650 seconds
    if (audio.currentTime >= 650) {
        root.classList.add('coda-state');
        overlay.classList.remove('hidden');
        // Logic to sink 3D object would go here
    }
};

logo.onclick = () => {
    logo.classList.add('stardust-evaporate');
    setTimeout(() => {
        seal.classList.remove('hidden');
    }, 2032); // 4 beats at 118 BPM
};
