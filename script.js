// NOS-VESSEL EMERGENCY FAILSAFE CORE
const canvas = document.getElementById('vesselCanvas');
const ctx = canvas.getContext('2d');
let isRunning = false;
let startTime = 0;

// Set Canvas Size
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function drawCore(time) {
    if (!isRunning) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.6;

    // 1. Draw Outer Tech Rings
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    
    for(let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - (i * 30), time * (0.001 * (i+1)), time * 0.001 + (Math.PI * 1.5));
        ctx.stroke();
    }

    // 2. Draw Pulsing Data Core
    const pulse = Math.sin(time * 0.005) * 10;
    ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50 + pulse, 0, Math.PI * 2);
    ctx.fill();

    // 3. Draw Scanning "Vessel" Lines
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(0, centerY + Math.sin(time * 0.002) * 200);
    ctx.lineTo(canvas.width, centerY + Math.sin(time * 0.002) * 200);
    ctx.stroke();

    requestAnimationFrame(drawCore);
}

document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'none';
    isRunning = true;
    requestAnimationFrame(drawCore);
});
