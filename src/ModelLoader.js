import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// ======================================
//
// Hanldes all the Models of the Scene
// 
export default class ModelLoader 
{
    constructor()
    {
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('/draco/')

        this.gltfLoader = new GLTFLoader()
        this.gltfLoader.setDRACOLoader(this.dracoLoader)

        this.AboutMeHouseModel = null;
        this.ProjectsHouse = null;
        this.contactMeStone = null;
    }


    SetUpModels(scene)
    {
        this.SetUpTerrain(scene)
    }

    SetUpTerrain(scene)
    {
        const texture = new THREE.TextureLoader().load('./models/Medieval_Texture')
        texture.encoding = THREE.sRGBEncoding; // For proper color

        // Terrain Model
        this.gltfLoader.load('./models/Environment.gltf',
        (gltf) =>
        {
        const model = gltf.scene;
        model.scale.set(.4,.4,.4)
    
        model.castShadow = true;
        model.receiveShadow = true;

        gltf.scene.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true
              child.receiveShadow = true
              //child.material.side = THREE.DoubleSide // helps if shadows are missing due to backface culling
            }
          })
            
        const mat = model.children[0].material;
        mat.emissive = new THREE.Color(0xffffff); // Make emissive color white
        mat.emissiveMap = texture;
        mat.needsUpdate = true;
        

        scene.add(model)
        })
    }

    SetUpAboutMeHouse(scene) {
        return new Promise((resolve, reject) => {
            const texture = new THREE.TextureLoader().load('./models/Medieval_Texture')
        texture.encoding = THREE.sRGBEncoding; // For proper color
    
            this.gltfLoader.load(
                './models/AboutMe_House.gltf',
                (gltf) => {
                    this.AboutMeHouseModel = gltf.scene
                    this.AboutMeHouseModel.scale.set(13, 13, 13)
                    this.AboutMeHouseModel.position.set(1, 1.2, 9)
    
                    this.AboutMeHouseModel.castShadow = true
                    this.AboutMeHouseModel.receiveShadow = true
    
                    gltf.scene.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true
                            child.receiveShadow = true
    
                            // Apply emissive texture if material exists
                            if (child.material) {
                                child.material.emissive = new THREE.Color(0xffffff)
                                child.material.emissiveMap = texture
                                child.material.needsUpdate = true
                            }
                        }
                    })
    
                    scene.add(this.AboutMeHouseModel)
    
                    resolve(this.AboutMeHouseModel) // ✅ Return the model
                },
                undefined,
                (error) => {
                    reject(`Model load failed: ${error}`)
                }
            )
        })
    }

    SetUpProjectsHouse(scene) {
        return new Promise((resolve, reject) => {
        const texture = new THREE.TextureLoader().load('./models/Medieval_Texture')
        texture.encoding = THREE.sRGBEncoding; // For proper color
    
            this.gltfLoader.load(
                './models/ProjectsHouse.gltf',
                (gltf) => 
                {
                    this.ProjectsHouse = gltf.scene
                    this.ProjectsHouse.scale.set(.30, .30, .30)
                    this.ProjectsHouse.position.set(3.8, 0, -3.7)
    
                    this.ProjectsHouse.castShadow = true
                    this.ProjectsHouse.receiveShadow = true
    
                    gltf.scene.traverse((child) => 
                    {
                        if (child.isMesh) 
                        {
                            child.castShadow = true
                            child.receiveShadow = true
    
                            // Apply emissive texture if material exists
                            if (child.material) 
                            {
                                child.material.emissive = new THREE.Color(0xffffff)
                                child.material.emissiveMap = texture
                                child.material.needsUpdate = true
                            }
                        }
                    })
    
                    scene.add(this.ProjectsHouse)
    
                    resolve(this.ProjectsHouse) // ✅ Return the model
                },
                undefined,
                (error) => {
                    reject(`Model load failed: ${error}`)
                }
            )
        })
    }

    SetUpContactMeStone(scene) {
        return new Promise((resolve, reject) => {
        const texture = new THREE.TextureLoader().load('./models/Medieval_Texture')
        texture.encoding = THREE.sRGBEncoding; // For proper color
    
            this.gltfLoader.load(
                './models/ContactMeStone.gltf',
                (gltf) => 
                {
                    this.contactMeStone = gltf.scene
                    this.contactMeStone.scale.set(40, 40, 40)
                    this.contactMeStone.position.set(-9, 2.65, -10)
    
                    this.contactMeStone.castShadow = true
                    this.contactMeStone.receiveShadow = true
    
                    gltf.scene.traverse((child) => 
                    {
                        if (child.isMesh) 
                        {
                            child.castShadow = true
                            child.receiveShadow = true
    
                            // Apply emissive texture if material exists
                            if (child.material) 
                            {
                                child.material.emissive = new THREE.Color(0xffffff)
                                child.material.emissiveMap = texture
                                child.material.needsUpdate = true
                            }
                        }
                    })
    
                    scene.add(this.contactMeStone)
    
                    resolve(this.contactMeStone) // ✅ Return the model
                },
                undefined,
                (error) => {
                    reject(`Model load failed: ${error}`)
                }
            )
        })
    }
}