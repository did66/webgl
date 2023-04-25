import React, { useState, useEffect } from "react";
import "./Models.css";
import animated from "animate.css";
import Task from "../../objs/Task";
import TaskGrid from "../taskGrid/TaskGrid";
import {
  Menu,
  Tabs,
  Radio,
  Pagination,
  Modal,
  message,
  Upload,
  Input,
  Progress,
} from "antd";
import {
  MailOutlined,
  CaretRightOutlined,
  DoubleRightOutlined,
  AppstoreOutlined,
  CloseOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import NButton from "../NButton/NButton";
import axios from "axios";
import { information } from "../../api/model";

export default function Models() {
  const [activeButton, setActiveButton] = useState("queuing");
  const { TextArea } = Input;
  const [maskIsshow, setMaskIsshow] = useState("none");
  const [currStatusNum, setcurrStatusNum] = useState("0");
  const [currentModelStatus, setCurrentModelStatus] = useState("queue");

  const [currMenu, setCurrMenu] = useState("task");
  const [upLoadPercent, setUploadPercent] = useState(0);
  const [uploadStatus, setuploadStatus] = useState("");
  const [uploadTaskName, setUploadTaskName] = useState("");
  const [uploadTaskFileReferenceMap, setUploadTaskFileReferenceMap] = useState(
    []
  );
  const [currentFile, setCurrentFile] = useState("file");
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentPage, setcurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [showQuerryMenu, setQuerryMenu] = useState(true);
  const [leftTab, setLeftTab] = useState("tasks");
  const [modalText, setModalText] = useState("Submit Task");
  const showModal = () => {
    setModalText("上传任务");
    setOpen(true);
  };
  const [mode, setMode] = useState("top");
  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  const [total, setTotal] = useState(0);
  const [taskList, setTaskList] = useState([]);

  // setCurrMenu("task")
  function getNumFromStatus(status) {
    if (status == "queue") return "0";
    if (status == "process") return "1";
    if (status == "success") return "2";
    if (status == "fail") return "3";
    if (status == "all") return "4";
    return "0";
  }

  const onMenuClick = (event) => {
    setcurrentPage(1);
    setTotalPage(1);
    let currmodelstatus = event.target.getAttribute("data-currmodelstatus");
    if (currmodelstatus == null || currmodelstatus == "") {
      return;
    }
    setCurrentModelStatus(currmodelstatus);
    setcurrStatusNum(getNumFromStatus(currmodelstatus));
    setcurrentPage(1);
    if (getNumFromStatus(currmodelstatus) == "4" && leftTab == "tasks") {
    } else {
      queryTask(getNumFromStatus(currmodelstatus), 1);
    }
  };

  const modelsClick = () => {
    setQuerryMenu(false);
    setLeftTab("models");
    queryTask("2", 1);
  };

  const tasksClick = () => {
    setQuerryMenu(true);
    setLeftTab("tasks");
  };

  let queryTask = function (currStatusNum, currentPage) {
    let upData = {
      user_id: sessionStorage.getItem("user_id"),
      status: currStatusNum,
      page_index: currentPage,
    };
    information(upData).then((res) => {
      setTaskList([]);
      let listPageData = res.data;
      let newTaskList = [];
      for (var i = 0; i < listPageData.length; i++) {
        newTaskList[i] = getTaskFromObj(listPageData[i]);
      }
      setTaskList(newTaskList);
      setTotalPage(res.total_page || 1);
    });
  };

  const [email, setEmail] = useState("");
  let inputStyle = {
    width: "100%",
    heigth: "70%",
    fontSize: "1.05rem",
  };
  let textAreaStyle = {
    width: "80%",
    heigth: "20%",
    fontSize: "1.05rem",
    marginBottom: "24px",
  };
  let feedbackSubmitButtonStyle = {
    marginRight: "8%",
    marginTop: "auto",
    marginBottom: "4px",
    padding: "1.5px",
    minWidth: "9%",
    height: "8%",
    width: "80%",
    fontSize: "1rem",
    borderRadius: "1.5rem",
  };

  const handleOk = () => {
    setModalText("Submitting Task ... ");
    setOpen(false);
    setConfirmLoading(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    console.log(currentPage, getNumFromStatus(currentModelStatus));
    setCurrMenu("tasks");
    setcurrentPage(1);
    queryTask(0, 1);
  }, []);

  const onChange = (pageNumber) => {
    setcurrentPage(pageNumber);
    if (leftTab == "models") {
      queryTask("2", pageNumber);
      return;
    }
    if (leftTab == "tasks" && getNumFromStatus(currentModelStatus) == "4") {
      return;
    } else {
      queryTask(getNumFromStatus(currentModelStatus), pageNumber);
      return;
    }
  };

  const handleClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const { Dragger } = Upload;
  let upData = new FormData();
  upData.append("task_name", uploadTaskName);
  upData.append("user_id", sessionStorage.getItem("user_id"));
  const draggerProps = {
    data: upData,
    beforeUpload: (file) => {
      upData.append("file", file);
      console.log("->>>>>>>>>", file);
      console.log(upData);

      return false;
    },

    onChange(info) {
      axios({
        url: "http://10.15.88.38:5008/api/v1/task",
        method: "post",
        headers: { Authorization: localStorage.getItem("token") },
        data: upData,
        onUploadProgress: function (progressEvent) {
          //原生获取上传进度的事件
          // if (progressEvent) {
          //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
          //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
          let upLoadProgress = (
            (progressEvent.loaded / progressEvent.total) *
            100
          ).toFixed(0); //实时获取上传进度
          console.log("------------->", upLoadProgress);
          setUploadPercent(upLoadProgress);
          // }
        },
      })
        .then(function (response) {
          // console.log("---------->",JSON.stringify(response.data));
          let data = response.data;
          if (data["code"] == "200" || data["code"] == 200) {
            console.log(">>>>", "sucess");
            message.success(`${info.file.name} file uploaded successfully.`);
            queryTask(0, 1);
          } else {
            message.error(`${info.file.name} file upload failed.`);
            setuploadStatus("exception");
          }
        })
        .catch(function (error) {
          message.error(error);
          setuploadStatus("exception");
        });
    },
    onDrop(e) {
      console.log("Dropped files", e);
    },
  };
  return (
    <div className="flex-row">
      <div className="menu-wrap">
        <div className="flex-col block-1">
          <div className="flex-row container-1">
            <img
              className="icon-menu-1"
              src={require("../../assets/images/img_3.png")}
            />
            <span
              className={`model ${currMenu === "tasks" ? "menu-active" : null}`}
              onClick={() => {
                setCurrMenu("tasks");
                tasksClick();
              }}
            >
              My Tasks
            </span>
          </div>
          <div className="flex-row container-2">
            <img
              className="icon-setting"
              src={require("../../assets/images/img_3.png")}
            />
            <span
              className={`model ${
                currMenu === "models" ? "menu-active" : null
              }`}
              onClick={() => {
                setCurrMenu("models");
                modelsClick();
              }}
            >
              My Models
            </span>
          </div>
          <div className="flex-row container-2">
            <img
              className="icon-setting"
              src={require("../../assets/images/img_4.png")}
            />
            <span
              className={`feed-back ${
                currMenu === "feed" ? "menu-active" : null
              }`}
              onClick={() => {
                setCurrMenu("feed");
              }}
            >
              Feed Back
            </span>
          </div>
        </div>
      </div>
      <div className="content-wrap">
        <div>
          {currMenu === "feed" ? (
            <div className="modelMain--feedback_container ">
              <div className="modelMain--feedbackForm">
                <div className="modelMain--feedbackForm_hintText">
                  <span>Feedback</span>
                </div>
                <div className="modelMain--feedbackForm_feedbackText">
                  <span>Leave your feedback and suggestions about NeuDim</span>
                </div>
                <div className="modelMain--feedbackForm_hintText">
                  <span>Contact email:</span>
                </div>
                <div className="modelMain--feedbackForm_email">
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    placeholder="email"
                    prefix={
                      <MailOutlined className="modelMain--feedbackForm_inputPrefix" />
                    }
                  />
                </div>
                <div className="modelMain--feedbackForm_hintText">
                  <span>Your Suggestion</span>
                </div>
                <TextArea
                  style={textAreaStyle}
                  rows={6}
                  placeholder="What's in your mind"
                  maxLength={6}
                />
                <NButton
                  buttonText="Submit"
                  addStyles={feedbackSubmitButtonStyle}
                  onClick={() => {}}
                ></NButton>
              </div>
            </div>
          ) : (
            <div className="content">
              {currMenu === "tasks" && (
                <div className="upload-btn">
                  <img
                    className="icon-upload"
                    src={require("../../assets/images/img_10.png")}
                  />
                  <span className="upload" onClick={showModal}>
                    Upload
                  </span>
                  {contextHolder}

                  <Modal
                    className="modelMain--task_upload_modal"
                    title=""
                    open={open}
                    onOk={handleOk}
                    style={{
                      minWidth: "45%",
                    }}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                  >
                    <div className="modelMain--task_upload_modal">
                      <p className="modelMain--task_upload_modal_submit_hint">
                        {modalText}
                      </p>
                      <div className="modelMain--task_upload_modal_name_input_container">
                        {/* <span className="modelMain--task_upload_modal_name_input_hint">Task name: </span> */}
                        <Input
                          value={uploadTaskName}
                          onChange={(e) => setUploadTaskName(e.target.value)}
                          // style={taskNameInputStyle}
                          placeholder="文件名"
                          prefix={
                            <AppstoreOutlined className="modelMain--task_upload_modal_name_input_prefix" />
                          }
                        />
                      </div>
                      <div>
                        <Tabs
                          defaultActiveKey="2"
                          tabPosition="left"
                          style={{
                            height: 100,
                          }}
                          items={new Array(2).fill(null).map((_, i) => {
                            const id = String(i);
                            return {
                              label:
                                i == 1 ? "视频文件说明" : "图片zip文件说明",
                              key: id,
                              // disabled: i === 10,
                              children:
                                i == 1 ? (
                                  <React.Fragment>
                                    <p>
                                      <span
                                        style={{
                                          fontWeights: "blod",
                                          fontSize: "10px",
                                        }}
                                      >
                                        *
                                      </span>
                                      视频格式支持后缀为MP4，MOV，AVI的文件
                                    </p>
                                    <p>
                                      <span>*</span>视频时长不可超过120秒
                                    </p>
                                    {/* <p>视频文件后缀可以是mp4，mov，avi</p> */}
                                  </React.Fragment>
                                ) : (
                                  <React.Fragment>
                                    <p>
                                      <span>*</span>
                                      压缩包内需包含文件名为images的文件夹和transforms.json文件
                                    </p>
                                    <p>
                                      <span>*</span>images里包含需重建的图片
                                    </p>
                                    {/* <p>*图片仅支持zip文件上传</p> */}
                                  </React.Fragment>
                                ),
                            };
                          })}
                        />
                      </div>
                      <hr />
                      {upLoadPercent > 0 && (
                        <Progress
                          percent={upLoadPercent}
                          status={uploadStatus}
                        />
                      )}
                      <Dragger {...draggerProps}>
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">点击上传文件</p>
                        <p className="ant-upload-hint">支持文件拖拽上传</p>
                      </Dragger>
                    </div>
                  </Modal>
                </div>
              )}

              {showQuerryMenu ? (
                <div className="nav-wrap" onClick={(e) => onMenuClick(e)}>
                  <div
                    className="flex-row container-item-1"
                    data-currmodelstatus="queue"
                    onClick={() => {
                      setCurrentModelStatus("queue");
                    }}
                  >
                    <img
                      data-currmodelstatus="queue"
                      className="icon-list"
                      src={
                        activeButton === "queuing"
                          ? require("../../assets/images/img_6_active.png")
                          : require("../../assets/images/img_6.png")
                      }
                    />
                    <div
                      className={`queuing ${
                        activeButton === "queuing" ? "button-active" : ""
                      }`}
                      onClick={() => handleClick("queuing")}
                      style={{ cursor: "pointer", display: "inline-block" }}
                    >
                      <span data-currmodelstatus="queue" className="queuing">
                        Queuing
                      </span>
                    </div>
                  </div>
                  <div
                    className="flex-row container-item-2"
                    data-currmodelstatus="process"
                    onClick={() => {
                      setCurrentModelStatus("process");
                    }}
                  >
                    <img
                      data-currmodelstatus="process"
                      className="icon-close"
                      src={
                        activeButton === "processing"
                          ? require("../../assets/images/img_7_active.png")
                          : require("../../assets/images/img_7.png")
                      }
                    />
                    <div
                      className={`processing ${
                        activeButton === "processing" ? "button-active" : ""
                      }`}
                      onClick={() => handleClick("processing")}
                      style={{ cursor: "pointer", display: "inline-block" }}
                    >
                      <span data-currmodelstatus="process">Processing</span>
                    </div>
                  </div>
                  <div
                    className="flex-row container-item-3"
                    data-currmodelstatus="success"
                    onClick={() => {
                      setCurrentModelStatus("success");
                    }}
                  >
                    <img
                      data-currmodelstatus="success"
                      className="icon-complete"
                      src={
                        activeButton === "succeeded"
                          ? require("../../assets/images/img_8_active.png")
                          : require("../../assets/images/img_8.png")
                      }
                    />
                    <div
                      className={`succeeded ${
                        activeButton === "succeeded" ? "button-active" : ""
                      }`}
                      onClick={() => handleClick("succeeded")}
                      style={{ cursor: "pointer", display: "inline-block" }}
                    >
                      <span data-currmodelstatus="success">Succeeded</span>
                    </div>
                  </div>
                  <div
                    className="flex-row container-item-4"
                    data-currmodelstatus="fail"
                    onClick={() => {
                      setCurrentModelStatus("fail");
                    }}
                  >
                    <img
                      data-currmodelstatus="fail"
                      className="icon-close-1"
                      src={
                        activeButton === "failed"
                          ? require("../../assets/images/img_9_active.png")
                          : require("../../assets/images/img_9.png")
                      }
                    />
                    <div
                      className={`failed ${
                        activeButton === "failed" ? "button-active" : ""
                      }`}
                      onClick={() => handleClick("failed")}
                      style={{ cursor: "pointer", display: "inline-block" }}
                    >
                      <span data-currmodelstatus="fail">Failed</span>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="task-list-wrap">
                <TaskGrid taskList={taskList}></TaskGrid>
              </div>
              <div className="block-4">
                <Pagination
                  current={currentPage}
                  pageSize={6}
                  onChange={onChange}
                  total={totalPage * 6}
                />
                <br />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getTaskFromObj(taskObj) {
  return new Task(
    // taskObj["file"],
    taskObj["cover"],
    taskObj["download_link"],
    taskObj["name"],
    taskObj["status"],
    taskObj["task_id"]

    // "2023-01-01 00:00:00",
    // "http://10.15.88.38:5008/api/v1/taskdownload?task_id=" + taskObj["task_id"],
    // "process fail"
  );
}
