import React from "react";
import Header from "../components/Header/Header";
import SignUp from "../components/SignUp/SignUp";


export default function SignUpPage(props) {
    return (
        <div className="SignUpPage">
          <Header displayButton={false}></Header>
          <SignUp></SignUp>
        </div>
    )
}