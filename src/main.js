import * as THREE from 'three'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import ModelLoader from './ModelLoader.js'
import Lights from './Lights.js'
import Water from './Water.js'



import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { Vector2Uniform } from 'three/src/renderers/common/Uniform.js'

if (window.self !== window.top) {
    console.log("Iframe detected — skipping full Three.js scene.");
  } 
else 
{
   
  

// ======================
// Base
// ======================

// Canvas
const gui = new GUI({ width: 340 }) 
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const modelLoader = new ModelLoader()
modelLoader.SetUpModels(scene)

let aboutmeHouseModel = null
let projectsHouse = null
let contactMeStone = null

async function init() {
    try {
        aboutmeHouseModel = await modelLoader.SetUpAboutMeHouse(scene);
        console.log('House model ready!', aboutmeHouseModel);
    } catch (err) {
        console.error(err);
    }

    try {
        projectsHouse = await modelLoader.SetUpProjectsHouse(scene);
        console.log('Projects House model ready!', projectsHouse);
    } catch (err) {
        console.error(err);
    }

    try {
        contactMeStone = await modelLoader.SetUpContactMeStone(scene);
        console.log('Projects House model ready!', contactMeStone);
    } catch (err) {
        console.error(err);
    }
}
init();

// Lights
const lights = new Lights()
lights.SetUpLights(scene)

// Water
const waterClass = new Water()
waterClass.SetUpWaters(scene)
waterClass.SetUpDebug(gui)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// ======================
// Event Listeners
// ======================

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// ======================
// Camera
// ======================
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 55)
camera.position.set(10, 2, -4)
scene.add(camera)

// ======================
// Controls
// ======================
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

// ======================
// Renderer
// ======================
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// ======================
// Ray Caster
// ======================

const mouse = new THREE.Vector2()
const raycaster = new THREE.Raycaster()

// Helper Arrow from camera through the ray
const rayDirection = new THREE.Vector3()
const rayOrigin = new THREE.Vector3()


// ======================
// Composer
// ======================

const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)

// corrects the dark light of outline composer
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
composer.addPass(gammaCorrectionPass)

const outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
)
outlinePass.edgeStrength = 12
outlinePass.edgeGlow = 0
outlinePass.edgeThickness = 6
outlinePass.visibleEdgeColor.set('#ffff00')
outlinePass.hiddenEdgeColor.set('#190a05')
composer.addPass(outlinePass)

window.addEventListener('mousemove', (event)=>
    {
        const rect = canvas.getBoundingClientRect()
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    })


window.addEventListener('click', () =>
{
    if(intersectsAboutMeHouseModel.length > 0)
    {
        console.log('Open About Me Page')
        OpenPortfolioPanel('About');
    }
    else if (intersectsProjectsHouseModel.length > 0) 
    {
        console.log('Open Projects Page')
    } 
    else if (intersectsContactMeStoneModel.length > 0) 
    {
        OpenPortfolioPanel('Connect');
        console.log('Get In Contact Page')
    } 
    else
    {
        ClosePortfolioPanel('About')
        ClosePortfolioPanel('Connect')
    }
})

// ======================
// UI
// ======================
function OpenPortfolioPanel(name) {
    const page = document.getElementById(name)
    page.classList.remove('hidden')
  }

  function ClosePortfolioPanel(name) {
    const page = document.getElementById(name)
    page.classList.add('hidden')
  }

// ======================
// Clock Loop
// ======================
const clock = new THREE.Clock()
let previousTime = 0

let intersectsAboutMeHouseModel = null
let intersectsProjectsHouseModel = null
let intersectsContactMeStoneModel = null

const waterMaterial = waterClass.GetWaterMaterial()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Ray
    raycaster.setFromCamera(mouse, camera)

    // Get the ray's origin and direction
    rayOrigin.copy(raycaster.ray.origin)
    rayDirection.copy(raycaster.ray.direction)

    // update water
    waterMaterial.uniforms.uTime.value = elapsedTime

    if (aboutmeHouseModel && projectsHouse && contactMeStone) 
    {
        intersectsAboutMeHouseModel = raycaster.intersectObject(aboutmeHouseModel, true)
        intersectsProjectsHouseModel = raycaster.intersectObject(projectsHouse, true)
        intersectsContactMeStoneModel = raycaster.intersectObject(contactMeStone, true)

        if (intersectsAboutMeHouseModel.length > 0) 
        {
            outlinePass.selectedObjects = [intersectsAboutMeHouseModel[0].object]
        } 
        else if (intersectsProjectsHouseModel.length > 0) 
        {
            outlinePass.selectedObjects = [intersectsProjectsHouseModel[0].object]
        } 
        else if (intersectsContactMeStoneModel.length > 0) 
        {
            outlinePass.selectedObjects = [intersectsContactMeStoneModel[0].object]
        } 
        else 
        {
            outlinePass.selectedObjects = []
        }
    }

    // Update controls
    controls.update()
    
    // Render
    renderer.render(scene, camera)
    composer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
  
  }