const body = document.body;
const toggleBtn = document.getElementById('experience-toggle');
const logo = document.getElementById('logo-anchor');
const seal = document.getElementById('final-seal');

toggleBtn.addEventListener('click', () => {
    // 1. Start the 30-second color shift
    body.classList.add('coda-state');
    
    // 2. Lock the user in by hiding the button
    toggleBtn.style.display = 'none';

    // 3. The 30,000ms (30 second) Timer
    setTimeout(() => {
        // Start the 10s logo fade to ghostly trace
        logo.style.opacity = "0.05";

        // Reveal the final messages
        seal.innerHTML = `
            <h1 class="pulse-text">NOS CALIBRATION COMPLETE</h1>
            <p class="command-text">DJ GC77XR: Reset-Ignite-Integrate</p>
        `;
        seal.classList.remove('hidden');

        // Create the Return button
        const resetBtn = document.createElement('button');
        resetBtn.innerText = "Return to NOS - Vessel";
        resetBtn.id = "return-btn";
        document.body.appendChild(resetBtn);

        resetBtn.onclick = () => location.reload(); 
    }, 30000); 
});
