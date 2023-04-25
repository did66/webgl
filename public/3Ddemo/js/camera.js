
let curPath = null;
// add a cone to denote the camera position
function createSquarePyramid(sideLength, height) {
  var geometry = new THREE.Geometry();
  var halfSideLength = sideLength / 2;

  // 创建正方体金字塔的顶点
  geometry.vertices.push(
      new THREE.Vector3(-halfSideLength, -halfSideLength, -height/2),
      new THREE.Vector3(halfSideLength, -halfSideLength, -height/2),
      new THREE.Vector3(halfSideLength, halfSideLength, -height/2),
      new THREE.Vector3(-halfSideLength, halfSideLength, -height/2),
      new THREE.Vector3(0, 0, height/2)
  );

  // 创建正方体金字塔的五个面
  geometry.faces.push(
    new THREE.Face3(1, 0, 2), // 底面（正方形）
    new THREE.Face3(3, 2, 0), 
    new THREE.Face3(0, 1, 4), // 侧面（正三角形）
    new THREE.Face3(1, 2, 4), // 侧面（正三角形）
    new THREE.Face3(2, 3, 4), // 侧面（正三角形）
    new THREE.Face3(3, 0, 4)  // 侧面（正三角形）
);

  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  return geometry;
}


function setCamera(){
    camera.getWorldDirection(direction);
    var geometry = createSquarePyramid(0.12, 0.16);
    // var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    // var cone = new THREE.Mesh( geometry, material );

    var material = new THREE.MeshPhongMaterial({
      color: 0xffff00, // 保持黄色
      specular: 0x888822, // 将高光颜色调整为黄色调
      shininess: 50, // 调整光泽度以改变物体表面的反射效果
      flatShading: true, // 启用平面着色
  });
    
    // 创建网格对象
    var cone = new THREE.Mesh(geometry, material);
    cone.originalColor = material.color.clone();
    
    var edgesGeometry = new THREE.EdgesGeometry(geometry);
    var edgesMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 2,
    });

    var edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

    cone.add(edges);


    // 添加事件监听器
    cone.addEventListener('click', function(event) {
        console.log("Clicked on cone: ", event.target);
        // change color
        event.target.material.color.set(0xff0000);
    });

    cone.position.set(camera.position.x, camera.position.y, camera.position.z)
    cone.lookAt(direction);
    cone.rotateX(2* Math.PI / 2);

    const cameraUp = camera.up.clone();
    cameraUp.applyQuaternion(camera.quaternion);
    // add custom property for camera info
    cone.cameraInfo = {
        position: cone.position.clone(),
        lookAt: direction.clone(),
        up: cameraUp.toArray(),
    };

    camera_cones.push(cone)

    if (camera_cones.length >= 2) {
      const points = camera_cones.map((cone) => cone.cameraInfo.position);
      const curve = new THREE.CatmullRomCurve3(points);
      const radius = 0.05;
      const tubularSegments = 64;
      const radialSegments = 8;
      const closed = false;
      
      const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, closed);
      
      function smoothStep(edge0, edge1, x) {
        const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
        return t * t * (3 - 2 * t);
      }
      
      const color1 = new THREE.Color(0xFFD1DC); // 柔和粉色
      const color2 = new THREE.Color(0xD1C4E9); // 淡紫色

      geometry.computeBoundingBox();

      for (let i = 0; i < geometry.faces.length; i++) {
        const face = geometry.faces[i];
        const vertices = [face.a, face.b, face.c];
        
        vertices.forEach((vertexIndex) => {
          const vertex = geometry.vertices[vertexIndex];
          const ratio = (vertex.y - geometry.boundingBox.min.y) / (geometry.boundingBox.max.y - geometry.boundingBox.min.y);
          const smoothRatio = smoothStep(0, 1, ratio);
          const color = color1.clone().lerp(color2, smoothRatio);

          if (!geometry.colors[vertexIndex]) {
            geometry.colors[vertexIndex] = color;
          }
        });

        face.vertexColors = [geometry.colors[face.a], geometry.colors[face.b], geometry.colors[face.c]];
      }

      const material = new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.7
      });
      const tubeMesh = new THREE.Mesh(geometry, material);
      if (camera_path.length > 0) {
        const oldPath = camera_path.pop();
      }
      camera_path.push(tubeMesh); // 将新路径添加到数组中
    }
}

function deleteCamera(index) {
  // Remove the camera cone at the specified index
  const deletedCone = camera_cones.splice(index, 1)[0];
  
  // Remove the corresponding tube mesh from the scene
  // if (camera_path.length > 0) {
  //   scene.remove(camera_path.pop());
  // }
  
  // Recreate the camera path if there are still enough cones
  if (camera_cones.length < 2) {
    if (camera_path.length > 0) {
      const oldPath = camera_path.pop();
    }
  }
  else {
    const points = camera_cones.map((cone) => cone.cameraInfo.position);
    const curve = new THREE.CatmullRomCurve3(points);
    const radius = 0.1;
    const tubularSegments = 64;
    const radialSegments = 8;
    const closed = false;

    const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, closed);

    function smoothStep(edge0, edge1, x) {
      const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
      return t * t * (3 - 2 * t);
    }

    const color1 = new THREE.Color(0xFFD1DC); // 柔和粉色
    const color2 = new THREE.Color(0xD1C4E9); // 淡紫色

    geometry.computeBoundingBox();

    for (let i = 0; i < geometry.faces.length; i++) {
      const face = geometry.faces[i];
      const vertices = [face.a, face.b, face.c];

      vertices.forEach((vertexIndex) => {
        const vertex = geometry.vertices[vertexIndex];
        const ratio = (vertex.y - geometry.boundingBox.min.y) / (geometry.boundingBox.max.y - geometry.boundingBox.min.y);
        const smoothRatio = smoothStep(0, 1, ratio);
        const color = color1.clone().lerp(color2, smoothRatio);

        if (!geometry.colors[vertexIndex]) {
          geometry.colors[vertexIndex] = color;
        }
      });

      face.vertexColors = [geometry.colors[face.a], geometry.colors[face.b], geometry.colors[face.c]];
    }

    const material = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.7
    });
    const tubeMesh = new THREE.Mesh(geometry, material);
    if (camera_path.length > 0) {
      const oldPath = camera_path.pop();
    }
    camera_path.push(tubeMesh); // 将新路径添加到数组中
  }

  // Remove the deleted cone from the scene
  // scene.remove(deletedCone);
}

