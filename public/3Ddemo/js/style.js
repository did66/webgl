document.getElementById("share_button").addEventListener("click", function() {
    // Add your desired functionality here
});

document.getElementById("download_button").addEventListener("click", function() {
// Add your desired functionality here
    save_camera();
});

document.getElementById("camera_button").addEventListener("click", function() {
// 获取Trajectories按钮元素
var trajectoriesButton = document.getElementById("trajectories_button");

if (!trajectoriesButton) {
    // 如果Trajectories按钮不存在，则创建它并添加到页面上
    trajectoriesButton = document.createElement("button");
    trajectoriesButton.id = "trajectories_button";
    trajectoriesButton.classList.add("trajectories-button");
    trajectoriesButton.innerHTML = "Trajectories";

    var cameraButton = document.getElementById("camera_button");
    cameraButton.parentNode.insertBefore(trajectoriesButton, cameraButton.nextSibling);
    var icon = document.createElement("img");
    icon.src = "./img/right.svg";
    icon.classList.add("trajectories-icon");

    trajectoriesButton.insertBefore(icon, trajectoriesButton.firstChild);

    function handleClick(event) {
    if (event.target.classList.contains("square-button") || event.target.parentElement.classList.contains("square-button")) {
        return;
    }
    trajectoriesButton.classList.toggle("expanded");
    var icon = trajectoriesButton.querySelector(".trajectories-icon");
    if (icon.src.endsWith("up.svg")) {
        icon.src = "./img/right.svg";
    } else {
        icon.src = "./img/up.svg";
    }

    // Create square buttons if they don't exist
    if (!document.getElementById("orbit_button") || !document.getElementById("oscilate_button") || !document.getElementById("custom_button")) {
        var buttonLabels = ["orbit", "oscilate", "custom"];
        var buttonIcons = ["./img/orbit.svg", "./img/oscillate.svg", "./img/custom.svg"];
        var buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";
    
        buttonLabels.forEach(function (label, index) {
        var squareButton = document.createElement("button");
        squareButton.id = label + "_button";
        squareButton.className = "square-button";
    
        // 添加 SVG 图标
        var icon = document.createElement("img");
        icon.src = buttonIcons[index];
        icon.className = "button-icon";
        squareButton.appendChild(icon);
    
        // 添加文字
        var buttonText = document.createElement("span");
        buttonText.textContent = label;
        buttonText.className = "button-text";
        squareButton.appendChild(buttonText);
    
        buttonContainer.appendChild(squareButton);
        });
    
        trajectoriesButton.appendChild(buttonContainer);
        // 获取三个按钮元素
            
        var orbitButton = document.getElementById("orbit_button");
        var oscilateButton = document.getElementById("oscilate_button");
        var customButton = document.getElementById("custom_button");

        // 为三个按钮添加点击事件监听器
        orbitButton.addEventListener("click", function() {
        //this is for test and you can delete it
        //orbit接口
            // setCamera();
            //窗口提示
            alert("Orbit");
        });

        oscilateButton.addEventListener("click", function() {
        //oscilate接口
        // play_camera(1);

        });

        customButton.addEventListener("click", function() {  // 创建一个按钮元素
            if(!document.getElementById("add_camera")){
                var addButton = document.createElement("button");
                addButton.id="add_camera";
                addButton.className = "add_camera";
                addButton.innerHTML = "add_camera";
                var container = document.body;
                container.insertBefore(addButton, container.firstChild);

                addButton.addEventListener("click", function() {
                    //加相机接口
                    setCamera();
                    setX(1000);
                });

                var playButton = document.createElement("button");
                playButton.id = "play_camera";
                playButton.className = "play_camera";
                playButton.innerHTML = "play";
                var container = document.body;
                container.insertBefore(playButton, container.firstChild);
                playButton.addEventListener("click", function(){
                    if(playButton.innerHTML == "play"){
                        playButton.innerHTML = "pause";
                        play_camera(1);
                    }else {
                        playButton.innerHTML = "play";
                        //相机暂停接口

                    }
                });


            }
        });

    }
    
    }

    trajectoriesButton.addEventListener("click", handleClick);
} else {
    trajectoriesButton.removeEventListener("click", handleClick);
    trajectoriesButton.remove();
}

});

var xVal = 0;
var yVal = 0;
var zVal = 0;

function setX(val) {
  xVal = val;
  updateCoordinates();
}

function setY(val) {
  yVal = val;
  updateCoordinates();
}

function setZ(val) {
  zVal = val;
  updateCoordinates();
}

function getX() {
  return xVal;
}

function getY() {
  return yVal;
}

function getZ() {
  return zVal;
}

function updateCoordinates() {
  document.getElementById("xcoordinate").textContent = "x: " + xVal;
  document.getElementById("ycoordinate").textContent = "y: " + yVal;
  document.getElementById("zcoordinate").textContent = "z: " + zVal;
}