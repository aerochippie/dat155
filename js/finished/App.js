"use strict";

import {Group, PerspectiveCamera, Scene, WebGLRenderer} from "../build/three.module.js";
import {SolarSystem} from "./SolarSystem.js";
import {OrbitControls} from "../build/OrbitControls.js";
import {VRButton} from "../build/VRButton.js";

const width = window.innerWidth;
const height= window.innerHeight;
const aspect = width / height;

const fov = 75;
const near = 0.1;
const far = 500;

const camera = new PerspectiveCamera(fov, aspect, near, far);
// Flytter camera vekk fra sentrum, vil ikke ha noe effekt i VR
camera.position.setZ(30);


const canvas = document.createElement('canvas');
const context = canvas.getContext('webgl2');

const renderer = new WebGLRenderer({canvas, context});
renderer.setClearColor(0x000000); // "Bakgrunnsfarge"
renderer.setSize(width, height);

// Dette er for å ha og aktivere VR
document.body.appendChild(VRButton.createButton(renderer));
renderer.xr.enabled = true;
// end


document.body.appendChild(renderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 0;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI;

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
})

const scene = new Scene();
const rig = new Group();
rig.add(camera);
scene.add(rig);
const solarSystem = new SolarSystem(scene);

// Dette er kun hvis VR er i scenen
renderer.setAnimationLoop(render);

function render(){
    solarSystem.animate();
    const session = renderer.xr.getSession();
    if (session) {
        for (const source of session.inputSources) {
            if (!source.gamepad) continue;
            const buttonY = source.gamepad.axes[3];
            const buttonX = source.gamepad.axes[2];
            if (Math.abs(buttonY) > 0.1) {
                rig.position.z += buttonY * 0.1;
            }
            if (Math.abs(buttonX) > 0.1) {
                rig.position.x += buttonX * 0.1;
            }
        }
    }
    renderer.render(scene, camera);

    // Hvis vi ikke har VR har vi denne
    // window.requestAnimationFrame(render);
}

render();
