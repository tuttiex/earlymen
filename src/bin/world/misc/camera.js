import * as THREE from 'three';
import {PerspectiveCamera} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { CONFIG } from "../../../config.js";

export default class Camera {
    constructor(options) {
        this.renderer = options.renderer;
        this.resizer = options.resizer;
        this.player = options.player; // Player reference for following

        this.container = new THREE.Object3D();
        this.container.name = 'camera';

        // Camera offset from player (behind, above, slightly angled down)
        this.offset = new THREE.Vector3(-4, 3, 0); // Behind on X (-), above on Y

        this.setInstance();
        this.setFollowPlayer();
        //this.setOrbitControls();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            60, // fov - wider for better visibility
            window.innerWidth / window.innerHeight,
            0.1,
            100,
        );

        this.container.add(this.instance);

        this.resizer.on('resize', () => {
            this.instance.aspect = window.innerWidth / window.innerHeight;
            this.instance.updateProjectionMatrix();
        })
    }

    setFollowPlayer() {
        if (!this.player || !this.player.time) return;

        // Update camera position each frame to follow player
        this.player.time.on('tick', () => {
            // Use player's position (synced with mesh each frame)
            const playerPos = this.player.position;

            // Position camera behind and above player, following Z (lane position)
            this.instance.position.set(
                playerPos.x + this.offset.x,  // Behind player (negative X offset)
                playerPos.y + this.offset.y,  // Above player
                playerPos.z + this.offset.z   // Match player's lane (Z position)
            );

            // Look ahead in the direction obstacles spawn (positive X)
            const lookTarget = new THREE.Vector3(
                CONFIG.SPAWN_X, // Look toward where obstacles spawn
                playerPos.y + 0.5,  // Slightly above player's Y
                playerPos.z         // Match player's lane
            );

            this.instance.lookAt(lookTarget);
        });
    }

    setOrbitControls() {
        this.orbitControls = new OrbitControls(this.instance, this.renderer.domElement);
        this.orbitControls.enabled = true;
        this.orbitControls.enableKeys = false;
        this.orbitControls.zoomSpeed = 0.5;
    }
}
