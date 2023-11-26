import { useEffect } from 'react'
import * as THREE from 'three'

const useWorldSetup = (sceneRef, worldSize) => {
  useEffect(() => {
    if (!sceneRef.current) return

    const scene = sceneRef.current
    scene.background = new THREE.Color(0x87ceeb)

    const gridHelper = new THREE.GridHelper(100, 100)
    scene.add(gridHelper)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(0, 1, 0)
    scene.add(directionalLight)

    const textureLoader = new THREE.TextureLoader()
    textureLoader.load('/assets/grass-field.jpg', (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(10, 10)

      const grassMaterial = new THREE.MeshBasicMaterial({ map: texture })
      const grassGeometry = new THREE.PlaneGeometry(worldSize, worldSize)
      const grassPlane = new THREE.Mesh(grassGeometry, grassMaterial)
      grassPlane.rotation.x = -Math.PI / 2
      grassPlane.position.y = -0.5
      scene.add(grassPlane)
    })
  }, [sceneRef, worldSize])
}

export default useWorldSetup
