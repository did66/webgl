import React, { useEffect, useState } from "react";
import logo from "../../assets/neudim_logo.png";
import "./Player.css";
import { LiveIcon, VideoIcon, MeshIcon, PanoramaIcon } from "./svgIcon";

import pdt360DegViewer from "../../utils/pdt360DegViewer";
import WebglViewer from "../WebglViewer/WebglViewer";
import VideoViewer from "../VideoViewer/VideoViewer";
import LiveViewer from "../LiveViewer/LiveViewer";
import PhonoramaViewer from "../PhonoramaViewer/PhonoramaViewer";
// import "./normalize.css";
// import "./style.css";
// import path from "../../assets/phonoramaimgs/"
export default function Player(props) {
  const [showContent, setShowContent] = useState("mesh");
  // useEffect(() => {
  //   setShowContent("live")
  // })

  useEffect(() => {
    let path = "/phonoramaimgs/";
    pdt360DegViewer("car7", 51, path, "png");
  }, []);

  function changeView(e) {
    let viewer = e.target.getAttribute("data-view");
    setShowContent(viewer);
    console.log(viewer);
  }

  return (
    <React.Fragment>
      <header>
        <img className="navbar--logo" src={logo} alt="neudim-logo" />
        <div className="right-bar">
          <div className="share-icon"></div>
        </div>
      </header>
      {showContent === "live" && <LiveViewer />}
      {showContent === "video" && <VideoViewer />}
      {showContent === "mesh" && <WebglViewer />}
      {showContent === "phonorama" && <PhonoramaViewer />}
      {
        <div
          className="player-btn"
          onClick={(event) => {
            changeView(event);
          }}
        >
          <LiveIcon fill={showContent == "live" ? "#000000" : "#bfbfbf"} />
          <VideoIcon fill={showContent == "video" ? "#000000" : "#bfbfbf"} />
          <MeshIcon fill={showContent == "mesh" ? "#000000" : "#bfbfbf"} />
          <PanoramaIcon
            fill={showContent == "phonorama" ? "#000000" : "#bfbfbf"}
          />
        </div>
      }
    </React.Fragment>
  );
}
