const SECRET_KEY_HEX = "4e4f53204d482037"; 
let scene, camera, renderer, coreTrackNode, anchorNode;
let gazeTimer = 0;
let isMeditationActive = false;
const raycaster = new THREE.Raycaster();
const centerVision = new THREE.Vector2(0, 0);
const audio = document.getElementById('meditationTrack');

function updateLog(msg) {
    document.getElementById('debug-log').innerText = "Status: " + msg;
}

function initXRSpace() {
    updateLog("Anchoring...");
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // THE ANCHOR (Large, slow background octahedron)
    const anchorGeo = new THREE.OctahedronGeometry(5, 0);
    const anchorMat = new THREE.MeshBasicMaterial({ color: 0x1a0033, wireframe: true, transparent: true, opacity: 0.2 });
    anchorNode = new THREE.Mesh(anchorGeo, anchorMat);
    scene.add(anchorNode);

    // THE CORE (Your focus node)
    const coreGeo = new THREE.OctahedronGeometry(1);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xbc00ff, wireframe: true });
    coreTrackNode = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreTrackNode);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (coreTrackNode) {
        coreTrackNode.rotation.y += 0.01;
        anchorNode.rotation.y -= 0.002; // Slow counter-rotation

        raycaster.setFromCamera(centerVision, camera);
        const focus = raycaster.intersectObject(coreTrackNode);

        if (focus.length > 0 && !isMeditationActive) {
            gazeTimer += 16;
            let scale = 1 + (gazeTimer / 3000);
            coreTrackNode.scale.setScalar(scale);
            
            if (gazeTimer >= 3000) {
                isMeditationActive = true;
                audio.play(); // Start the Meditation
                updateLog("PROTOCOL IGNITED");
            }
        }
    }
    renderer.render(scene, camera);
}

document.getElementById('calibrationTrigger').addEventListener('click', () => {
    updateLog("System Initialized");
    document.getElementById('ui-layer').style.display = 'none';
    initXRSpace();
});
