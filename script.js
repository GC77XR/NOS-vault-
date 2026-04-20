const SECRET_KEY_HEX = "4e4f53204d482037"; 
let scene, camera, renderer, coreTrackNode;
let gazeTimer = 0;
let isMeditationActive = false;
const raycaster = new THREE.Raycaster();
const centerVision = new THREE.Vector2(0, 0);

function updateLog(msg) {
    console.log(msg);
    const log = document.getElementById('debug-log');
    if(log) log.innerText = "Status: " + msg;
}

function initXRSpace() {
    updateLog("Initializing 3D...");
    try {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000033); 

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 5);
        
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const geo = new THREE.OctahedronGeometry(1);
        const mat = new THREE.MeshBasicMaterial({ color: 0xbc00ff, side: THREE.DoubleSide });
        coreTrackNode = new THREE.Mesh(geo, mat);
        scene.add(coreTrackNode);

        updateLog("3D Render Active");
        animate();
    } catch (err) {
        updateLog("3D Error: " + err.message);
    }
}

function animate() {
    requestAnimationFrame(animate);
    if (coreTrackNode) {
        coreTrackNode.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
}

document.getElementById('calibrationTrigger').addEventListener('click', async () => {
    updateLog("Button Clicked");
    document.getElementById('ui-layer').style.display = 'none';
   
    if ('NDEFReader' in window) {
        updateLog("NFC Detected. Scan Tag...");
        try {
            const ndef = new NDEFReader();
            await ndef.scan();
            ndef.onreading = ({ message }) => {
                updateLog("Tag Found. Checking Key...");
                initXRSpace();
            };
        } catch (e) {
            updateLog("NFC Fail. Bypassing...");
            initXRSpace(); 
        }
    } else {
        updateLog("No NFC. Bypassing...");
        initXRSpace(); 
    }
});
