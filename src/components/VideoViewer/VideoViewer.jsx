import React from "react";
import "./VideoViewer.css"
import vidoedemo from "../../assets/video/demo.mp4";

export default function VideoViewer() {

  return (
    <div className="video-container">
        <video loop autoPlay="true" src={vidoedemo}></video>
    </div>
  )




}