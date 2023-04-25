import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
// import DefaultPage from './components/defaultPage/DefaultPage';
// import MainPage from './components/modelPage/MainPage';
import ModelPage from "./components/modelPage/ModelPage";
import ResetPassPage from "./components/resetPassPage/ResetPassPage";
import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage";
import PlayerPage from "./pages/PlayerPage";

const App = () => {
  return (
    <Router pathname="/" basename="/">
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/signUp" element={<SignUpPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/home" element={<HomePage />}></Route>
        <Route path="/forgetPass" element={<ResetPassPage />}></Route>
        {/* <Route path="/model"  element={<ModelPage />} ></Route> */}
        <Route path="/model" element={<MainPage />}></Route>
        <Route path="/modelview" element={<PlayerPage />}></Route>
      </Routes>
    </Router>
  );
};
export default App;
