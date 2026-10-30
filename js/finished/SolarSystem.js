"use strict";

import {
    AmbientLight,
    Color, HemisphereLight,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    Object3D, PointLight,
    SphereGeometry,
    TextureLoader, Vector2
} from "../build/three.module.js";

export class SolarSystem {
    constructor(scene) {
        let sunRadius = 5;
        let widthSegments = 64;
        let heightSegments = 64;

        this.textureLoader = new TextureLoader();

        this.centerOfSystem = new Object3D();

        this.centerOfSystem.position.setZ(-30); // Uncomment if VR is implemented
        
        scene.add(this.centerOfSystem);

        this.sun = this.createSphericalBody({
            radius: sunRadius, widthSegments, heightSegments,
            assetUrl: 'assets/texture_sun.jpg',
            MaterialType: MeshBasicMaterial
        });

        this.centerOfSystem.add(this.sun)
        this.mercuryOrbitNode= new Object3D();
        this.centerOfSystem.add(this.mercuryOrbitNode);
        this.mercury = this.createSphericalBody({
            radius: sunRadius * 0.2, widthSegments, heightSegments,
            shininess:3,
            assetUrl: 'assets/2k_mercury.jpg',
            MaterialType: MeshPhongMaterial
        })
        this.mercury.position.x = 10;
        this.mercuryOrbitNode.add(this.mercury);
        this.earthOrbitNode = new Object3D();

        this.centerOfSystem.add(this.earthOrbitNode);

        this.earth = this.createSphericalBody({
            radius: sunRadius * 0.5,
            widthSegments, heightSegments,
            shininess: 10,
            assetUrl: 'assets/texture_earth.jpg',
            MaterialType: MeshPhongMaterial,
            specularMapUrl: 'assets/earthspec1k.jpg',
            normalMapUrl: 'assets/2k_earth_normal_map.png'
        });

        this.earth.position.x = 15;

        this.earthOrbitNode.add(this.earth);

        this.moonOrbitNode = new Object3D();
        this.earthOrbitNode.add(this.moonOrbitNode);
        this.moonOrbitNode.position.x=15;
        this.moon = this.createSphericalBody({
            radius: sunRadius * 0.1, widthSegments, heightSegments,
            shininess: 3,
            assetUrl: 'assets/2k_moon.jpg',
            MaterialType: MeshPhongMaterial
        });
        this.moon.position.x = 5;
        this.moonOrbitNode.add(this.moon);



        this.marsOrbitNode = new Object3D();
        this.centerOfSystem.add(this.marsOrbitNode);
        this.mars = this.createSphericalBody({
            radius: sunRadius * 0.4, widthSegments, heightSegments,
            shininess:3,
            assetUrl: 'assets/2k_mars.jpg',
            MaterialType: MeshPhongMaterial
        });
        this.mars.position.x = 21;
        this.marsOrbitNode.add(this.mars);

        this.jupiterOrbitNode = new Object3D();
        this.centerOfSystem.add(this.jupiterOrbitNode);
        this.jupiter = this.createSphericalBody({
            radius: sunRadius * 0.7, widthSegments, heightSegments,
            shininess:3,
            assetUrl: 'assets/2k_jupiter.jpg',
            MaterialType: MeshPhongMaterial
        });
        this.jupiter.position.x=30;
        this.jupiterOrbitNode.add(this.jupiter);



        this.sunLight = new PointLight(0xFFFFFF, 2);
        this.sun.add(this.sunLight);

        this.hemisphereLight = new HemisphereLight(0xffffff, 0x222244, 0.6);
        scene.add(this.hemisphereLight);

    }


    animate() {
        this.rotateObject(this.sun, [0, 0.005, 0]);

        this.rotateObject(this.mercuryOrbitNode, [0, 0.01, 0]);
        this.rotateObject(this.mercury, [0, 0.005, 0]);

        this.rotateObject(this.earthOrbitNode, [0, 0.01, 0]);
        this.rotateObject(this.earth, [0, 0.005, 0]);

        this.rotateObject(this.moonOrbitNode, [0, 0.01, 0]);
        this.rotateObject(this.moon, [0, 0.01, 0]);

        this.rotateObject(this.marsOrbitNode, [0, 0.01, 0]);
        this.rotateObject(this.mars, [0, 0.01, 0]);

        this.rotateObject(this.jupiterOrbitNode, [0, 0.01, 0]);
        this.rotateObject(this.jupiter, [0, 0.01, 0]);
    }


    rotateObject(object, rotation) {
        object.rotation.x += rotation[0];
        object.rotation.y += rotation[1];
        object.rotation.z += rotation[2];
    }

    /**
     *  Creates a sphere mesh given the given parameters
     *
     * @param radius : number
     * @param widthSegments : number
     * @param heightSegments : number
     * @param assetUrl : URL
     * @param color : Color
     * @param MaterialType : Material
     * @param shininess : number
     * @param normalMapUrl : URL
     * @param specularMapUrl : URL
     */
    createSphericalBody({
        radius = 5, widthSegments = 64, heightSegments = 64,
        assetUrl = undefined,
        color = new Color(0xFFFFFF),
        MaterialType = MeshBasicMaterial,
        shininess = 0,
        normalMapUrl = undefined,
        specularMapUrl = undefined
    }) {
        let geometry = new SphereGeometry(radius, widthSegments, heightSegments);

        let texture = assetUrl ? this.textureLoader.load(assetUrl) : null;
        let nMap = normalMapUrl ? this.textureLoader.load(normalMapUrl) : null;
        let specMap = specularMapUrl ? this.textureLoader.load(specularMapUrl) : null;

        let mat = new MaterialType(
            {
                map: texture,
                color: color,
                shininess: shininess,
                normalMap: nMap,
                specularMap: specMap,
                specular: new Color(0x777777),
                normalScale: new Vector2(10,10)
            });

        return new Mesh(geometry, mat);
    }
}