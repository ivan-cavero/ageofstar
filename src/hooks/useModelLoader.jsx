import { useEffect } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const useModelLoader = (sceneRef) => {
  useEffect(() => {
    if (!sceneRef.current) return

    const loader = new GLTFLoader()
    loader.load('/assets/gladiator.glb', (gltf) => {
      const model = gltf.scene
      sceneRef.current.add(model)

      model.isSelectable = true
      model.scale.set(1, 1, 1)
      model.position.set(0, 0, 0)
      model.rotation.set(0, 0, 0)
    }, undefined, (error) => {
      console.error('Error loading model:', error)
    })
  }, [sceneRef])
}

export default useModelLoader
