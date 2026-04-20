console.log("BRAIN CONNECTED: Visibility Protocol Alpha");

const SECRET_KEY_HEX = "4e4f53204d482037"; 
let scene, camera, renderer, coreTrackNode;
let gazeTimer = 0;
let isMeditationActive = false;
const raycaster = new THREE.Raycaster();
const centerVision = new THREE.Vector2(0, 0);

function initXRSpace() {
    console.log("Initializing 3D Space...");
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000033); 

    // 1. Camera Setup: Positioned back so we can see the center
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5); 
    camera.lookAt(0, 0, 0); 
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); 
    document.body.appendChild(renderer.domElement);

    // 2. Object Setup: Solid and Double-Sided for maximum visibility
    const geo = new THREE.OctahedronGeometry(1.0); // Larger size
    const mat = new THREE.MeshBasicMaterial({ 
        color: 0xbc00ff, 
        wireframe: false, 
        side: THREE.DoubleSide 
    });
    
    coreTrackNode = new THREE.Mesh(geo, mat);
    coreTrackNode.position.set(0, 0, 0); // Placed at the very center
    scene.add(coreTrackNode);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (coreTrackNode) {
        coreTrackNode.rotation.y += 0.01;
        coreTrackNode.rotation.x += 0.005;

        raycaster.setFromCamera(centerVision, camera);
        const focus = raycaster.intersectObject(coreTrackNode);

        if (focus.length > 0 && !isMeditationActive) {
            gazeTimer += 16;
            coreTrackNode.scale.setScalar(1 + (gazeTimer / 3000) * 0.5);
            if (gazeTimer >= 3000) {
                isMeditationActive = true;
                console.log("> IGNITE");
            }
        } else {
            gazeTimer = 0;
            if(!isMeditationActive) coreTrackNode.scale.setScalar(1);
        }
    }
    renderer.render(scene, camera);
}

document.getElementById('calibrationTrigger').addEventListener('click', async () => {
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
            initXRSpace(); 
        }
    } else {
        initXRSpace(); 
    }
});
