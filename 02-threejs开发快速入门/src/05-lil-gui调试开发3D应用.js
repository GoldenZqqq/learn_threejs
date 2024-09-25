import * as THREE from "three"
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  45, // 视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近平面
  1000 // 远平面
)

// 创建渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const parentMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// 设置父元素材质为线框模式
parentMaterial.wireframe = true
// 创建网格
const cube = new THREE.Mesh(geometry, material)
const parentCube = new THREE.Mesh(geometry, parentMaterial)
parentCube.add(cube)
parentCube.position.set(-3, 0, 0)
// parentCube.scale.set(2,2,2)  // 父元素的放大也会影响子元素
parentCube.rotation.x = Math.PI / 4 // 父元素的旋转也会影响子元素

// 设置立方体的放大
cube.position.set(3, 0, 0)
// cube.scale.set(2,2,2)
// 绕着x轴旋转
cube.rotation.x = Math.PI / 4

// 将网格添加到场景中
scene.add(parentCube)

// 设置相机位置
camera.position.z = 5
camera.position.y = 2
camera.position.x = 2
camera.lookAt(0, 0, 0)

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true
// 设置阻尼系数
controls.dampingFactor = 0.05
// 设置自动旋转
// controls.autoRotate = true

// 渲染函数
function animate() {
  controls.update()
  requestAnimationFrame(animate)
  // 旋转
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
  // 渲染
  renderer.render(scene, camera)
}
animate()

// 监听窗口变化
window.addEventListener("resize", () => {
  // 重置渲染宽高比
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新相机投影矩阵
  camera.updateProjectionMatrix()
})

let eventObj = {
  FullScreen: function () {
    document.body.requestFullscreen()
  },
  ExitFullScreen: function () {
    document.ExitFullScreen()
  }
}

// 创建 GUI
const gui = new GUI()
// 添加按钮
gui.add(eventObj, "FullScreen").name("全屏")
gui.add(eventObj, "ExitFullScreen").name("退出全屏")
// 控制立方体位置
// gui.add(cube.position, "x", -5, 5).name("立方体x轴位置")
let folder = gui.addFolder("立方体位置")
folder
  .add(cube.position, "x")
  .min(-10)
  .max(10)
  .step(1)
  .name("立方体x轴位置")
  .onChange(val => {
    console.log("立方体x轴位置", val)
  })
folder
  .add(cube.position, "y")
  .min(-10)
  .max(10)
  .step(1)
  .name("立方体y轴位置")
  .onFinishChange(val => {
    console.log("拖动完成后立方体y轴位置", val)
  })
folder.add(cube.position, "z").min(-10).max(10).step(1).name("立方体z轴位置")

gui.add(parentMaterial, "wireframe").name("父元素线框模式")

let colorParams = {
  cubeColor: "#ff0000"
}

gui
  .addColor(colorParams, "cubeColor")
  .name("立方体颜色")
  .onChange(val => {
    cube.material.color.set(val)
  })
