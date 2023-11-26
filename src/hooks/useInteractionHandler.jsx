import { useEffect } from 'react'
import * as THREE from 'three'

const useInteractionHandler = (rendererRef, cameraRef, sceneRef, raycasterRef, selectedRef, selectionIndicatorRef, targetPositionRef) => {
  useEffect(() => {
    const onCanvasClick = (event) => {
      if (!rendererRef.current) return

      event.preventDefault()
      const rect = rendererRef.current.domElement.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      const mouse = new THREE.Vector2(x, y)
      raycasterRef.current.setFromCamera(mouse, cameraRef.current)

      const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true)

      const filteredIntersects = intersects.filter((intersect) => {
        return intersect.object.material.name === 'character'
      })

      if (filteredIntersects.length > 0) {
        const selectedObject = filteredIntersects[0].object

        if (selectionIndicatorRef.current) {
          sceneRef.current.remove(selectionIndicatorRef.current)
          selectionIndicatorRef.current = null
        }

        selectedRef.current = selectedObject

        const geometry = new THREE.CircleGeometry(1, 32)
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide })
        const circle = new THREE.Mesh(geometry, material)
        circle.rotation.x = -Math.PI / 2
        circle.position.set(
          selectedObject.position.x,
          selectedObject.position.y - 0.1,
          selectedObject.position.z
        )

        sceneRef.current.add(circle)
        selectionIndicatorRef.current = circle
      } else {
        if (selectedRef.current && selectionIndicatorRef.current) {
          sceneRef.current.remove(selectionIndicatorRef.current)
          selectionIndicatorRef.current = null
          selectedRef.current = null
        }
      }
    }

    const onRightClick = (event) => {
      event.preventDefault()

      if (!rendererRef.current || !selectedRef.current || event.button !== 2) return

      const rect = rendererRef.current.domElement.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      const mouse = new THREE.Vector2(x, y)

      raycasterRef.current.setFromCamera(mouse, cameraRef.current)
      const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true)

      if (intersects.length > 0) {
        const targetPosition = intersects[0].point
        targetPositionRef.current = targetPosition
      }
    }

    rendererRef.current.domElement.addEventListener('click', onCanvasClick)
    rendererRef.current.domElement.addEventListener('contextmenu', onRightClick)

    return () => {
      if (rendererRef.current) {
        rendererRef.current.domElement.removeEventListener('click', onCanvasClick)
        rendererRef.current.domElement.removeEventListener('contextmenu', onRightClick)
      }
    }
  }, [rendererRef, cameraRef, sceneRef, raycasterRef, selectedRef, selectionIndicatorRef, targetPositionRef])
}

export default useInteractionHandler
