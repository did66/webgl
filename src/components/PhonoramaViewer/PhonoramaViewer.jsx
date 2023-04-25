import React from "react";
import "./PhonoramaViewer.css"

export default function PhonoramaViewer() {
  return (
    <React.Fragment>
      <div id="pdtViewer">
        <h3 className="hidePhone">通过鼠标滚轮来控制旋转</h3>
        <div id="car7"></div>
      </div>
      <div id="dummy"></div>
    </React.Fragment>
  )
}