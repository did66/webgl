// ray caster
var raycaster = new THREE.Raycaster();
renderer.domElement.addEventListener('click', onMouseClick, false);
renderer.domElement.addEventListener('mousemove', onMouseMove, false);

var selectedCamera = null; // 用于记录当前选中的相机
var hoverCamera = null; // 用于记录当前鼠标悬停的相机

function onMouseClick(event) {
  // 计算鼠标位置在屏幕坐标系中的坐标
  var mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 计算射线
  raycaster.setFromCamera(mouse, camera);

  // 获取与射线相交的相机
  var intersects = raycaster.intersectObjects(camera_cones);
  if (intersects.length > 0) {
    // 如果有交点，执行相应操作
    // 恢复之前选中的相机的颜色
    if (selectedCamera) {
      selectedCamera.material.color.set(0xffff00);
    }
    // 设置新选中的相机的颜色
    selectedCamera = intersects[0].object;
    selectedCamera.material.color.set(0xff0000);
  }
}

function onMouseMove(event) {
    // 计算鼠标位置在屏幕坐标系中的坐标
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
    // 计算射线
    raycaster.setFromCamera(mouse, camera);
  
    // 获取与射线相交的相机
    var intersects = raycaster.intersectObjects(camera_cones);
  
    if (intersects.length > 0) {
      // 如果有交点，设置相应的颜色，并将鼠标指针更改为手指
      var currentCamera = intersects[0].object;
      if (hoverCamera !== currentCamera) {
        hoverCamera = currentCamera;
        hoverCamera.material.color.set(0x00ff00);
        renderer.domElement.style.cursor = 'pointer';
      }
    } else {
      // 如果没有交点，将之前选中的相机的颜色和鼠标指针恢复为默认状态
      if (hoverCamera) {
        if(selectedCamera != hoverCamera){
            hoverCamera.material.color.set(0xffff00);
        }else{
            hoverCamera.material.color.set(0xff0000);
        }
        hoverCamera = null;
        renderer.domElement.style.cursor = 'auto';
      }
    }
}
  
  
  
  
  
  
  