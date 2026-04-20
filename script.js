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

    // BACKGROUND ANCHOR
    const anchorGeo = new THREE.OctahedronGeometry(6, 0);
    const anchorMat = new THREE.MeshBasicMaterial({ color: 0x1a0033, wireframe: true, transparent: true, opacity: 0.2 });
    anchorNode = new THREE.Mesh(anchorGeo, anchorMat);
    scene.add(anchorNode);

    // CORE NODE
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
        anchorNode.rotation.y -= 0.002;

        raycaster.setFromCamera(centerVision, camera);
        const focus = raycaster.intersectObject(coreTrackNode);

        if (focus.length > 0 && !isMeditationActive) {
            gazeTimer += 16;
            coreTrackNode.scale.setScalar(1 + (gazeTimer / 3000));
            
            if (gazeTimer >= 3000) {
                isMeditationActive = true;
                audio.play().catch(e => updateLog("Playback Error")); 
                updateLog("MEDITATION ACTIVE");
            }
        }
    }
    renderer.render(scene, camera);
}

document.getElementById('calibrationTrigger').addEventListener('click', () => {
    // ESSENTIAL: "Wake up" audio for S26/iPhone
    audio.play().then(() => {
        audio.pause(); 
        audio.currentTime = 0;
    }).catch(e => updateLog("Audio Blocked"));

    document.getElementById('ui-layer').style.display = 'none';
    initXRSpace();
});
