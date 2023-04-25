import request from "../utils/request";

import config from "./config";

//数据列表
export function information(data) {
  return request({
    url: `${config.baseUrl}/v1/information`,
    method: "post",
    data,
    contentType: "formdata",
  });
}
//下载
export function taskdownload(data) {
  return request({
    url: `${config.baseUrl}/v1/taskdownload`,
    method: "get",
    params: data,
  });
}
