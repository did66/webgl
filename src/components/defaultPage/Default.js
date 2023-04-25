import React from "react";
// import bg from "../../assets/namibia-4820682.jpg";
import NButton from "../NButton/NButton";
import "./Default.css"
import { jumpToSignUpPage, jumpToLoginPage } from "../../utils/linkUtil";


export default function Default(props) {

    let mainBgStyle = {
        // 'backgroundImage': `url(${bg})`,
        'backgroundSize': 'cover',
        'height': '100vh',
        
    };

    let btStyles = {
        'width': '35vh',
        'height': '6.8vh'
    }

    return (
        <div className="defaultMain" style={mainBgStyle}>
            <div className="defaultMain--info">
                <div className="defaultMain--info_neudim_container">
                    <span className="defaultMain--info_neudim_span">
                        NeuDim Engine
                    </span>
                </div>
                <div className="defaultMain--info_description_container">
                    <span className="defaultMain--info_description_span">
                        3D Scan Online
                    </span>
                </div>
                <div className="defaultMaininfo_register_container">
                    <NButton buttonText="Join Now" addStyles={btStyles} onClick={() => jumpToSignUpPage()}></NButton>
                </div>
                <div className="defaultMain--info_login_container">
                    <span className="defaultMain--info_login_already_span">
                        Already have an account?
                    </span>
                    <span className="defaultMain--info_login_click_span" onClick={() => jumpToLoginPage()}>
                        Log in
                    </span>
                </div>
            </div>
        </div>
    )
}