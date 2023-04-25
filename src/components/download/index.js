import React, { useMemo, useEffect, useState } from "react";
import { Modal, Select } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import "./download.css";
import { taskdownload } from "../../api/model";

export default function DownloadDialog(props) {
  const [isModalOpen, seIsModalOpen] = useState(true);

  const task = useMemo(() => {
    return props.task;
  }, [props.task]);
  const handleCancel = () => {
    seIsModalOpen(false);
    props.closeDownloadDialog();
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    let data = {
      task_id: task.task_id,
      download_type: value,
    };
    taskdownload(data).then((res) => {
      window.open(res.link, "_blank");
    });
  };
  const [videoList, setVideoList] = useState([]);

  const downloadVideo = (url) => {
    window.open(url, "_blank");
  };

  useEffect(() => {
    let list = [
      {
        id: "video_01",
        videoUrl:
          "https://cdn-luma.com/ea3992ae9c5cceb953377345754c870d9d5dfb0d388371e0a8efef63d1c0b326.mp4",
        poster:
          "https://cdn-luma.com/eb300df05552e9faa148a5351c704556195250bca51952804d5bc528ef43e350.jpg",
      },
    ];
    setVideoList(list);
  }, []);

  const videoPlay = (id) => {
    const video = document.getElementById(id);
    video.play();
  };
  const videoPause = (id) => {
    const video = document.getElementById(id);
    video.pause();
  };

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState({});
  const previewVideoAct = (item) => {
    setIsPreviewOpen(true);
    setPreviewVideo(item);
  };

  const closePreviewDialog = () => {
    setIsPreviewOpen(false);
  };

  return (
    <>
      <Modal
        title="下载"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width="700px"
      >
        <ul>
          <li>纹理贴图的⼏何模型，提供obj/ply等⽂件格式。</li>
          <li>⾃动⽣成的渲染视频或者⽤户⾃定义的渲染视频。</li>
        </ul>
        <div className="download-item-wrap">
          <div>
            <div className="download-item">
              <Select
                style={{ width: 150 }}
                onChange={handleChange}
                placeholder="请选择下载文件"
                options={[
                  { value: "obj", label: "OBJ" },
                  { value: "video", label: "VIDEO" },
                  { value: "nd", label: "ND" },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="download-item-wrap">
          <div className="download-title">NeuDim渲染引擎</div>
          <p>NeRF Filed⽂件，可以加载到NeuDim⾃研的NeRF渲染引擎中。</p>
          <ul>
            <li>⽀持本地化渲染;</li>
            <li>⽀持更加丰富的运镜特效;</li>
            <li>⽀持NeRF场景的编辑与⻛格化;</li>
          </ul>
        </div>
        <div className="download-item-wrap">
          <div className="download-title">视频渲染</div>
          <div className="video-wrap">
            {videoList.map((item, index) => {
              return (
                <div
                  className="video-item"
                  key={index}
                  onMouseEnter={() => {
                    videoPlay(item.id);
                  }}
                  onMouseLeave={() => {
                    videoPause(item.id);
                  }}
                  onClick={() => {
                    previewVideoAct(item);
                  }}
                >
                  <video
                    id={item.id}
                    className="download-video"
                    loop
                    poster={item.poster}
                    src={item.videoUrl}
                  ></video>
                  <div
                    className="download-btn-01"
                    onClick={() => {
                      downloadVideo(item.videoUrl);
                    }}
                  >
                    <DownloadOutlined />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      <Modal
        open={isPreviewOpen}
        onCancel={closePreviewDialog}
        footer={null}
        width="800px"
      >
        <h3 className="preview-dialog-title">预览</h3>
        <div className="preview-video-wrap">
          <video
            className="preview-video"
            loop
            autoPlay
            controls
            poster={previewVideo.poster}
            src={previewVideo.videoUrl}
          ></video>
        </div>
        <div
          className="preview-btn"
          onClick={() => {
            downloadVideo(previewVideo.videoUrl);
          }}
        >
          <DownloadOutlined />
          <i>下载</i>
        </div>
      </Modal>
    </>
  );
}
