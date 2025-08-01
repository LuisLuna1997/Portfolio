import * as THREE from 'three'
import GUI from 'lil-gui'

import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'


// ======================================
//
// Hanldes all the Water of the Scene
// 
export default class Water 
{
    constructor()
    {
         // Color
         this.debugObject = {}
         this.debugObject.depthColor = '#6dedf8'
         this.debugObject.surfaceColor = '#71a9cc'

         this.waterMaterial = this.CreateWaterMaterial()
         this.waterMesh = null
         this.waterPosition = null
         this.waterRotation = null
    }

    // ======================================
    //
    SetUpWaters(scene)
    {
        this.SetUpWaterFountain(scene)
    }

    SetUpWaterFountain(scene)
    {
        // Geometry
        const waterGeometry = new THREE.PlaneGeometry(14.5, .9, 512, 512)

        // Water
        this.waterPosition = new THREE.Vector3(10.75,.25,2.65)
        this.waterRotation = new THREE.Vector3(0,0,0)

        // Mesh
        this.waterMesh = new THREE.Mesh(waterGeometry, this.waterMaterial)

        this.waterMesh.position.set(this.waterPosition.x, this.waterPosition.y, this.waterPosition.z)
        this.waterMesh.rotation.x = - Math.PI * 0.5
        this.waterMesh.rotation.z = -6.45

        scene.add(this.waterMesh)  
    }

    SetUpDebug(argGui)
    {
        // Debug
        argGui.add(this.waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
        argGui.add(this.waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
        argGui.add(this.waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
        argGui.add(this.waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(5).step(0.001).name('uBigWavesSpeed')


        argGui.add(this.waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
        argGui.add(this.waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
        argGui.add(this.waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(5).step(0.001).name('uSmallWavesSpeed')
        argGui.add(this.waterMaterial.uniforms.uSmallWavesIteration, 'value').min(0).max(4).step(1).name('uSmallWavesIteration')


        argGui.addColor(this.debugObject, 'depthColor').name('depthColor').onChange(()=>
            {
                this.waterMaterial.uniforms.uDepthColor.value.set(this.debugObject.depthColor)
            })
        argGui.addColor(this.debugObject, 'surfaceColor').name('surfaceColor').onChange(()=>
            {
                this.waterMaterial.uniforms.uSurfaceColor.value.set(this.debugObject.surfaceColor)
            })

        argGui.add(this.waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
        argGui.add(this.waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')

    
        argGui.add(this.waterPosition, 'x').min(-100).max(100).step(0.01).setValue(this.waterMesh.position.x).name('waterXPosition').onChange(()=>
        {
            this.waterMesh.position.set(this.waterPosition.x, this.waterPosition.y, this.waterPosition.z)
        })
        argGui.add(this.waterPosition, 'y').min(-100).max(100).step(0.01).setValue(this.waterMesh.position.y).name('waterYPosition').onChange(()=>
        {
            this.waterMesh.position.set(this.waterPosition.x, this.waterPosition.y, this.waterPosition.z)
        })
        argGui.add(this.waterPosition, 'z').min(-100).max(100).step(0.01).setValue(this.waterMesh.position.z).name('waterZPosition').onChange(()=>
        {
            this.waterMesh.position.set(this.waterPosition.x, this.waterPosition.y, this.waterPosition.z)
        })
        argGui.add(this.waterRotation, 'z').min(-100).max(100).step(0.001).setValue(this.waterMesh.rotation.z).name('waterRotationZ').onChange(()=>
        {
            this.waterMesh.rotation.z = this.waterRotation.z
        })
    }

    CreateWaterMaterial()
    {
        const waterMaterial = new THREE.ShaderMaterial(
        {
            vertexShader: waterVertexShader,
            fragmentShader: waterFragmentShader,
            uniforms: 
            {
                uTime: {value:0},
        
                uBigWavesElevation: {value: 0.065},
                uBigWavesFrequency: {value: new THREE.Vector2(4, 1.5)},
                uBigWavesSpeed: {value:0.3},
        
                uSmallWavesElevation: {value: 0.15},
                uSmallWavesFrequency: {value: 3},
                uSmallWavesSpeed: {value: 0.2},
                uSmallWavesIteration: {value: 4},
        
                uDepthColor : {value: new THREE.Color(this.debugObject.depthColor)},
                uSurfaceColor : {value: new THREE.Color(this.debugObject.surfaceColor)},
                uColorOffset : {value: 0.08},
                uColorMultiplier : {value: 5}
            }
        })

        return waterMaterial
    }

    GetWaterMaterial()
    {
        return this.waterMaterial
    }
}