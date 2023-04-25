import React from "react";
import Header from "../Header/Header";
import ResetPassMain from "./ResetPassMain";
import './ResetPassPage.css'

export default function ResetPassPage(props) {
    return (
        <div className="ResetPassPage">
          <Header displayButton={false}></Header>
          <ResetPassMain></ResetPassMain>
        </div>
    )
}