var call = 0;

export default function pdt360DegViewer(id, n, p, t) {
  call++;
  var i = 1,
    j = 0,
    move = [],
    mainDiv = document.querySelector(`#${id}`);
  mainDiv.className = "viewer";
  mainDiv.innerHTML += `<img class="${id} draggable" draggable="false" src='${p}${i}.${t}'>`;

  if (call == 1)
    for (var k = 1; k <= n; k++) {
      document.getElementById("dummy").innerHTML += `<img src='${p}${k}.${t}'>`;
    }

  var img = document.querySelector(`#${id} .${id}`);

  var touch = false;
  // window.matchMedia("screen and (max-width: 992px)").matches
  //   ? touchFun()
  //   : nonTouch();
  nonTouch();
  //For Touch Devices
  window.addEventListener("touchstart", function () {
    touchFun();
  });

  function touchFun() {
    touch = true;
    // img.removeAttribute("draggable");
    img.addEventListener("touchmove", function (e) {
      logic(this, e);
    });
    img.addEventListener("touchend", function (e) {
      move = [];
    });
  }
  //For Non-Touch Devices
  function nonTouch() {
    touch = false;
    var drag = false;
    img.addEventListener("mousedown", function (e) {
      drag = true;
      logic(this, e);
    });
    img.addEventListener("mouseup", function (e) {
      drag = false;
      move = [];
    });
    mouseEvent();

    function mouseEvent() {
      img.addEventListener("mousemove", function (e) {
        if (drag) {
          logic(this, e);
        }
      });
      img.addEventListener("mouseleave", function () {
        move = [];
      });
    }
  }
  function logic(el, e) {
    j++;
    var x = touch ? e.touches[0].clientX : e.clientX;
    var coord = x - img.offsetLeft;
    move.push(coord);

    var l = move.length,
      oldMove = move[l - 2],
      newMove = move[l - 1];
    var thresh = touch ? true : !(j % 3);
    if (thresh) {
      if (newMove > oldMove) nxt(el);
      else if (newMove < oldMove) prev(el);
    }
  }

  function prev(e) {
    if (i <= 1) {
      i = n;
      e.src = `${p}${--i}.${t}`;
      nxt(e);
    } else e.src = `${p}${--i}.${t}`;
  }
  function nxt(e) {
    if (i >= n) {
      i = 1;
      e.src = `${p}${++i}.${t}`;
      prev(e);
    } else e.src = `${p}${++i}.${t}`;
  }
}
