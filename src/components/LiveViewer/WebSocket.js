/* eslint-disable */
class WebSocketHub {
  ws = null;
  #alive = false;
  #params = null;
  #heart_timer = null;
  #message_func = null;
  heartBeat = 50000;
  heartMsg = "hello";
  constructor(params) {
    this.#params = params;
    this.init();
  }
  init() {
    clearInterval(this.#heart_timer);
    let params = this.#params;
    let { url, port } = params;
    let global_params = ["heartBeat", "heartMsg", "msgType", "debug"];
    Object.keys(params).forEach((key) => {
      if (global_params.indexOf(key) !== -1) {
        this[key] = params[key];
      }
    });
    let ws_url = port ? url + ":" + port : url;
    delete this.ws;
    this.ws = new WebSocket(ws_url);
    if (this.#message_func) {
      this.onmessage(this.#message_func);
    }
    this.ws.onopen = () => {
      this.#alive = true;
      this.onheartbeat();
    };
    this.ws.onclose = () => {
      this.#alive = false;
      clearInterval(this.#heart_timer);
    };
  }
  onheartbeat(func) {
    if (true == this.#alive) {
      this.#heart_timer = setInterval(() => {
        this.send(this.heartMsg);
        func ? func(this) : false;
      }, this.heartBeat);
    }
  }
  send(msg) {
    if (this.debug) {
      console.log("debug sended", JSON.stringify(msg));
    }

    console.log(msg.msgType);
    switch (this.msgType) {
      case "Blob":
        const temp = JSON.stringify(msg);
        const encoded = new TextEncoder("UTF-16").encode(temp);
        this.ws.send(encoded);
        break;
      case "String":
        msg = typeof msg == "string" ? msg : JSON.stringify(msg);
        this.ws.send(msg);
        break;
      case "JSON":
        msg =
          typeof msg == "string"
            ? {
                data: msg,
                msg: "default",
                code: 1,
              }
            : JSON.stringify(msg);
        this.ws.send(msg);
        break;
      default:
        msg = typeof msg == "string" ? msg : JSON.stringify(msg);
        this.ws.send(msg);
        break;
    }
  }
  close() {
    if (true == this.#alive) {
      this.ws.close();
    }
  }
  onmessage(func, all = false) {
    console.log("WebSocket onmessage");
    this.ws.onmessage = async (data) => {
      this.#message_func = func;
      try {

        let resultData = !all ? data.data : data;
        // const res = await resultData.text()
        const res = await resultData
        if (this.debug) {
          console.info("debug revice", res, JSON.stringify(res));
        }
        func(JSON.parse(res));
      } catch (e) {
        console.error(e);
      }
    };
  }

  onopen(func) {
    this.ws.onopen = (event) => {
      console.log("this.ws.onopen");
      this.#alive = true;
      func ? func(event) : false;
    };
  }
  onclose(func) {
    this.ws.onclose = (event) => {
      //设置状态为断开
      this.#alive = false;
      clearInterval(this.#heart_timer);
      console.log("链接突然断开了");
      func ? func(event) : false;
    };
  }
  onerror(func) {
    this.ws.onerror = (event) => {
      func ? func(event) : false;
    };
  }
}

export default WebSocketHub;
