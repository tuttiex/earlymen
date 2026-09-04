import * as THREE from 'three';
import {Howl} from 'howler';
import { CONFIG } from "../../../config.js";

export default class Player {
    constructor(props) {
        this.loader = props.loader;
        this.time = props.time;
        this.shadows = props.shadows;
        this.manager = props.manager;

        this.container = new THREE.Object3D();
        this.container.name = 'player';

        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.gravity = new THREE.Vector3(0, -20, 0);

        this.clock = new THREE.Clock();
        this.mixer = null;
        this.canRun = true;

        // For collision
        this.collider = new THREE.Box3();

        // Lane system
        this.currentLaneIndex = 1; // Start in middle lane (0 = left, 1 = center, 2 = right)
        this.targetZ = CONFIG.LANE_POSITIONS[this.currentLaneIndex];
        this.position.z = this.targetZ;

        this.sfxJump = new Howl({
            src: ['sfx/jump_02.wav'],
            html5: true
        });

        this.init();

        this.manager.on('fail', () => {
            //alert('Oops! You hit that!');
            this.canRun = false;
        });
    }

    init() {
        this.jumped = false;
        this.inAir = false;

        this.load();
        this.setControls();

        this.time.on('tick', data => {
            this.update(data);
        })
    }

    setControls() {
        document.addEventListener('keyup', e => {
            switch (e.code) {
                case 'Space': {
                    this.jumped = false;
                    break;
                }
            }
        });

        document.addEventListener('keydown', e => {
            switch (e.code) {
                case 'Space': {
                    this.jumped = true;
                    break;
                }
                case 'ArrowLeft': {
                    this.switchLane(-1);
                    break;
                }
                case 'ArrowRight': {
                    this.switchLane(1);
                    break;
                }
            }
        });
    }

    switchLane(direction) {
        const newLane = this.currentLaneIndex + direction;
        if (newLane >= 0 && newLane < CONFIG.LANE_POSITIONS.length) {
            this.currentLaneIndex = newLane;
            this.targetZ = CONFIG.LANE_POSITIONS[this.currentLaneIndex];
        }
    }

    load() {
        const mat = new THREE.MeshStandardMaterial({color: 'green'});

        this.loader.load('runner/player/scene.glb', gltf => {
            const mesh = gltf.scene;
            mesh.position.x = 0;
            mesh.position.y = 0;
            mesh.position.z = 0;

            this.shadows.add(mesh, {sizeX: 0.6, sizeY: 0.6, offsetZ: 0})

            this.mesh = mesh;

            const body = mesh.children.find(item => item.name === 'mesh');
            const legLeft = mesh.children.find(item => item.name === 'leg_left');
            const legRight = mesh.children.find(item => item.name === 'leg_right');
            body.material = mat;
            legLeft.material = mat;
            legRight.material = mat;

            this.container.add(mesh);

            this.mixer = new THREE.AnimationMixer(mesh);
            this.actionLeftLeg = this.mixer.clipAction(gltf.animations[1]);
            this.actionLeftLeg.clampWhenFinished = false;
            this.actionLeftLeg.setLoop(THREE.LoopPingPong);
            this.actionLeftLeg.play();

            this.actionRightLeg = this.mixer.clipAction(gltf.animations[2]);
            this.actionRightLeg.clampWhenFinished = false;
            this.actionRightLeg.setLoop(THREE.LoopPingPong);
            this.actionRightLeg.play();

            this.actionBody = this.mixer.clipAction(gltf.animations[0]);
            this.actionBody.clampWhenFinished = false;
            this.actionBody.setLoop(THREE.LoopPingPong);
            this.actionBody.play();
        });

        const clock = new THREE.Clock();

        this.time.on('tick', time => {
            const delta = clock.getDelta();

            if (this.mixer && !this.inAir && !!this.canRun) {
                this.mixer.update(delta);
            }
        });
    }

    update() {
        if (!this.canRun) return;

        const delta = this.clock.getDelta();

        // Jump physics
        if (this.jumped && this.position.y === 0) {
            this.velocity.y = 8;
            this.sfxJump.play();
        } else if (this.position.y > 0) {
            this.inAir = true;
        } else if (this.position.y === 0) {
            this.inAir = false;
        }

        this.position.y = this.position.y + this.velocity.y * delta;
        this.velocity.y = this.velocity.y + this.gravity.y * delta;
        this.position.y = Math.max(this.position.y, 0.0);

        // Lane switching (smooth interpolation)
        const laneDelta = this.targetZ - this.position.z;
        if (Math.abs(laneDelta) > 0.01) {
            this.position.z += laneDelta * 10 * delta;
        } else {
            this.position.z = this.targetZ;
        }

        if (this.mesh) {
            this.mesh.position.copy(this.position);
            this.checkCollisions(this.mesh);
        }
    }

    checkCollisions(mesh) {
        // Set collider bounds relative to mesh position
        this.collider.min.x = mesh.position.x - CONFIG.PLAYER_COLLIDER.WIDTH_X;
        this.collider.max.x = mesh.position.x + CONFIG.PLAYER_COLLIDER.WIDTH_X;
        this.collider.min.y = mesh.position.y;
        this.collider.max.y = mesh.position.y + 0.15;
        this.collider.min.z = mesh.position.z - CONFIG.PLAYER_COLLIDER.WIDTH_Z;
        this.collider.max.z = mesh.position.z + CONFIG.PLAYER_COLLIDER.WIDTH_Z;
    }
}
