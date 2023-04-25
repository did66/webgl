import React from "react";
import logo from "../../assets/neudim_logo.png";
import NButton from "../NButton/NButton";
import { jumpToSignUpPage, jumpToLoginPage } from "../../utils/linkUtil"
import './Header.css'

export default function Header(props) {

    let btStyles = {
        'width': '11.8vh',
        'height': '4.2vh'
    }

    let displayButton = props.displayButton;
    if (displayButton === undefined) {
        displayButton = true
    }

    return (
        <div className="navbar_container">
            <header className="navbar">
                <img className="navbar--logo" src={logo} alt="neudim-logo" />
                {
                    displayButton &&
                    <div className="navbar--login_button_container" onClick={() => jumpToLoginPage()}>
                        <span>Log In</span>
                    </div>
                }
                {
                    displayButton &&
                    <div className="navbar--sign_up_button_container">
                        <NButton buttonText="Sign Up" addStyles={btStyles} onClick={() => jumpToSignUpPage()}></NButton>
                    </div>
                }
            </header>
            <div className="navbar--shadow"></div>
        </div>
    )
}