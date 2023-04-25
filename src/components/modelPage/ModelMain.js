import React, { useState, useEffect } from "react";
import {
  AlertOutlined,
  AppstoreOutlined,
  MailOutlined,
  CopyOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { backServer } from "../../utils/linkUtil";
import { Menu, Pagination, Modal, message, Upload, Input } from "antd";
import Task from "../../objs/Task";
import "./ModelMain.css";
import TaskGrid from "../taskGrid/TaskGrid";
import NButton from "../NButton/NButton";

export default function ModelMain(props) {
  const [uploadTaskName, setUploadTaskName] = useState("");
  const [uploadTaskFileReferenceMap, setUploadTaskFileReferenceMap] = useState(
    []
  );
  const [currentModelStatus, setCurrentModelStatus] = useState("queue");
  const [currentFile, setCurrentFile] = useState("file");
  const [messageApi, contextHolder] = message.useMessage();

  const { TextArea } = Input;

  // upload task modal
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showQuerryMenu, setQuerryMenu] = useState(false);
  // showQuerryMenu
  const [modalText, setModalText] = useState("Submit Task");
  const showModal = () => {
    setModalText("Submit Task");
    setOpen(true);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [taskList, setTaskList] = useState([]);

  const [leftTab, setLeftTab] = useState("model");
  let modelClass = "modelMain--vertical_slide_menu_model_menu_unselected";
  let feedbackClass = "modelMain--vertical_slide_menu_model_menu_unselected";
  if (leftTab === "model") {
    modelClass = "modelMain--vertical_slide_menu_model_menu";
  } else {
    feedbackClass = "modelMain--vertical_slide_menu_model_menu";
  }

  function getNumFromStatus(status) {
    if (status == "queue") return "0";
    if (status == "process") return "1";
    if (status == "success") return "2";
    if (status == "fail") return "3";
    return "0";
  }

  let createTask = function () {
    console.log("create Task start");
    let uploadTaskFileReferenceList = uploadTaskFileReferenceMap;
    console.log("uploadTaskFileReferenceMap: " + uploadTaskFileReferenceMap);
    uploadTaskFileReferenceMap.forEach((element) => {
      uploadTaskFileReferenceList.add(element);
    });
    let formData = new FormData();
    // formData.append('name', uploadTaskName);
    formData.append("file", uploadTaskFileReferenceList[0]);

    formData.append("user_id", "6897c046-ce69-539f-2054-8af03d46422b");
    // formData.append('reference', uploadTaskFileReferenceList[0]);

    const requestOptions = {
      method: "POST",
      // headers: { 'Authorization': localStorage.getItem('token') },
      body: formData,
    };
    fetch("http://10.15.88.38:5008/api/v1/task", requestOptions)
      // fetch(backServer + "/api/model/task/create", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log();
        // return
        if (data["code"] == 200) {
          messageApi.open({
            type: "success",
            content: "task create success",
          });
        } else {
          messageApi.open({
            type: "error",
            content: data["msg"],
          });
        }
        setOpen(false);
        setConfirmLoading(false);
      });
  };

  const handleOk = () => {
    console.log("handle ok called");
    setModalText("Submitting Task ... ");

    console.log("handle ok start");
    // createTask();
    queryTask("0", getNumFromStatus());
    setOpen(false);
    setConfirmLoading(false);
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  // file upload dragger
  const { Dragger } = Upload;
  let upData = new FormData();
  upData.append("task_name", uploadTaskName);
  // upData.append('file', uploadTaskFileReferenceMap[0]);
  upData.append("user_id", "6897c046-ce69-539f-2054-8af03d46422b");
  // formData.append('reference', uploadTaskFileReferenceList[0]);
  const draggerProps = {
    // name: 'file',
    // multiple: false,
    // action: backServer + '/api/model/upload',
    // method:"POST",
    // action: "http://10.15.88.38:5008/api/v1/task",
    // headers: {
    //     authorization: localStorage.getItem('token'),
    // },
    data: upData,

    beforeUpload: (file) => {
      //    const isPNG = file.type === 'image/png';
      //    if (!isPNG) {
      //     message.error(`${file.name} is not a png file`);
      //     }
      //     return isPNG || Upload.LIST_IGNORE;
      upData.append("file", file);
      console.log("->>>>>>>>>", file);
      console.log(upData);

      return false;
    },

    onChange(info) {
      // console.log(info);
      const requestOptions = {
        method: "POST",
        // headers: { 'Authorization': localStorage.getItem('token') },
        body: upData,
      };
      setCurrentFile(info.file);
      fetch("http://10.15.88.38:5008/api/v1/task", requestOptions)
        // fetch(backServer + "/api/model/task/create", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          console.log();
          if (data["code"] == 200) {
            console.log(">>>>", "sucess");
            message.success(`${info.file.name} file uploaded successfully.`);
            let fileUid = originFileObj.uid;
            let tempMap = uploadTaskFileReferenceMap;
            tempMap[tempMap.length] = response.data.reference;
            setUploadTaskFileReferenceMap(tempMap);
          } else {
            message.error(`${info.file.name} file upload failed.`);
          }
          setOpen(false);
          setConfirmLoading(false);
        });

      const { status, originFileObj, response } = info.file;
      // console.log(">>>>>>>>>>>>>>>",info.file);
      // // console.log('status: ' + status);
      if (status !== "uploading") {
        console.log("uploading", info.file, info.fileList);
      }
      // if (status === 'done') {
      //     console.log("---------------",response.code);

      // }

      // if (status === 'done' && response !== undefined && response.code == 200) {
      //     console.log(">>>>","sucess");
      //     message.success(`${info.file.name} file uploaded successfully.`);
      //     let fileUid = originFileObj.uid;
      //     let tempMap = uploadTaskFileReferenceMap;
      //     tempMap[tempMap.length] = response.data.reference
      //     setUploadTaskFileReferenceMap(
      //         tempMap
      //     )
      //     // console.log('fileUid: ' + fileUid)
      //     // console.log(uploadTaskFileReferenceMap)
      // } else if (status === 'error') {
      //     message.error(`${info.file.name} file upload failed.`);
      // }
    },
    onDrop(e) {
      console.log("Dropped files", e);
    },
  };

  let queryTask = function (pageNum = "0", currentStatus) {
    let upData = new FormData();
    upData.append("user_id", "6897c046-ce69-539f-2054-8af03d46422b");
    upData.append("status", currentStatus);
    const requestOptions = {
      method: "POST",
      body: upData,
      // headers: { 'Authorization': localStorage.getItem('token') }
    };
    console.log(currentStatus);
    // console.log(backServer + '/api/model/task/query?status=' + getNumFromStatus(currentStatus) + '&page_num=' + (pageNum - 1) + '&page_size=8', requestOptions);
    // fetch("http://10.15.88.38:5008/api/v1/information", requestOptions)
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log("info",data);
    //         if (data['code'] == 200) {
    //             console.log("query data",data['data']);
    //             let listPageData = data['data'];
    //             // setTotal(listPageData['total']);
    //             if (listPageData == null || listPageData == []) {
    //                 setTaskList([]);
    //                 // console.log("无请求数据");
    //                 // console.log("{{{{{{{{{}}}}}}}}}}}}}}}}");
    //             } else {
    //                 // console.log("[[[[[[[[[[[[]]]]]]]]]]]]");
    //                 let newTaskList = [];
    //                 // for (var i = 0; i < listPageData['list'].length; i++) {
    //                 for (var i = 0; i<listPageData.length; i++) {
    //                     newTaskList[i] = getTaskFromObj(listPageData[i],currentStatus);
    //                 }
    //                 console.log(">>>>>>>>>>>>>>>>>newTaskList",newTaskList);
    //                 setTaskList(newTaskList);
    //             }
    //             messageApi.open({
    //                 type: 'success',
    //                 content: 'task query success',
    //             });
    //         } else {
    //             setTaskList([]);
    //             // messageApi.open({
    //             //     type: 'error',
    //             //     content: data['msg'],
    //             //   });
    //         }
    //     });
  };

  let onPageChange = function (page, pageSize) {
    setCurrentPage(page);
    queryTask(page, currentModelStatus);
    // queryTask(page, currentModelStatus);
  };

  useEffect(() => {
    console.log("page load");
    // queryTask(currentPage, currentModelStatus)
    queryTask("0", getNumFromStatus());
  }, []);

  const iconStyle = {
    fontSize: "1.15rem",
  };

  const statusItems = [
    {
      label: "Queuing",
      // key: 'queue',
      key: "0",
      icon: (
        <CopyOutlined
          className="modelMain--models_container_status_menu_icon"
          style={iconStyle}
        />
      ),
      style: { marginLeft: "2.5%", marginRight: "6%" },
    },
    {
      label: "Processing",
      key: "1",
      icon: (
        <ClockCircleOutlined
          className="modelMain--models_container_status_menu_icon"
          style={iconStyle}
        />
      ),
      style: { marginRight: "6%" },
    },
    {
      label: "Succeeded",
      key: "2",
      icon: (
        <CheckOutlined
          className="modelMain--models_container_status_menu_icon"
          style={iconStyle}
        />
      ),
      style: { marginRight: "6%" },
    },
    {
      label: "Failed",
      key: "3",
      icon: (
        <CloseOutlined
          className="modelMain--models_container_status_menu_icon"
          style={iconStyle}
        />
      ),
      style: { marginRight: "6%" },
    },
  ];

  const onMenuClick = (e) => {
    console.log("click ", e);
    setCurrentModelStatus(e.key);
    setCurrentPage(1);
    queryTask("0", e.key);
  };

  let uploadTaskButtonStyle = {
    marginRight: "8%",
    marginTop: "auto",
    marginBottom: "4px",
    padding: "4.5px 9px 4.5px 9px",
    minWidth: "9%",
    height: "50%",
    fontSize: "1rem",
    borderRadius: "0.4rem",
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

  let taskNameInputStyle = {
    width: "100%",
    heigth: "70%",
    fontSize: "1.15rem",
  };

  // feedback info
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

  return (
    <div className="modelMain">
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
              style={taskNameInputStyle}
              placeholder="Give a task name"
              prefix={
                <AppstoreOutlined className="modelMain--task_upload_modal_name_input_prefix" />
              }
            />
          </div>
          <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from
              uploading company data or other band files
            </p>
          </Dragger>
        </div>
      </Modal>
      <div className="modelMain--vertical_slide_menu">
        <div
          className={modelClass}
          onClick={() => {
            queryTask("0", "2");
            setQuerryMenu(false);
          }}
        >
          <AppstoreOutlined className="modelMain--vertical_slide_menu_model_menu_icon" />
          <span>My Model</span>
        </div>
        <div
          className={modelClass}
          onClick={() => {
            setLeftTab("model");
            setQuerryMenu(true);
          }}
        >
          <AppstoreOutlined className="modelMain--vertical_slide_menu_model_menu_icon" />
          <span>My &nbsp; Task</span>
          <span> </span>
        </div>
        <div className={feedbackClass} onClick={() => setLeftTab("feedback")}>
          <AlertOutlined className="modelMain--vertical_slide_menu_model_menu_icon" />
          <span>FeedBack</span>
        </div>
      </div>
      {leftTab === "model" && (
        <div className="modelMain--models_container">
          {showQuerryMenu ? (
            <div className="modelMain--models_container_menu_container">
              <Menu
                onClick={onMenuClick}
                className="modelMain--models_container_status_menu"
                // selectedKeys="success"
                selectedKeys={[currentModelStatus]}
                mode="horizontal"
                items={statusItems}
              />
              {
                // currentModelStatus === '0' &&
                <NButton
                  suffixIcon="CloudUploadOutlined"
                  buttonText="Upload Task"
                  addStyles={uploadTaskButtonStyle}
                  onClick={showModal}
                ></NButton>
              }
            </div>
          ) : null}

          <div className="modelMain--models_container_card_container">
            <TaskGrid taskList={taskList}></TaskGrid>
            <div className="modelMain--models_container_card_pagination_container">
              <Pagination
                style={{ fontSize: "1.35rem" }}
                defaultCurrent={1}
                current={currentPage}
                total={total}
                defaultPageSize={8}
                pageSize={8}
                onChange={onPageChange}
              ></Pagination>
            </div>
          </div>
        </div>
      )}
      {leftTab === "feedback" && (
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
      )}
    </div>
  );
}

function getTaskFromObj(taskObj, currentStatus) {
  return new Task(
    // taskObj["file"],
    taskObj["task_id"],
    taskObj["name"],
    taskObj["cover"],
    (taskObj["status"] = currentStatus),
    taskObj["download_link"]

    // "2023-01-01 00:00:00",
    // "http://10.15.88.38:5008/api/v1/taskdownload?task_id=" + taskObj["task_id"],
    // "process fail"
  );
}
