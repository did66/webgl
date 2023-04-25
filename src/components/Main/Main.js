// 'use strict';
import React, { useState, useEffect, memo } from "react";

import "./Main.css";
import "./global.css";
import Navbar from "../Navbar/Navbar";
import Models from "../Models/Models";

export default function Main(props) {
  return (
    <div className="page">
      <Navbar></Navbar>
      <div className="main-wrap">
        <Models></Models>
      </div>
    </div>
  );
}
