import { useEffect } from 'react'

const useResizeHandler = (rendererRef, cameraRef, worldSize) => {
  useEffect(() => {
    if (!rendererRef.current || !cameraRef.current) return

    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      rendererRef.current.setSize(width, height)
      cameraRef.current.aspect = width / height
      cameraRef.current.left = -width / worldSize
      cameraRef.current.right = width / worldSize
      cameraRef.current.top = height / worldSize
      cameraRef.current.bottom = -height / worldSize
      cameraRef.current.updateProjectionMatrix()
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [rendererRef, cameraRef, worldSize])
}

export default useResizeHandler
