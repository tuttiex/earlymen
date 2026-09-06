import * as THREE from 'three';
import CONFIG from '../../config.js';

export default class Floor {
    constructor(options) {
        this.container = new THREE.Object3D();
        this.container.name = 'floor';
        this.time = options.time;

        this.createFloor();

        this.time.on('tick', () => {
            this.texture.offset.x += 0.035;
        });
    }

    createFloor() {
        const textureLoader = new THREE.TextureLoader();
        this.texture = textureLoader.load('images/forest_ground.png');
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set(10, 3);

        this.geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        this.material = new THREE.MeshPhongMaterial({ map: this.texture, color: 0xffffff });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.set(0, -0.1, 0);
        this.mesh.rotation.set(0, 0, 0);
        this.mesh.scale.set(20, -.1, 6);

        this.mesh.receiveShadow = true;

        this.container.add(this.mesh);
    }
}
