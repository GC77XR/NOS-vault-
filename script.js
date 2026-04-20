console.log("BRAIN CONNECTED: Initializing Vessel Protocol...");

const SECRET_KEY_HEX = "4e4f53204d482037"; 
let scene, camera, renderer, coreTrackNode;
let gazeTimer = 0;
let isMeditationActive = false;
const raycaster = new THREE.Raycaster();
const centerVision = new THREE.Vector2(0, 0);

function initXRSpace() {
    console.log("Initializing 3D Space...");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geo = new THREE.OctahedronGeometry(0.3);
    const mat = new THREE.MeshBasicMaterial({ color: 0xbc00ff, wireframe: true });
    coreTrackNode = new THREE.Mesh(geo, mat);
    coreTrackNode.position.set(0, 1.6, -3);
    scene.add(coreTrackNode);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (coreTrackNode) {
        coreTrackNode.rotation.y += 0.01;
        raycaster.setFromCamera(centerVision, camera);
        const focus = raycaster.intersectObject(coreTrackNode);

        if (focus.length > 0 && !isMeditationActive) {
            gazeTimer += 16;
            coreTrackNode.scale.setScalar(1 + (gazeTimer / 3000) * 0.5);
            if (gazeTimer >= 3000) {
                isMeditationActive = true;
                console.log("> IGNITE: Protocol Active.");
            }
        } else {
            gazeTimer = 0;
            if(!isMeditationActive) coreTrackNode.scale.setScalar(1);
        }
    }
    renderer.render(scene, camera);
}

document.getElementById('calibrationTrigger').addEventListener('click', async () => {
    console.log("Button Clicked. Checking hardware...");
    document.getElementById('ui-layer').style.display = 'none';
   
    if ('NDEFReader' in window) {
        try {
            const ndef = new NDEFReader();
            await ndef.scan();
            ndef.onreading = ({ message }) => {
                const decoder = new TextDecoder();
                for (const record of message.records) {
                    const data = decoder.decode(record.data);
                    if (data.toLowerCase().includes(SECRET_KEY_HEX)) {
                        initXRSpace();
                    }
                }
            };
        } catch (e) {
            console.log("NFC Error/Cancel. Bypassing...");
            initXRSpace(); 
        }
    } else {
        console.log("Desktop detected. Bypassing NFC...");
        initXRSpace(); 
    }
});
