import request from "../utils/request";

import config from "./config";

//登录
export function login(data) {
  return request({
    url: `${config.baseUrl}/user/login`,
    method: "post",
    data,
    contentType: "formdata",
  });
}
