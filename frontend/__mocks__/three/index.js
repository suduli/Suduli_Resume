// Mock implementation for Three.js
const THREE = {
  Scene: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    children: [],
    background: null,
  })),
  PerspectiveCamera: jest.fn().mockImplementation(() => ({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    lookAt: jest.fn(),
    updateProjectionMatrix: jest.fn(),
  })),
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    setPixelRatio: jest.fn(),
    render: jest.fn(),
    shadowMap: {
      enabled: false,
      type: null,
    },
    domElement: document.createElement('canvas'),
    setClearColor: jest.fn(),
  })),
  BoxGeometry: jest.fn(),
  SphereGeometry: jest.fn(),
  PlaneGeometry: jest.fn(),
  CylinderGeometry: jest.fn(),
  MeshBasicMaterial: jest.fn().mockImplementation(() => ({
    color: null,
    transparent: false,
    opacity: 1,
  })),
  MeshStandardMaterial: jest.fn().mockImplementation(() => ({
    color: null,
    metalness: 0,
    roughness: 1,
    transparent: false,
    opacity: 1,
  })),
  Mesh: jest.fn().mockImplementation(() => ({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    material: null,
    geometry: null,
    castShadow: false,
    receiveShadow: false,
  })),
  PointLight: jest.fn().mockImplementation(() => ({
    position: { x: 0, y: 0, z: 0 },
    intensity: 1,
    distance: 0,
    castShadow: false,
  })),
  AmbientLight: jest.fn().mockImplementation(() => ({
    intensity: 1,
  })),
  DirectionalLight: jest.fn().mockImplementation(() => ({
    position: { x: 0, y: 0, z: 0 },
    intensity: 1,
    castShadow: false,
  })),
  Vector3: jest.fn().mockImplementation((x = 0, y = 0, z = 0) => ({
    x, y, z,
    set: jest.fn(),
    copy: jest.fn(),
    add: jest.fn().mockReturnThis(),
    sub: jest.fn().mockReturnThis(),
    multiply: jest.fn().mockReturnThis(),
    divide: jest.fn().mockReturnThis(),
    normalize: jest.fn().mockReturnThis(),
    clone: jest.fn().mockImplementation(() => ({ x, y, z })),
  })),
  Quaternion: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    setFromEuler: jest.fn(),
  })),
  Euler: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
  })),
  Color: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
  })),
  Clock: jest.fn().mockImplementation(() => ({
    getElapsedTime: jest.fn().mockReturnValue(0),
    getDelta: jest.fn().mockReturnValue(0.016),
    start: jest.fn(),
    stop: jest.fn(),
  })),
  Raycaster: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    intersectObjects: jest.fn().mockReturnValue([]),
  })),
  TextureLoader: jest.fn().mockImplementation(() => ({
    load: jest.fn().mockReturnValue({}),
  })),
  Group: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    children: [],
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  })),
  BufferGeometry: jest.fn(),
  BufferAttribute: jest.fn(),
  InstancedMesh: jest.fn(),
  MathUtils: {
    degToRad: jest.fn((deg) => deg * (Math.PI / 180)),
    radToDeg: jest.fn((rad) => rad * (180 / Math.PI)),
    clamp: jest.fn((value, min, max) => Math.min(Math.max(value, min), max)),
    lerp: jest.fn((x, y, t) => x + (y - x) * t),
  },
};

module.exports = THREE;
