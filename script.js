const body = document.body;
const toggleBtn = document.getElementById('experience-toggle');
const logo = document.getElementById('logo-anchor');
const seal = document.getElementById('final-seal');

toggleBtn.addEventListener('click', () => {
    body.classList.add('coda-state');
    toggleBtn.style.display = 'none';

    // 30,000ms = 30 seconds
    setTimeout(() => {
        logo.style.opacity = "0.05"; // Start 10s fade to ghostly trace

        seal.innerHTML = `
            <h1 class="pulse-text">NOS CALIBRATION COMPLETE</h1>
            <p class="command-text">DJ GC77XR: Reset-Ignite-Integrate</p>
        `;
        seal.classList.remove('hidden');

        const resetBtn = document.createElement('button');
        resetBtn.innerText = "Return to NOS - Vessel";
        resetBtn.id = "return-btn";
        document.body.appendChild(resetBtn);

        resetBtn.onclick = () => location.reload(); 
    }, 30000); 
});
