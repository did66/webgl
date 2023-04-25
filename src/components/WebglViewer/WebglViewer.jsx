import React, { useRef, useEffect, useCallback } from "react";
import { initView3D, disposeView3D } from "./main.js";
import "./WebglViewer.css";

export default function WebglViewer() {
  // 获取dom元素 传递给three.js场景 便于three.js 随dom变化而变化，适配各种div尺寸和界面缩放
  const viewport = useRef();

  useEffect(() => {
    initView3D(viewport.current);
    return () => {
      disposeView3D();
    };
  }, []);

  return (
    <React.Fragment>
      <div id="viewport" ref={viewport}></div>
    </React.Fragment>
  );
}
