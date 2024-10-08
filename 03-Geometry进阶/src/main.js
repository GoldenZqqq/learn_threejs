// 导入threejs
import * as THREE from "three"
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
// 导入hdr加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
// 导入顶点法向量辅助器
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper.js"

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

const uvTexture = new THREE.TextureLoader().load("/texture/uv_grid_opengl.jpg")

const planeGeometry = new THREE.PlaneGeometry(2, 2)
const planeMaterial = new THREE.MeshBasicMaterial({
  map: uvTexture
})
// 创建平面
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)
planeMesh.position.x = -3

// 创建几何体
const geometry = new THREE.BufferGeometry()
// 使用索引绘制
const vertices = new Float32Array([
  -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0
])
// 创建顶点属性
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
// 创建索引
const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
geometry.setIndex(new THREE.BufferAttribute(indices, 1))

// 设置uv
const uv = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])
// 创建uv属性
geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2))

// 设置法向量
const normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1])
// 创建法向量属性
geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3))

// 计算出法向向量
// geometry.computeVertexNormals()

// 创建材质
const material = new THREE.MeshBasicMaterial({
  map: uvTexture
})

const plane = new THREE.Mesh(geometry, planeMaterial)
scene.add(plane)
plane.position.x = 3

// 创建法向量辅助器
const helper = new VertexNormalsHelper(plane, 0.2, 0xff0000, 1)
scene.add(helper)

// 设置相机位置
camera.position.z = 15
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

// 渲染函数
function animate() {
  controls.update()
  requestAnimationFrame(animate)
  // 渲染
  renderer.render(scene, camera)
}
animate()

// 监听窗口变化
window.addEventListener("resize", () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新相机投影矩阵
  camera.updateProjectionMatrix()
})

// rgbeLoader 加载hdr贴图
let rgbeLoader = new RGBELoader()
rgbeLoader.load("/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", envMap => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置环境贴图
  scene.background = envMap
  // 设置环境贴图
  scene.environment = envMap
  // 设置plane的环境贴图
  planeMaterial.envMap = envMap
  // 设置
  material.envMap = envMap
})
