import React from "react";
import Header from "../components/Header/Header";
import Default from "../components/defaultPage/Default";


export default function HomePage(props) {
    return (
        <div className="DefaultPage">
          <Header></Header>
          <Default></Default>
        </div>
    )
}