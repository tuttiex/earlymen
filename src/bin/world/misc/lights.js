import * as THREE from 'three';

export default class Lights {
    constructor(options) {
        this.container = new THREE.Object3D();
        this.container.name = 'lights';

        this.createLights();
    }

    createLights() {
        this.container.add(new THREE.HemisphereLight('#dcead9', '#4a5c3a', 1));
    }
}
