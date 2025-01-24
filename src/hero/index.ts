import { ref } from '@vue/reactivity'
import * as THREE from 'three'
import { light } from '../utils/theme.js'
import "./style.css"
import psrdnoise from "./psrdnoise.glsl?raw"

const hero: HTMLDivElement | null = document.querySelector('#hero')

const colors = {
    light1: {
        light: new THREE.Color('#00dbde'),
        dark: new THREE.Color('#ffffff')
    },
    light1Grand: {
        light: new THREE.Color('#134E5E'),
        dark: new THREE.Color('#fc00ff')
    },
    light2: {
        light: new THREE.Color('#590d82'),
        dark: new THREE.Color('#00dbde')
    },
    light3: {
        light: new THREE.Color('#590d82'),
        dark: new THREE.Color('#00dbde')
    },
    emissive: {
        light: new THREE.Color('#23f660'),
        dark: new THREE.Color('#da22ff')
    }
}

if (hero) {
    const scene = new THREE.Scene()
    // scene.background = light.value ? new THREE.Color('#cc99ff') : new THREE.Color('#A9E7DA')

    const camera = new THREE.PerspectiveCamera()
    camera.position.set(0, 0, 30)

    const light1 = new THREE.HemisphereLight(
        light.value ? colors.light1.light : colors.light1.dark,
        light.value ? colors.light1Grand.light : colors.light1Grand.dark,
        0.6)
    light1.position.set(0, 1, 0)
    scene.add(light1)

    const light2 = new THREE.DirectionalLight(light.value ? colors.light2.light : colors.light2.dark, 0.4)
    light2.position.set(10, 0, 10)
    scene.add(light2)

    const light3 = new THREE.DirectionalLight(light.value ? colors.light3.light : colors.light3.dark, 0.4)
    light3.position.set(10, 0, -10)
    scene.add(light3)

    const geometry = new THREE.SphereGeometry(10, 128, 128)
    const material = new THREE.MeshPhongMaterial({
        emissive: light.value ? colors.emissive.light : colors.emissive.dark,
        emissiveIntensity: 0.4,
        shininess: 0,
        opacity: 0.1
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    })


    // // 设置相机控件轨道控制器OrbitControls
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableZoom = false
    // controls.enablePan = false
    // controls.enableRotate = true
    // // controls.maxAzimuthAngle = controls.getAzimuthalAngle()
    // // controls.minAzimuthAngle = controls.getAzimuthalAngle()
    // controls.maxPolarAngle = controls.getPolarAngle()
    // controls.minPolarAngle = controls.getPolarAngle()


    // AxesHelper：辅助观察的坐标系
    // const axesHelper = new THREE.AxesHelper(15);
    // scene.add(axesHelper);

    renderer.setSize(512, 512)
    renderer.domElement.id = "noisy-sphere"
    hero.appendChild(renderer.domElement)

    // 数值驱动 glsl 顶点着色器
    const time = ref(0)
    // https://stegu.github.io/psrdnoise/2d-tutorial/2d-psrdnoise-tutorial-02.html
    const simplex = ref(0.12)
    // https://stegu.github.io/psrdnoise/2d-tutorial/2d-psrdnoise-tutorial-05.html
    const alpha = ref(0.0005)

    // material.positionNode = Fn(({ position }) => {
    //     const p = uv(position)
    //     const g = new THREE.Vector3()
    //     const d = psrdnoise(simplex.value, p, alpha.value * time.value, g)
    //     return position.add(g.multiplyScalar(d))
    // })({ position: positionLocal })
    material.onBeforeCompile = (shader) => {
        shader.uniforms.time = time
        shader.uniforms.simplex = simplex
        shader.uniforms.alpha = alpha
        shader.vertexShader = `
    uniform float simplex;
    uniform float alpha;
    uniform float time;
    ${psrdnoise}
    ${shader.vertexShader}`.replace('#include <begin_vertex>',
            `vec3 period = vec3(0.0);
                
    // Displace surface
    vec3 gradient;
    float d = psrdnoise(simplex * position, period, alpha * time, gradient);
    vec3 transformed = vec3(position);
    transformed += normalize(position) * d;`
        )
    }


    function animate(t: DOMHighResTimeStamp) {
        time.value = t
        light1.color = light.value ? colors.light1.light : colors.light1.dark
        light1.groundColor = light.value ? colors.light1Grand.dark : colors.light1Grand.light
        light2.color = light.value ? colors.light2.light : colors.light2.dark
        light3.color = light.value ? colors.light3.light : colors.light3.dark
        material.emissive = light.value ? colors.emissive.light : colors.emissive.dark
        renderer.render(scene, camera)
    }
    renderer.setAnimationLoop(animate)
}
