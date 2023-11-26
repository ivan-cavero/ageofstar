import { useRef, useEffect } from 'react'
import * as THREE from 'three'

const useCameraSetup = (worldSize) => {
  const cameraRef = useRef()

  useEffect(() => {
    const aspectRatio = window.innerWidth / window.innerHeight
    const camera = new THREE.OrthographicCamera(
      -aspectRatio * worldSize / 2,
      aspectRatio * worldSize / 2,
      worldSize / 2,
      -worldSize / 2,
      1,
      1000
    )
    camera.position.set(worldSize / 2, worldSize / 2, worldSize / 2)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera
  }, [worldSize])

  return cameraRef
}

export default useCameraSetup
