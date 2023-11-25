import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './App.css'

function App() {
  const mountRef = useRef(null);
  const cameraRef = useRef();
  const sceneRef = useRef(new THREE.Scene());
  const raycasterRef = useRef(new THREE.Raycaster());
  const selectedRef = useRef(null);
  const selectionIndicatorRef = useRef(null);
  
  const zoomSpeed = 0.001
  const panSpeed = 0.5
  const worldSize = 100

  useEffect(() => {    
    const aspectRatio = window.innerWidth / window.innerHeight
    const camera = new THREE.OrthographicCamera(
      -aspectRatio * worldSize / 2, // left
      aspectRatio * worldSize / 2, // right
      worldSize / 2, // up
      -worldSize / 2, // down
      1, // cerca
      1000 // lejos
    )
    camera.position.set(worldSize / 2, worldSize / 2, worldSize / 2)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87ceeb)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    const currentMountRef = mountRef.current;
    currentMountRef.appendChild(renderer.domElement);

    const gridSize = 100
    const gridDivisions = 100
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions)
    scene.add(gridHelper)

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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);


    const render = () => {
      requestAnimationFrame(render)
      renderer.render(scene, camera)
    }

    render()

    const handleWheel = event => {
      const delta = -event.deltaY * zoomSpeed
      cameraRef.current.zoom += delta
      cameraRef.current.zoom = Math.max(0.1, cameraRef.current.zoom)
      cameraRef.current.updateProjectionMatrix()
    }
    window.addEventListener('wheel', handleWheel)

    const handleKeyDown = (event) => {
      const vector = new THREE.Vector3();
      switch (event.key) {
        case 'ArrowUp':
          vector.setFromMatrixColumn(camera.matrix, 0);
          vector.crossVectors(camera.up, vector);
          camera.position.addScaledVector(vector, panSpeed);
          break;
        case 'ArrowDown':
          vector.setFromMatrixColumn(camera.matrix, 0);
          vector.crossVectors(camera.up, vector);
          camera.position.addScaledVector(vector, -panSpeed);
          break;
        case 'ArrowLeft':
          vector.setFromMatrixColumn(camera.matrix, 0);
          camera.position.addScaledVector(vector, -panSpeed);
          break;
        case 'ArrowRight':
          vector.setFromMatrixColumn(camera.matrix, 0);
          camera.position.addScaledVector(vector, panSpeed);
          break;
        default:
          break;
      }
      camera.updateProjectionMatrix();
    };
    window.addEventListener('keydown', handleKeyDown)

    const loader = new GLTFLoader();
    loader.load('/assets/gladiator.glb', (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      model.isSelectable = true;
      model.scale.set(1, 1, 1);
      model.position.set(0, 0, 0);
      model.rotation.set(0, 0, 0);
    }, undefined, (error) => {
      console.error(error);
    });

    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      renderer.setSize(width, height)

      camera.left = -width / worldSize
      camera.right = width / worldSize
      camera.top = height / worldSize
      camera.bottom = -height / worldSize
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', handleResize)

    const onCanvasClick = (event) => {
      event.preventDefault();
    
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
      const mouse = new THREE.Vector2(x, y);
      raycasterRef.current.setFromCamera(mouse, cameraRef.current);
    
      const intersects = raycasterRef.current.intersectObjects(scene.children, true);
    
      // Filtrar para obtener solo los objetos que deseas seleccionar
      const filteredIntersects = intersects.filter((intersect) => {
        return intersect.object.material.name === "character";
      });
    
      if (filteredIntersects.length > 0) {
        const selectedObject = filteredIntersects[0].object;
    
        // Eliminar el círculo de selección anterior
        if (selectionIndicatorRef.current) {
          scene.remove(selectionIndicatorRef.current);
          selectionIndicatorRef.current = null;
        }
    
        selectedRef.current = selectedObject;
    
        // Crear un nuevo círculo de selección
        const geometry = new THREE.CircleGeometry(1, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
        const circle = new THREE.Mesh(geometry, material);
        circle.rotation.x = -Math.PI / 2;
        circle.position.set(
          selectedObject.position.x,
          selectedObject.position.y - 0.1, 
          selectedObject.position.z
        );
    
        scene.add(circle);
        selectionIndicatorRef.current = circle;
      } else {
        if (selectedRef.current && selectionIndicatorRef.current) {
          scene.remove(selectionIndicatorRef.current);
          selectionIndicatorRef.current = null;
          selectedRef.current = null;
        }
      }
    };

    renderer.domElement.addEventListener('click', onCanvasClick);

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('click', onCanvasClick);
      if (currentMountRef) {
        currentMountRef.removeChild(renderer.domElement);
      }
    }
  }, [])

  return (
    <div ref={mountRef} className="canvas-container" />
  )
}

export default App
