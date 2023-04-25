const objectVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const objecFragmentShader = `
  uniform sampler2D RGBAtexture;
  varying vec2 vUv;


  void main() {
    vec4 color = texture2D(RGBAtexture, vUv);
    gl_FragColor = color;
  }
`;


// Create a Three.js scene, camera, and renderer
const objectScene = new THREE.Scene();

const cameraScene = new THREE.Scene();


// 添加黄色调的环境光
var ambientLight = new THREE.AmbientLight(0xcccc44); // 参数为光照颜色
cameraScene.add(ambientLight);

// 添加白色调的平行光
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // 参数1为光照颜色，参数2为光照强度
directionalLight.position.set(0, 4, 1);
cameraScene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
const camera_fix = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 100)
const aspectRatio = canvas.clientWidth / canvas.clientHeight
const renderer = new THREE.WebGLRenderer({ depth: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const context = renderer.getContext();
context.enable(context.DEPTH_TEST);
context.depthFunc(context.LEQUAL);
document.body.appendChild(renderer.domElement);


// Create a render target for the alpha blending
var objectTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { 
  format: THREE.RGBAFormat,
  depthBuffer: true,
  depthTexture: new THREE.DepthTexture(),
  stencilBuffer: false,
  minFilter: THREE.NearestFilter,
  magFilter: THREE.NearestFilter
});
var cameraTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { 
  format: THREE.RGBAFormat,
  depthBuffer: true,
  depthTexture: new THREE.DepthTexture(),
  stencilBuffer: false,
  minFilter: THREE.NearestFilter,
  magFilter: THREE.NearestFilter
});

// Create a custom shader for depth-aware alpha blending the two render targets
const blendShader = {
  uniforms: {
    t1: { value: objectTarget.texture },
    t2: { value: cameraTarget.texture },
    d1: { value: objectTarget.depthTexture },
    d2: { value: cameraTarget.depthTexture },
    cameraNear: { value: camera.near },
    cameraFar: { value: camera.far },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D t1;
    uniform sampler2D t2;
    uniform sampler2D d1;
    uniform sampler2D d2;
    uniform float cameraNear;
    uniform float cameraFar;
    varying vec2 vUv;

    float readDepth( sampler2D depthSampler, vec2 coord ) {
      float fragCoordZ = texture2D( depthSampler, coord ).x;
      // float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
      // return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
      return fragCoordZ;
    }

    void main() {
      // Sample the depth value from the first texture
      float depth1 = readDepth(d1, vUv);
      
      // Sample the depth value from the second texture
      float depth2 = readDepth(d2, vUv);
      
      // If the fragment from the second texture is closer to the camera than the fragment from the first texture,
      // blend the colors based on the alpha value of the second texture. Otherwise, blend the colors based on the alpha
      // value of the first texture.
      if (depth2 < depth1) {
        vec4 texel1 = texture2D(t1, vUv);
        vec4 texel2 = texture2D(t2, vUv);
        gl_FragColor = mix(texel1, texel2, texel2.a);
      } else {
        vec4 texel1 = texture2D(t1, vUv);
        vec4 texel2 = texture2D(t2, vUv);
        gl_FragColor = mix(texel2, texel1, texel1.a);
      }
    }
  `
};

// add an camera cone to the scene and enable depth testing and writing
const cameraGeometry = new THREE.ConeGeometry(0.1, 0.5, 32);
const cameraMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const direction = new THREE.Vector3();

// Set the depth buffer to be writable when rendering to the render targets
renderer.autoClearDepth = true;

// Create a Three.js OrbitControls object to control the camera
const controls = new THREE.OrbitControls(camera, renderer.domElement);


// Load the .obj files and their textures
const loader = new THREE.OBJLoader();
const textureLoader = new THREE.TextureLoader();
const model = { obj: '../static/hotdog.obj', RGBAtexture: '../static/hotdog.png' };

let camera_cones = [];
let camera_path = [];

// Load the model
loader.load(model.obj, function (object) {
  // Create a material for the object
  const material = new THREE.ShaderMaterial({
    uniforms: {
      RGBAtexture: { value: textureLoader.load(model.RGBAtexture) },
    },
    vertexShader: objectVertexShader,
    fragmentShader: objecFragmentShader,
    transparent: true,
    depthWrite: true,
    depthTest: true,
    side: THREE.DoubleSide,
  });
  object.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.material = material;
    }
  });
  // add object to the scene
  object.rotateX(-Math.PI / 2);
  objectScene.add(object);
});


// Set the camera position and look at the center of the scene
camera.position.set(0, 0, 5);
camera.lookAt(objectScene.position);
camera_fix.position.set(0, 0, 5);


scene  = new THREE.Scene();
let is_playing = false;

// Create a simple Three.js animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Add all camera cones to the camera scene
  if( is_playing == false ){
    for (let i = 0; i < camera_cones.length; i++) {
      cameraScene.add(camera_cones[i]);
    }
    for (let i = 0; i < camera_path.length; i++) {
      cameraScene.add(camera_path[i]);
    }
  }
  // Render the scene to the render targets
  renderer.setRenderTarget(objectTarget);
  renderer.render(objectScene, camera);
  
  renderer.setRenderTarget(cameraTarget);
  renderer.render(cameraScene, camera);
  
  // Remove all camera cones from the camera scene
  if( is_playing == false ){
    camera_cones.forEach(function(cone) {
      cameraScene.remove(cone);
    });
    camera_path.forEach(function(path) {
      cameraScene.remove(path);
    });
  }

  // Create a mesh with the custom shader material and render it onto the screen
  const blendMaterial = new THREE.ShaderMaterial(blendShader);
  const blendGeometry = new THREE.PlaneGeometry(2, 2);
  const blendMesh = new THREE.Mesh(blendGeometry, blendMaterial);
  scene.add(blendMesh);
  renderer.setRenderTarget(null);
  renderer.render(scene, camera_fix);
  renderer.setClearColor(0x808080);
}

animate();

