import * as THREE from "three";
import { CONFIG } from "../../../../config.js";

export default class Obstacle {
    constructor(props) {
        this.loader = props.loader;
        this.shadows = props.shadows;
        this.time = props.time;
        this.manager = props.manager;
        this.lane = props.lane || 0;

        this.container = new THREE.Object3D();
        this.container.name = "obstacle";

        // For collision
        this.collider = new THREE.Box3();
        this.canFlow = true;

        this.init();

        this.container.position.x = CONFIG.SPAWN_X;
        this.container.position.z = CONFIG.LANE_POSITIONS[this.lane];

        this.time.on('tick', time => {
            if (this.container.position.x < CONFIG.DESPAWN_X) {
                this.container.remove(this.container.children[0]);
            } else {
                if (this.canFlow) {
                    this.container.position.x -= CONFIG.OBSTACLE_SPEED;
                }

                this.collider.setFromObject(this.container);
            }
        });

        this.manager.on('fail', () => {
            this.canFlow = false;
        })
    }

    init() {
        this.load();
    }

    load() {
        const mat = new THREE.MeshStandardMaterial({color: 'green'})

        this.loader.load('runner/obstacle_01/scene.glb', gltf => {
            const mesh = gltf.scene;
            mesh.position.x = 0;
            mesh.position.y = 0;
            mesh.position.z = 0;
            mesh.children[0].material = mat;

            this.container.add(mesh);
        });
    }
}
