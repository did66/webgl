import React from "react";
import Header from "../components/Header/Header";
import Login from "../components/Login/Login"

// import './Login.css'

export default function LoginPage(props) {
    return (
        <div className="LoginPage">
          <Header displayButton={false}></Header>
          <Login></Login>
        </div>
    )
}