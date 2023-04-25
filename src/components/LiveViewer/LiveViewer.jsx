import React,{ useEffect, useState } from "react";
import "./LiveViewer.css"
import WebSocketHub from "./WebSocket";
import { WebrtcPlayer } from "./webrtc";
import loading from "../../assets/images/loading.gif";

export default function LiveViewer() {
  const [isPlay, setisPlay] = useState(false);
  // const wspath = "ws://10.15.88.38:8099";
  const wspath = "ws://10.15.88.38:8090";
  const onChange = (key) => {
    console.log(key);
  };
  var SIGNAL_TYPE_OPEN_SUCCESS = "open-success";
  var SIGNAL_TYPE_OPEN_FAILED = "open-failed";
  var SIGNAL_TYPE_UPDATE_VIEWERS = "update-viewers";
  var streamUrl = null;
  var viewers = null;
  var owner_session = null;
  let model = null;
  let mutex = false;
  var wshub = null;
  let mid = null;
  let uid = null;
  let info = {
    video_id: null,
    user_id: null,
    compoter_id: null,
    compoter_session: null,
    user_session: null,
    playdata: null,
    type: null,
  };
  let schema = null;
  let rtcPlayer = null;
  let moveScale = 1;
  const black = "#000000";
  const gray = "#bfbfbf";
  // function changeView(e) {
  //   let viewer = e.target.getAttribute("data-view");
  //   setShowContent(viewer);
  //   console.log(viewer);
  // }

  function close() {
    const data = {
      sender: "user",
      receiver: info.compoter_session,
      code: 40008,
      msg: "close",
      type: Number(info.type),
      data: {
        user_id: Number(info.user_id),
        videoid: Number(info.video_id),
      },
    };
    // wshub.send(JSON.stringify(data));
    wshub.close();
  }

  function init() {
    wshub = new WebSocketHub({
      /* eslint-disable */
      url: wspath,
      /* eslint-disable */
      debug: false,
      msgType: "String",
      heartBeat: 5000,
      heartMsg: "hello",
    });
    wshub.onclose(onClose);
    // wshub.addEventListener("open", function () {
    //   console.log("openpppppppp");
    //   wshub.onopen(onConnect);
    // });
    wshub.onopen(onConnect);

    // onConnect();
    wshub.onerror(onError);
    wshub.onheartbeat(console.log("heartbeat"));
    wshub.onmessage(onMessage);
    mid = GetQueryString("id");
    // uid = Math.random().toString(36).substr(2);
    console.log("--------->", "uid:", uid, "------mid:", mid);
  }

  function send(msg) {
    console.log(Object.prototype.toString.call(msg));
    if (Object.prototype.toString.call(msg) == "[object Object]") {
      sendData = JSON.stringify(msg);
    }
    if (!wshub) {
      alert("链接已断开");
    }
    wshub.send(sendData);
  }

  function onMessage(evt) {
    console.log("------------>onMessage", evt);
    switch (evt.cmd) {
      case SIGNAL_TYPE_OPEN_SUCCESS:
        viewers = evt.viewers;
        streamUrl = evt.streamUrl;
        console.log("------------>", streamUrl);
        playVideo(streamUrl);
        play();
        break;

      default:
        break;
    }
  }

  function onConnect(evt) {
    // console.log("???");
    console.log("on connected");
    // let senddata = JSON.stringify({
    let senddata = {
      cmd: "client-open",
      // uid: uid,
      uid: "5c6bed0d94b9be8afbc5c8ca",
      mid: "0",
    };
    // wshub.onopen = (event) => {
    // console.log("WebSocket connected");
    // socket.send("");
    // console.log("send:", senddata);
    wshub.send(JSON.stringify(senddata));
    // };
  }

  function onClose(evt) {
    console.log("on closed", evt);
  }

  function onError(evt) {
    console.log("on error", evt);
  }

  function GetQueryString(name) {
    return (
      decodeURIComponent(
        (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
          window.location.href
        ) || [window.location.href, ""])[1].replace(/\+/g, "%20")
      ) || null
    );
  }

  function handlePan({ evt, ...info }) {
    info2 = info;
    if (
      moveScale <= 1 ||
      moveScale == undefined ||
      moveScale == 0 ||
      moveScale == null
    ) {
      moveScale = 2;
    }
    if ((info.duration % moveScale) / moveScale == 0) {
      mouse_drag();
    }
  }

  function handleScroll(e) {
    let direction = e.deltaY > 0 ? "down" : "up";
    if (direction === "up") {
      zoomout();
    } else if (direction === "down") {
      zoomin();
    }
  }

  function playVideo(PlayLive) {
    const _this = this;
    let firstTime = null;
    let endTime = null;
    // TODO: 服务器ready
    firstTime = new Date().getTime();
    const video = document.getElementById("video-webrtc");
    rtcPlayer = new WebrtcPlayer({
      videoElement: video,
      autoplay: true,
      timeout: 1000,
      url: PlayLive,
      // url: "webrtc://freeview.live.dgene.com:11985/live/play300",
      canPlay() {
        console.log("can play");
      },
      onPlay() {
        endTime = new Date().getTime();
        console.log((endTime - firstTime) / 1000 + "s");
        _$q.loading.hide();
      },
      onError: (err) => {
        console.log("onerror", err);
        rtcPlayer.initPlayer();
      },
    });
    rtcPlayer.initPlayer();
  }

  function play() {
    console.log("play");
    if (!rtcPlayer) {
      return;
    }
    if (isPlay) {
      return;
    }
    const video = document.getElementById("video-webrtc");
    video.play();
    rtcPlayer.play();
    setisPlay(true);
  }

  function pause() {
    console.log("pause");
    if (!rtcPlayer) {
      return;
    }
    if (!isPlay) {
      return;
    }
    const video = document.getElementById("video-webrtc");
    video.play();
    rtcPlayer.pause();
    setisPlay(false);
  }

  function zoomin() {
    console.log("zoom in");
    findvideocover();
    const _this = this;
    if (mutex) {
      return;
    }
    // wshub.send({
    //   code: 10010,
    //   msg: "zoom in",
    //   data: {
    //     code: 240002,
    //     user_session: _owner_session,
    //   },
    // });
    _mutex = true;
    setTimeout(() => {
      _mutex = false;
    }, 33);
  }

  function zoomout() {
    console.log("zoom out");
    findvideocover();
    const _this = this;
    if (mutex) {
      return;
    }
    // wshub.send({
    //   code: 10010,
    //   msg: "zoom out",
    //   data: {
    //     code: 240003,
    //     user_session: _owner_session,
    //   },
    // });
    _mutex = true;
    setTimeout(() => {
      _mutex = false;
    }, 33);
  }

  function mouse_drag() {
    console.log("mouse_drag");
    const _this = this;
    findvideocover();
    if (mutex) {
      return;
    }
    // wshub.send({
    //   code: 10010,
    //   msg: "mouse_drag",
    //   data: {
    //     code: 40004,
    //     deltaX: info2.delta["x"],
    //     deltaY: info2.delta["y"],
    //     user_session: _owner_session,
    //   },
    // });
    _mutex = true;
    setTimeout(() => {
      _mutex = false;
    }, 33);
  }

  function findvideocover() {
    const video = document.getElementById("video-webrtc");
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    let img = canvas.toDataURL("image/jpeg");
    coverUrl = img;
    cover = img;
    console.log("coverUrl:", coverUrl);
  }

  return (
    <div className="player">
      <div className="main-player">
        <video
          id="video-webrtc"
          webkit-playsinline="true"
          x-webkit-airplay="true"
          playsInline={true}
          x5-video-player-type="h5"
          x5-video-orientation="h5"
          x5-video-player-fullscreen="ture"
          x5-playsinline="true"
          muted
        ></video>

        {isPlay ? null : (
          <img
            src={loading}
            alt=""
            srcSet=""
            className="player-cover"
            onClick={() => {
              play();
            }}
          />
        )}

        <div className="mask">
          {/* // v-touch-pan.prevent.mouse="handlePan" 
          // @mousewheel.prevent="handleScroll" */}
          {/* <q-btn v-touch-repeat:0:100.prevent.mouse.enter.space="zoomout" icon="img:img/minus.png" color="black" push round
        class="zoomout-btn" size="0.5rem" />
        <q-btn v-touch-repeat:0:100.prevent.mouse.enter.space="zoomin" icon="img:img/plus.png" color="black" push round
        class="zoomin-btn" size="0.5rem" /> */}
        </div>
      </div>
    </div>

  )
}