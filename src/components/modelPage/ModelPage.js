import React from "react";
import Header from "../Header/Header";
import ModelMain from "./ModelMain";
import './ModelPage.css'

export default function ModelPage(props) {
  return (
    <div className="ModelPage">
      <Header displayButton={false}></Header>
      <ModelMain></ModelMain>
    </div>
  )
}