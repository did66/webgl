import React from "react";
import logo from "../../assets/neudim_logo.png";
import NButton from "../NButton/NButton";
import { jumpToSignUpPage, jumpToLoginPage } from "../../utils/linkUtil";
import "./Navbar.css";

export default function Navbar(props) {
  const [dropdownVisible, setDropdownVisible] = React.useState(false);

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  const handleMenuClick = () => {
    
  }

  const logOut = () => {
    console.log("logout");
    localStorage.setItem("token", "")
    jumpToLoginPage()

  }

  return (
    <div className="flex-row group">
      <img className="logo" src={require("../../assets/images/img_0.png")} />
      <div
        className="icon-user-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          className="icon-user"
          src={require("../../assets/images/img_1.png")}
        />
        {dropdownVisible && (
          <div className="dropdown">
            <div className="user-info">
              <img
                src={require("../../assets/images/account.png")}
                alt="Profile"
                className="profile-picture"
              />
              <div className="nickaccount">
                <div className="nickname">XYI</div>
                <div className="account">{sessionStorage.getItem("user")}</div>
              </div>
            </div>
            <a href="#" className="dropdown-item">
              My Account
            </a>
            <a href="#" className="dropdown-item">
              Settings
            </a>
            <a href="#" className="dropdown-item">
              Upgrade
            </a>
            <a href="#" className="dropdown-item">
              Help
            </a>
            <a href="#" className="dropdown-item" onClick={() => {logOut()}}>
              Log Out
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
