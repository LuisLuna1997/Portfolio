import * as THREE from 'three'
import GUI from 'lil-gui'
import { Sky } from 'three/addons/objects/Sky.js'


// ======================================
//
// Hanldes all the Lights of the Scene
// 
export default class Lights 
{
    constructor()
    {
        // Debug
        //this.gui = new GUI()
    }

    // ======================================
    //
    SetUpLights(scene)
    {
        this.SetUpAmbientLight(scene)
        this.SetUpDirectionalLight(scene)
        this.SetUpSky(scene)
        
    }

    // ======================================
    //
    SetUpAmbientLight(scene)
    {

        const ambientLight = new THREE.AmbientLight(0xf1f7f9, 6.07)
        scene.add(ambientLight)

        const ambientParams = {
            intensity: ambientLight.intensity,
            color: ambientLight.color.getHex()
          }

        // Debug
        // GUI controls
        //const folder = this.gui.addFolder('Ambient Light')

        //folder.add(ambientParams, 'intensity', 0, 10).onChange((value) => {
        //ambientLight.intensity = value
        //})

        //folder.addColor(ambientParams, 'color').onChange((value) => {
        //ambientLight.color.set(value)
        //})

        //folder.open()
    }

    // ======================================
    //
    SetUpDirectionalLight(scene)
    {
        const directionalLight = new THREE.DirectionalLight(0xfff0e5, 3.5)
        directionalLight.castShadow = true
        directionalLight.shadow.mapSize.set(1024, 1024)
        directionalLight.shadow.camera.far = 35
        directionalLight.shadow.camera.left = - 20
        directionalLight.shadow.camera.top = 13
        directionalLight.shadow.camera.right = 20
        directionalLight.shadow.camera.bottom = - 14
        directionalLight.position.set(- 15, 10, 0)
        directionalLight.shadow.mapType = THREE.PCFShadowMap
        directionalLight.shadow.normalBias = 0.0027 //fix  the weird multi shadow lines (shadow on self)
        directionalLight.shadow.bias = -0.004 //fix  the weird multi shadow lines (shadow on self)

        scene.add(directionalLight)

        // CameraHelper to visualize shadow camera frustum
        //const helper = new THREE.CameraHelper(directionalLight.shadow.camera)
        //scene.add(helper)
    }

    // ======================================
    //
    SetUpSky(scene)
    {
        const sky = new Sky();
        sky.scale.set(100,100,100)
        scene.add(sky)

        sky.material.uniforms['turbidity'].value = 8
        sky.material.uniforms['rayleigh'].value = 1.5
        sky.material.uniforms['mieCoefficient'].value = 0.005
        sky.material.uniforms['mieDirectionalG'].value = 0.98

        // Sun low and warm in the west-ish
        sky.material.uniforms['sunPosition'].value.set(-0.5, 0.2, -0.5)
    }
}