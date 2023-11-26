import React, { useRef, useEffect, useState } from 'react'
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
  const selectionIndicatorRef = useRef(null)
  const worldSize = 100
  const cameraRef = useCameraSetup(worldSize)
  useWorldSetup(sceneRef, worldSize)
  useControls(cameraRef)
  useModelLoader(sceneRef)
  useInteractionHandler(rendererRef, cameraRef, sceneRef, raycasterRef, selectedRef, selectionIndicatorRef)
  useResizeHandler(rendererRef, cameraRef, worldSize)
  const [showDebug, setShowDebug] = useState(true)
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

    const render = () => {
      requestAnimationFrame(render)
      if (showDebug) {
        stats.begin()
      }
      renderer.render(sceneRef.current, cameraRef.current)
      if (showDebug) {
        stats.end()
      }
    }

    render()

    return () => {
      if (mount) {
        mount.removeChild(renderer.domElement)
      }
      document.body.removeChild(stats.dom)
    }
  }, [cameraRef, showDebug])

  return (
    <div>
      <div ref={mountRef} className='canvas-container' />
      {showDebug && <DebugPanel rendererRef={rendererRef} />}
      <button onClick={() => setShowDebug(!showDebug)}>
        {showDebug ? 'Disable Debug' : 'Enable Debug'}
      </button>
    </div>
  )
}

export default App
