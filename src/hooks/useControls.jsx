// hooks/useControls.js
import { useEffect } from 'react'
import * as THREE from 'three'

const useControls = (cameraRef) => {
  const zoomSpeed = 0.001
  const panSpeed = 0.5

  useEffect(() => {
    if (!cameraRef.current) return

    const handleWheel = event => {
      const delta = -event.deltaY * zoomSpeed
      cameraRef.current.zoom += delta
      cameraRef.current.zoom = Math.max(0.1, cameraRef.current.zoom)
      cameraRef.current.updateProjectionMatrix()
    }

    const handleKeyDown = event => {
      const vector = new THREE.Vector3()
      switch (event.key) {
        case 'ArrowUp':
          vector.setFromMatrixColumn(cameraRef.current.matrix, 0)
          vector.crossVectors(cameraRef.current.up, vector)
          cameraRef.current.position.addScaledVector(vector, panSpeed)
          break
        case 'ArrowDown':
          vector.setFromMatrixColumn(cameraRef.current.matrix, 0)
          vector.crossVectors(cameraRef.current.up, vector)
          cameraRef.current.position.addScaledVector(vector, -panSpeed)
          break
        case 'ArrowLeft':
          vector.setFromMatrixColumn(cameraRef.current.matrix, 0)
          cameraRef.current.position.addScaledVector(vector, -panSpeed)
          break
        case 'ArrowRight':
          vector.setFromMatrixColumn(cameraRef.current.matrix, 0)
          cameraRef.current.position.addScaledVector(vector, panSpeed)
          break
        default:
          break
      }
      cameraRef.current.updateProjectionMatrix()
    }

    window.addEventListener('wheel', handleWheel)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [cameraRef, zoomSpeed, panSpeed])
}

export default useControls
