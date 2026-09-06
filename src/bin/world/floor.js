import * as THREE from 'three';

export default class Floor {
    constructor(options) {
        this.container = new THREE.Object3D();
        this.container.name = 'floor';

        this.createFloor();
    }

    createFloor() {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('images/forest_ground.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 3);

        this.geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        this.material = new THREE.MeshPhongMaterial({ map: texture, color: 0xffffff });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.set(0, -0.1, 0);
        this.mesh.rotation.set(0, 0, 0);
        this.mesh.scale.set(20, -.1, 6);

        this.mesh.receiveShadow = true;

        this.container.add(this.mesh);
    }
}
