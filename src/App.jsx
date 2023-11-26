import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import Stats from 'stats.js'
import DebugPanel from './components/Debug/DebugPanel'
import useCameraSetup from './hooks/useCameraSetup'
import useWorldSetup from './hooks/useWorldSetup'
import useControls from './hooks/useControls'
import useModelLoader from './hooks/useModelLoader'
import useInteractionHandler from './hooks/useInteractionHandler'
import useResizeHandler from './hooks/useResizeHandler'
import './App.css'

function App () {
  const mountRef = useRef(null)
  const sceneRef = useRef(new THREE.Scene())
  const rendererRef = useRef(new THREE.WebGLRenderer({ antialias: true }))
  const raycasterRef = useRef(new THREE.Raycaster())
  const selectedRef = useRef(null)
  const targetPositionRef = useRef(null) // Nueva referencia para la posición objetivo
  const selectionIndicatorRef = useRef(null)
  const worldSize = 100
  const cameraRef = useCameraSetup(worldSize)
  useWorldSetup(sceneRef, worldSize)
  useControls(cameraRef)
  useModelLoader(sceneRef)
  useInteractionHandler(rendererRef, cameraRef, sceneRef, raycasterRef, selectedRef, selectionIndicatorRef, targetPositionRef)
  useResizeHandler(rendererRef, cameraRef, worldSize)
  const statsRef = useRef(new Stats())

  useEffect(() => {
    const renderer = rendererRef.current
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    const mount = mountRef.current
    mount.appendChild(renderer.domElement)

    const stats = statsRef.current
    stats.dom.style.position = 'absolute'
    stats.dom.style.left = '10px'
    stats.dom.style.top = '10px'
    document.body.appendChild(stats.dom)

    const animate = () => {
      requestAnimationFrame(animate)
      stats.begin()

      if (selectedRef.current && targetPositionRef.current) {
        const step = 1
        selectedRef.current.position.lerp(new THREE.Vector3(targetPositionRef.current.x, selectedRef.current.position.y, targetPositionRef.current.z), step)
      }

      renderer.render(sceneRef.current, cameraRef.current)
      stats.end()
    }

    animate()

    return () => {
      if (mount) {
        mount.removeChild(renderer.domElement)
      }
      document.body.removeChild(stats.dom)
    }
  }, [cameraRef])

  return (
    <div>
      <div ref={mountRef} className='canvas-container' />
      <DebugPanel rendererRef={rendererRef} />
    </div>
  )
}

export default App
