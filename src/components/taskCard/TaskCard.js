import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import React, { Fragment } from "react";
import "./TaskCard.css";
import { Avatar, Card } from "antd";
const { Meta } = Card;
const TaskCard = () => (
  <Fragment>
    <div className="flex-col col-item-0">
      <div className="img-wrap">
        <div className="img-wrap">
          <img
            className="entry-pic"
            src={require("../../assets/images/img_11.png")}
          />
        </div>
      </div>
      <div
        className="mask animate__fadeIn"

        // style={{display:maskIsshow}}
      >
        <div className="mask-icon-container">
          <DoubleRightOutlined style={{ fontSize: "30px" }} rotate="-90" />
        </div>
        <div className="mask-icon-container">
          <CloseOutlined style={{ fontSize: "30px" }} />
        </div>
      </div>
      <div className="flex-row group-2">
        <span className="house">House_1</span>
        <div className="flex-row failed-wrapper">
          <img
            className="icon-circle"
            src={require("../../assets/images/img_12.png")}
          />
          <span className="failed-1">Failed</span>
        </div>
      </div>
    </div>

    <div className="flex-col col-item-1">
      <img
        className="entry-pic-1"
        src={require("../../assets/images/img_13.png")}
      />
      <div className="flex-row group-3">
        <span className="house-1">House_2</span>
        <div className="flex-row processing-wrapper">
          <img
            className="icon-circle-1"
            src={require("../../assets/images/img_14.png")}
          />
          <span className="processing-1">Processing</span>
        </div>
      </div>
    </div>

    <div className="flex-col col-item-2">
      <img
        className="entry-pic-2"
        src={require("../../assets/images/img_15.png")}
      />
      <div className="flex-row group-4">
        <span className="house-2">House_3</span>
        <div className="flex-row succeeded-wrapper">
          <img
            className="icon-circle-2"
            src={require("../../assets/images/img_16.png")}
          />
          <span className="succeeded-1">Succeeded</span>
        </div>
      </div>
    </div>
  </Fragment>
);
export default TaskCard;