function posAndLookat2Ex(pos, lookat, up, scale = 1, offset = [0, 0, 0]) {
  // Compute forward, right, and up vectors
  const forward = new THREE.Vector3().subVectors(lookat, pos).normalize();
  const right = new THREE.Vector3().crossVectors(forward, up).normalize();
  up = new THREE.Vector3().crossVectors(right, forward).normalize();

  // Create the extrinsic matrix as a 2D array
  const ex = [
    [right.x, up.x, -forward.x, pos.x],
    [-right.z, -up.z, forward.z, -pos.z],
    [right.y, up.y, -forward.y, pos.y],
    [0, 0, 0, 1]
  ];
  
  return ex;
}

function save_camera() {
  const cameraData = {
    frames: []
  };

  // Create a spline curve based on the camera positions
  const cameraPositions = camera_cones.map(cone => cone.cameraInfo.position);
  const cameraPath = new THREE.SplineCurve3(cameraPositions);

  camera_cones.forEach((cone, index) => {
    // console.log(index)
    if (index < camera_cones.length - 2) {
      const cameraInfo = cone.cameraInfo;
      const startPosition = cameraPositions[index];
      const endPosition = cameraPositions[index + 1];
      const startLookAt = camera_cones[index].cameraInfo.lookAt.clone();
      const endLookAt = camera_cones[index + 1].cameraInfo.lookAt.clone();
      const distance = startPosition.distanceTo(endPosition);
      const steps = Math.ceil(distance / 0.1); // Generate one point every 0.1 units along the curve
      const points = cameraPath.getPoints(steps, startPosition, endPosition);

      for (let i = 1; i < points.length; i++) {
        const position = points[i];
        const t = i / steps;
        const lookAt = startLookAt.clone().lerp(endLookAt, t);
        cameraData.frames.push({
          position: position.toArray(),
          lookat: lookAt.toArray(),
          up: cameraInfo.up,
        });
      }
    }
  });
  // Add transform_matrix, w, h, and camera_angle_x properties to each frame
  cameraData.frames.forEach((frame, index) => {
    const pos = new THREE.Vector3().fromArray(frame.position);
    const lookAt = new THREE.Vector3().fromArray(frame.lookat);
    const up = new THREE.Vector3().fromArray(frame.up);

    const ex = posAndLookat2Ex(pos, lookAt, up);
    frame.file_path = `./train/${index}.png`;
    frame.transform_matrix = ex;
  });

  // Add w, h, and camera_angle_x properties to cameraData object
  cameraData.w = 800;
  cameraData.h = 800;
  cameraData.camera_angle_x = 0.9;

  const jsonString = JSON.stringify(cameraData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'camera-data.json';
  link.dispatchEvent(new MouseEvent('click'));
}

function play_camera(animationSpeed){
  // Check if there are enough camera cones to interpolate a path
  if (camera_cones.length < 2) {
    alert('Please add at least two camera cones to interpolate a camera path.');
    return;
  }

  const cameraPositions = camera_cones.map(cone => cone.cameraInfo.position);
  const cameraLookAt = camera_cones.map(cone => cone.cameraInfo.lookAt);

  // Create a spline curve based on the camera positions
  const cameraPath = new THREE.SplineCurve3(cameraPositions);

  // Set up variables for animation
  const startPosition = camera.position.clone();
  const startLookAt = cameraLookAt[0].clone();
  const endLookAt = cameraLookAt[cameraLookAt.length-1].clone();
  const animationSpeedFactor = animationSpeed || 1;
  const distance = cameraPath.getLength();
  const animationDuration = distance / animationSpeedFactor * 1000; // in milliseconds
  let startTime = undefined;
  let isAnimating = false;

  /**
   * Internal helper function to update the camera position and lookAt
   * based on the current time of the animation
   */
  function updateCamera() {
    const currentTime = Date.now() - startTime;
    const t = Math.min(1, currentTime / animationDuration);
    const position = cameraPath.getPoint(t);
    camera.position.copy(position);
    camera.lookAt(startLookAt.clone().lerp(endLookAt, t));
    
    if (t < 1) {
      requestAnimationFrame(updateCamera);
    } else {
      isAnimating = false;
      is_playing = false;
    }
  }

  // Start the animation loop
  if (!isAnimating) {
    startTime = Date.now();
    isAnimating = true;
    is_playing = true;
    updateCamera();
  }
}