/**
 * Mock for Three.js library
 */

class MockVector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set() {
    return this;
  }

  copy() {
    return this;
  }

  add() {
    return this;
  }

  sub() {
    return this;
  }

  multiplyScalar() {
    return this;
  }

  normalize() {
    return this;
  }

  applyEuler() {
    return this;
  }

  clone() {
    return new MockVector3(this.x, this.y, this.z);
  }
}

class MockScene {
  constructor() {
    this.children = [];
    this.add = jest.fn(obj => {
      this.children.push(obj);
      return obj;
    });
    this.remove = jest.fn(obj => {
      this.children = this.children.filter(child => child !== obj);
    });
  }
}

class MockRenderer {
  constructor() {
    this.domElement = document.createElement('canvas');
    this.setSize = jest.fn();
    this.setPixelRatio = jest.fn();
    this.render = jest.fn();
    this.shadowMap = {
      enabled: false,
      type: 'BasicShadowMap',
    };
  }
}

class MockCamera {
  constructor() {
    this.position = new MockVector3();
    this.rotation = new MockVector3();
    this.updateProjectionMatrix = jest.fn();
  }
}

const THREE = {
  Scene: MockScene,
  PerspectiveCamera: MockCamera,
  WebGLRenderer: MockRenderer,
  Vector3: MockVector3,
  Box3: jest.fn().mockImplementation(() => ({
    setFromObject: jest.fn(),
    getSize: jest.fn().mockReturnValue(new MockVector3(1, 1, 1)),
    getCenter: jest.fn().mockReturnValue(new MockVector3()),
  })),
  Mesh: jest.fn().mockImplementation(() => ({
    position: new MockVector3(),
    rotation: new MockVector3(),
    scale: new MockVector3(1, 1, 1),
  })),
  MeshBasicMaterial: jest.fn().mockImplementation(() => ({})),
  BoxGeometry: jest.fn(),
  SphereGeometry: jest.fn(),
  Color: jest.fn().mockImplementation((color) => ({ color })),
  Group: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    position: new MockVector3(),
    rotation: new MockVector3(),
    scale: new MockVector3(1, 1, 1),
  })),
  Clock: jest.fn().mockImplementation(() => ({
    getElapsedTime: jest.fn().mockReturnValue(0),
    getDelta: jest.fn().mockReturnValue(0.016),
  })),
  TextureLoader: jest.fn().mockImplementation(() => ({
    load: jest.fn().mockReturnValue({}),
  })),
  Object3D: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    position: new MockVector3(),
    rotation: new MockVector3(),
    scale: new MockVector3(1, 1, 1),
  })),
  Raycaster: jest.fn().mockImplementation(() => ({
    setFromCamera: jest.fn(),
    intersectObjects: jest.fn().mockReturnValue([]),
  })),
  AmbientLight: jest.fn(),
  DirectionalLight: jest.fn(),
  PointLight: jest.fn(),
  SpotLight: jest.fn(),
};

module.exports = THREE;
