import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

function DebugPanel ({ rendererRef }) {
  const [info, setInfo] = useState({
    drawCalls: 0,
    triangles: 0,
    lines: 0,
    points: 0,
    memoryUsage: 'No disponible'
  })

  useEffect(() => {
    const updateInfo = () => {
      setInfo({
        drawCalls: rendererRef.current.info.render.calls,
        triangles: rendererRef.current.info.render.triangles,
        lines: rendererRef.current.info.render.lines,
        points: rendererRef.current.info.render.points,
        memoryUsage: performance.memory ? `${Math.round(performance.memory.usedJSHeapSize / 1048576)} MB de ${Math.round(performance.memory.jsHeapSizeLimit / 1048576)} MB` : 'No disponible'
      })
    }

    const intervalId = setInterval(updateInfo, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [rendererRef])

  return (
    <div className='debug-panel' style={panelStyles}>
      <p>Draw Calls: {info.drawCalls}</p>
      <p>Triangles: {info.triangles}</p>
      <p>Lines: {info.lines}</p>
      <p>Points: {info.points}</p>
      <p>Memoria: {info.memoryUsage}</p>
    </div>
  )
}

const panelStyles = {
  position: 'absolute',
  top: '70px',
  left: '10px',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  padding: '10px',
  borderRadius: '5px',
  zIndex: 1000,
  fontFamily: 'monospace',
  fontSize: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
}

DebugPanel.propTypes = {
  rendererRef: PropTypes.shape({
    current: PropTypes.object.isRequired
  }).isRequired
}

export default DebugPanel
