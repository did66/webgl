import { message } from "antd";
import axios from "axios";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: "",
  // 超时
  timeout: 1000 * 60 * 10,
});
// request拦截器
service.interceptors.request.use(
  (config) => {
    if (!config.notAuth) {
      if (localStorage.getItem("token")) {
        config.headers.Authorization = localStorage.getItem("token");
      }
    }
    //formdata数据格式
    if (config.contentType == "formdata") {
      config.headers["Content-Type"] = "multipart/form-data;";
      let param = new FormData();
      for (var k in config.data) {
        if (Array.isArray(config.data[k])) {
          config.data[k].map((item) => {
            param.append(k, item);
          });
        } else {
          param.append(k, config.data[k]);
        }
      }
      config.data = param;
    }
    console.log("config", config);
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);
// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || "200";

    // 获取错误信息
    // 二进制数据则直接返回
    if (
      res.request.responseType === "blob" ||
      res.request.responseType === "arraybuffer"
    ) {
      return res.data;
    }
    //token失效
    if (code === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else if (code == 200) {
      return res.data;
    } else {
      message.error(res.data.msg);
    }
    return undefined;
  },
  (error) => {
    const msg = error.msg;
    message.error(msg);
    return Promise.reject(error);
  }
);

export default service;
