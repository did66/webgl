import React, { useState, useEffect } from "react";
import NButton from "../NButton/NButton";
import { backServer, jumpToViewPage } from "../../utils/linkUtil";
import { Menu, Pagination, Modal, message, Tooltip, Upload, Input } from "antd";
import DownloadDialog from "../download/index";
import {
  PlayCircleOutlined,
  EyeOutlined,
  PauseOutlined,
  DownloadOutlined,
  CopyOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  CaretRightOutlined,
  DoubleRightOutlined,
  RedoOutlined,
} from "@ant-design/icons";
// import './TaskCard.css'
import Axios from "axios";
import placeHolderImage from "../../assets/place.svg";

import { Avatar, Card } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
const { Meta } = Card;

export default function TaskCard(props) {
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [curTask, setCurTask] = useState({});

  const handleIconClick = () => {
    setIsPlaying(!isPlaying);
  };
  const [messageApi, contextHolder] = message.useMessage();
  const [task, setTaskList] = useState([]);
  // let task = props.task
  useEffect(() => {
    setTaskList(props.task);
  });

  // console.log(">>>>>>>>>task",task);

  let buttonSytles = {
    minWidth: "24%",
    height: "45%",
    padding: "7px",
    borderRadius: "1.5rem",
  };

  let iconStyle = {
    color: "#1E90FF",
    fontWeight: "500",
  };

  function download(url, filename) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  }

  function openViewer() {
    jumpToViewPage();
  }

  const axios = Axios.create();

  function downloadFile(filePath, filename) {
    axios
      .post(filePath, "", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", //请求的数据类型为form data格式
        },
        responseType: "blob", //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
      })
      .then(function (response) {
        const blob = new Blob([response.data]);
        const fileName = filename;
        const linkNode = document.createElement("a");
        linkNode.download = fileName; //a标签的download属性规定下载文件的名称
        linkNode.style.display = "none";
        linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
        document.body.appendChild(linkNode);
        linkNode.click(); //模拟在按钮上的一次鼠标单击
        URL.revokeObjectURL(linkNode.href); // 释放URL 对象
        document.body.removeChild(linkNode);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function submitProcess(taskId) {
    let formData = new FormData();
    formData.append("task_id", taskId);
    formData.append("generate_model", "True");
    formData.append("save_snapshot", "False");

    const requestOptions = {
      method: "POST",
      headers: { Authorization: localStorage.getItem("token") },
      body: formData,
    };

    // fetch(backServer + '/api/model/task/submitProcess', requestOptions)
    fetch("http://10.15.88.38:5008/api/v1/taskstarting", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data["code"] == "200") {
          messageApi.open({
            type: "success",
            content: "task submit process success",
          });
          setTaskList(task.filter((item) => item.task_id !== taskId));
        } else {
          messageApi.open({
            type: "error",
            content: data["msg"],
          });
        }
      });
  }

  function getQueueingInfo(task) {
    return (
      <>
        <div className="flex-col col-item-0">
          <div className="img-wrap">
            <img
              className="entry-pic"
              src={task.coverUrl}
              // onMouseEnter= {()=>{setMaskIsshow("block")}}
              // onMouseLeave = {()=>{setMaskIsshow("none")}}
            />
          </div>
          <div
            className="mask animate__fadeIn"

            // style={{display:maskIsshow}}
          >
            <div className="mask-icon-container">
              <DoubleRightOutlined
                style={{ fontSize: "30px" }}
                rotate="-90"
                onClick={() => {
                  submitProcess(task.task_id);
                }}
              />
            </div>
            <div className="mask-icon-container">
              <CloseOutlined style={{ fontSize: "30px" }} />
            </div>
          </div>

          <div className="flex-row group-2">
            <span className="item-name">{task.name}</span>
            <div className="flex-row failed-wrapper">
              <img
                className="icon-circle"
                src={require("../../assets/images/img_18.png")}
              />
              <span className="failed-1">Queuing</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  function getProcessingInfo(task) {
    return (
      <div className="flex-col col-item-0">
        <div className="img-wrap">
          <img
            className="entry-pic"
            src={task.coverUrl}
            // onMouseEnter= {()=>{setMaskIsshow("block")}}
            // onMouseLeave = {()=>{setMaskIsshow("none")}}
          />
        </div>
        <div
          className="mask animate__fadeIn"

          // style={{display:maskIsshow}}
        >
          {isPlaying ? (
            <div className="mask-icon-container">
              <PauseOutlined
                style={{ fontSize: "30px" }}
                onClick={handleIconClick}
              />
              <span className="mask-text">zan't</span>
            </div>
          ) : (
            <div className="mask-icon-container">
              <CaretRightOutlined
                style={{ fontSize: "30px" }}
                onClick={handleIconClick}
              />
              <span className="mask-text">继续</span>
            </div>
          )}
          <div className="mask-icon-container">
            <CloseOutlined style={{ fontSize: "30px" }} />
            <span className="mask-text">取消</span>
          </div>
        </div>

        <div className="flex-row group-2">
          <span className="item-name">{task.name}</span>
          <div className="flex-row failed-wrapper">
            <img
              className="icon-circle"
              src={require("../../assets/images/img_14.png")}
            />
            <span className="failed-1">Processing</span>
          </div>
        </div>
      </div>
    );
  }

  function getAllInfo(task) {
    return (
      <div className="flex-col col-item-0">
        <div className="img-wrap">
          <img className="entry-pic" src={task.coverUrl} />
        </div>

        <div
          className="mask animate__fadeIn"

          // style={{display:maskIsshow}}
        >
          <div className="mask-icon-container">
            <CloseOutlined style={{ fontSize: "30px" }} />
            <span className="mask-text">取消</span>
          </div>
        </div>

        <div className="flex-row group-2">
          <span className="item-name">{task.name}</span>
          <div className="flex-row failed-wrapper">
            <img
              className="icon-circle"
              src={require("../../assets/images/img_18.png")}
            />
            <span className="failed-1">Queuing</span>
          </div>
        </div>
      </div>
    );
  }

  function getSucceededInfo(task) {
    return (
      <>
        <div className="flex-col col-item-0">
          <div className="img-wrap">
            <img
              className="entry-pic"
              src={task.coverUrl}
              // onMouseEnter= {()=>{setMaskIsshow("block")}}
              // onMouseLeave = {()=>{setMaskIsshow("none")}}
            />
          </div>
          <div
            className="mask animate__fadeIn"

            // style={{display:maskIsshow}}
          >
            <div className="mask-icon-container">
              <DownloadOutlined
                style={{ fontSize: "30px" }}
                onClick={() => {
                  setCurTask(task);
                  setShowDownloadDialog(true);
                }}
              />
              <span className="mask-text">下载</span>
            </div>
            <div className="mask-icon-container">
              <PlayCircleOutlined
                onClick={() => {
                  openViewer();
                }}
                style={{ fontSize: "30px" }}
              />
              <span className="mask-text">预览</span>
            </div>
          </div>

          <div className="flex-row group-2">
            <span className="item-name">{task.name}</span>
            <div className="flex-row failed-wrapper">
              <img
                className="icon-circle"
                src={require("../../assets/images/img_16.png")}
              />
              <span className="failed-1">Succeeded</span>
            </div>
          </div>
        </div>
        {showDownloadDialog && (
          <DownloadDialog
            task={curTask}
            closeDownloadDialog={() => {
              setShowDownloadDialog(false);
            }}
          />
        )}
      </>
    );
  }

  function getFailedInfo(task) {
    return (
      <div className="flex-col col-item-0">
        <div className="img-wrap">
          <img
            className="entry-pic"
            src={placeHolderImage}
            // onMouseEnter= {()=>{setMaskIsshow("block")}}
            // onMouseLeave = {()=>{setMaskIsshow("none")}}
          />
        </div>
        <div
          className="mask animate__fadeIn"

          // style={{display:maskIsshow}}
        >
          <div className="mask-icon-container">
            <RedoOutlined style={{ fontSize: "30px" }} />
            <span className="mask-text">重新上传</span>
          </div>
          <div className="mask-icon-container">
            <span className="mask-text">取消</span>
            <CloseOutlined style={{ fontSize: "30px" }} />
          </div>
        </div>

        <div className="flex-row group-2">
          <span className="item-name">{task.name}</span>
          <div className="flex-row failed-wrapper">
            <img
              className="icon-circle"
              src={require("../../assets/images/img_12.png")}
            />
            <span className="failed-1">Failed</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {contextHolder}
      {/* <div className="taskCard--cover_container">
              <img className="taskCard--cover" src={task.coverUrl} alt=""></img>
          </div> */}
      {task.status === "0" && getQueueingInfo(task)}
      {task.status === "1" && getProcessingInfo(task)}
      {task.status === "2" && getSucceededInfo(task)}
      {task.status === "3" && getFailedInfo(task)}
      {/* {
              task.status === "4" && getAllInfo(task)
          } */}
    </div>
  );
}
