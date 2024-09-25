import * as THREE from "three"
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

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

const btn = document.createElement("button")
btn.innerHTML = "点击全屏"
btn.style.position = "absolute"
btn.style.top = "10px"
btn.style.left = "10px"
btn.style.zIndex = "999"
btn.onclick = () => {
  // 全屏
  document.body.requestFullscreen()
}
document.body.appendChild(btn)

// 退出全屏
const exitFullScreenBtn = document.createElement("button")
exitFullScreenBtn.innerHTML = '退出全屏'
exitFullScreenBtn.style.position = "absolute"
exitFullScreenBtn.style.top = "10px"
exitFullScreenBtn.style.left = "100px"
exitFullScreenBtn.style.zIndex = "999"
exitFullScreenBtn.onclick = () => {
  // 退出全屏
  document.exitFullscreen()
}
document.body.appendChild(exitFullScreenBtn)
