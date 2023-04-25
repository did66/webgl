/*
* Author: infiniteDemon
* github: https://github.com/infiniteDemon
* Date: 2021-4-29 23:51:22
*/
class WebrtcPlayer {
  constructor(options) {
    this.videoElement = options.videoElement
    this.url = options.url
    this.vhost = null
    this.app = null
    this.stream = null
    this.schema = null
    this.port = null
    this.info = null
    this.timeout = options.timeout

    // RTCSession
    this.pc = null
    this.autoplay = options.autoplay
    this.animationId = null
    this.audioOut = null

    this.filled = null
    this.played = null
    this.paused = true

    this.onPlay = options.onPlay
    this.canPlay = options.canPlay
    this.onError = options.onError
    this.onPause = options.onPause

    this.firstTime = null
    this.endTime = null
  }

  initPlayer() {
    this.firstTime = new Date().getTime()
    if (!this.videoElement) {
      console.error('VideoElement is null')
      if (this.onError) {
        this.onError('VideoElement is null')
      }
      return
    }

    // set muted for autoplay
    if (this.autoplay) {
      // this.videoElement.muted = true
    }

    this._parseUrl()
    this.startLoading()
  }

  startLoading() {
    const _this = this
    if (this.pc) {
      this.pc.close()
    }
    this.pc = new RTCPeerConnection(null)
    this.pc.ontrack = (event) => {
      _this.videoElement.srcObject = event.streams[0]
    }
    this.pc.addTransceiver("audio", { direction: "recvonly" })
    this.pc.addTransceiver("video", { direction: "recvonly" })

    this.pc.createOffer().then(offer => {
      return _this.pc.setLocalDescription(offer).then(function () { return offer })
    }).then(offer => {
      return new Promise(function (resolve, reject) {
        var port = _this.info.port || 1985

        // @see https://github.com/rtcdn/rtcdn-draft
        var api = _this.info.user_query.play || '/rtc/v1/play/'
        if (api.lastIndexOf('/') != api.length - 1) {
          api += '/'
        }

        var url = _this.info.schema + '://' + _this.info.server + ':' + port + api
        for (var key in _this.info.user_query) {
          if (key != 'api' && key != 'play') {
            url += '&' + key + '=' + _this.info.user_query[key]
          }
        }

        // @see https://github.com/rtcdn/rtcdn-draft
        var data = {
          api: url,
          streamurl: _this.info.url,
          clientip: null,
          sdp: offer.sdp
        }
        // console.log("offer: " + JSON.stringify(data))

        _this.HttpPost(url, JSON.stringify(data)).then(res => {
          switch (res.code) {
            case 0:
              // ok
              resolve(res.sdp)
              break
            case 400:
              // ok
              if (_this.onError) {
                _this.onError("post error")
              }
              break
          }
        }, rej => {
          reject(rej)
        })
      })
    }).then(function (answer) {
      if (!answer) {
        if (_this.onError) {
          _this.onError("video is first error")
          return
        }
        return
      }
      return _this.pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: answer }))
    }).catch(function (reason) {
      // if (_this.onError) {
      //   _this.onError("video is second error" + reason)
      // }
    })

    if (this.autoplay) {
      this.play()
    }

    if (_this.canPlay) {
      _this.canPlay()
    }
  }

  stop() {
    this.pause()
  }

  pause() {
    if (this.paused) {
      return
    }

    cancelAnimationFrame(this.animationId)
    this.animationId = null
    this.isPlaying = false
    this.paused = true

    this.videoElement.pause()

    if (this.onPause) {
      this.onPause(this)
    }
  }

  destroy() {
    this.pause()
    this.pc && this.pc.close() && this.pc.destroy()
    this.audioOut && this.audioOut.destroy()
  }

  play() {
    if (this.animationId) {
      return
    }

    this.animationId = requestAnimationFrame(this.update.bind(this))
    this.paused = false
  }

  update() {
    this.animationId = requestAnimationFrame(this.update.bind(this))
    if (this.videoElement.readyState < 4) {
      return null
    }

    if (!this.played) {
      this.played = true

      this.videoElement.play()
      if (this.onPlay) {
        this.onPlay(this)
      }
    }
  }

  _parseUrl() {
    const a = document.createElement("a")
    const tempUrl = this.url.replace("rtmp://", "http://").replace("webrtc://", "https://").replace("rtc://", "http://")
    console.log(this.url, tempUrl)
    a.href = tempUrl
    this.vhost = a.hostname
    this.app = a.pathname.substr(1, a.pathname.lastIndexOf("/") - 1)
    this.stream = a.pathname.substr(a.pathname.lastIndexOf("/") + 1)

    this.app = this.app.replace("...vhost...", "?vhost=")
    if (this.app.indexOf("?") >= 0) {
      var params = this.app.substr(this.app.indexOf("?"))
      this.app = this.app.substr(0, this.app.indexOf("?"))

      if (params.indexOf("vhost=") > 0) {
        this.vhost = params.substr(params.indexOf("vhost=") + "vhost=".length)
        if (this.vhost.indexOf("&") > 0) {
          this.vhost = this.vhost.substr(0, this.vhost.indexOf("&"))
        }
      }
    }

    // when vhost equals to server, and server is ip,
    // the vhost is __defaultVhost__
    if (a.hostname == this.vhost) {
      var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/
      if (re.test(a.hostname)) {
        this.vhost = "__defaultVhost__"
      }
    }

    // parse the schema
    this.schema = "rtmp"
    if (tempUrl.indexOf("://") > 0) {
      this.schema = tempUrl.substr(0, tempUrl.indexOf("://"))
    }

    this.port = a.port
    if (!this.port) {
      if (this.schema === 'http') {
        this.port = 80
      } else if (this.schema === 'https') {
        this.port = 443
      } else if (this.schema === 'rtmp') {
        this.port = 1935
      } else if (this.schema === 'rtc') {
        this.port = 1985
      }
    }

    // if (this.schema === 'http') {
    //   this.port = 80
    // } else if (this.schema === 'https') {
    //   this.port = 443
    // } else if (this.schema === 'rtmp') {
    //   this.port = 1935
    // } else if (this.schema === 'rtc') {
    //   this.port = 1985
    // }

    this.info = {
      url: this.url,
      schema: this.schema,
      server: a.hostname,
      port: this.port,
      vhost: this.vhost,
      app: this.app,
      stream: this.stream
    }

    this._fillQuery(a.search, this.info)
  }

  _fillQuery(queryString, obj) {
    // pure user query object.
    obj.user_query = {}
    if (queryString.length == 0) {
      return null
    }
    // split again for angularjs.
    if (queryString.indexOf("?") >= 0) {
      queryString = queryString.split("?")[1]
    }

    var queries = queryString.split("&")
    for (var i = 0; i < queries.length; i++) {
      var query = queries[i].split("=")
      obj[query[0]] = query[1]
      obj.user_query[query[0]] = query[1]
    }

    // alias domain for vhost.
    if (obj.domain) {
      obj.vhost = obj.domain
    }
  }

  HttpPost(url, data) {
    const _this = this
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
          var respone = JSON.parse(xhr.responseText)
          xhr.onreadystatechange = () => { }
          xhr = null
          resolve(respone)
        }
      }

      xhr.onerror = function (err) {
        reject(err)
      }

      xhr.open("POST", url, true)

      // note: In Internet Explorer, the timeout property may be set only after calling the open()
      // method and before calling the send() method.
      xhr.timeout = _this.timeout// 5 seconds for timeout
      xhr.responseType = "text"
      xhr.setRequestHeader("Content-Type", "application/json")
      xhr.send(data)
    })
  }
}
export { WebrtcPlayer }