export class SmsAutherCreater {
  /**
   * @param  {string}      options.url  [发送短信验证码url]
   * @param  {jqDom}      options.$smsBtn  [发送按钮]
   * @param  {jqDom}      options.cellValue  [手机号]
   */
  constructor(options) {
    if (options) {
      this.url = options.url;
      this.$smsBtn = options.$smsBtn;
      this.cellValue = options.cellValue ? options.cellValue : null;
    }
  }
  showCountDown() {
    var text = `${this.smsTime}秒后重新获取`;
    if (this.smsTime) {
      this.$smsBtn.innerHTML = text;
      this.smsTime--;
    } else {
      this.reset();
    }
  }
  reset() {
    this.$smsBtn.innerHTML = '重新获取短信';
    this.$smsBtn.disabled = false;
    this.smsTimer.stop();
  }
  // 请求后端服务器发送短信验证码
  querySmsServer(obj) {
    let data = {};
    if (obj.callNumber) {
      data = {
        cell: obj.callNumber
      };
    }

    T.get(this.url, data)
      .then((data) => {
        if (data.success && data.outputParameters && data.outputParameters.smsId) {
          // 如果在 60s内已经发送过了
          if (data.outputParameters.sendBefore) {
            T.showErrorModal({
              errorMessage: '发送频率过高，请等待倒计时结束'
            });
          }
          this.smsId = data.outputParameters.smsId;

          // 测试代码，先写死60秒
          // this.smsTime = 60;

          // 设置倒计时
          this.smsTime = data.outputParameters.waitNextPrepareSeconds
            ? data.outputParameters.waitNextPrepareSeconds
            : 60;

          // 开始倒计时
          this.showCountDown();
          this.smsTimer.start();
          this.$smsBtn.disabled = true;
          if (obj.callback) {
            obj.callback(this);
            return;
          }
        } else {
          T.showErrorModal(data);
          this.reset();
        }
      })
      .catch((err) => {
        T.showErrorModal(err);
        this.reset();
      });
  }
  /**
   * 准备发送短信验证码
   */
  toSendSms(callback) {
    var callNumber = '';
    if (this.cellValue) {
      callNumber = this.cellValue;
      if (!/^(12[0-9]|13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(callNumber)) {
        if (callback) {
          callback.call(this);
          return;
        }
        return;
      }
    }

    // 设置倒计时
    // this.smsTime = 60;
    this.smsTimer = new TimerCreater();

    this.smsTimer.setSleepTime(1000).setCallback(this.showCountDown.bind(this));
    // 请求验证码
    this.querySmsServer({
      callNumber: callNumber,
      callback: callback
    });
  }
}

class TimerCreater {
  constructor(options, isCallOnceBeforeLoop) {
    if (typeof options === 'object') {
      this.callback = options.callback;
      this.sleep = options.sleepTime || options.loopTime || options.time;
      this.isCallOnceBeforeLoop = options.isCallOnceBeforeLoop;
    }
    if (typeof isCallOnceBeforeLoop === 'boolean') {
      this.isCallOnceBeforeLoop = isCallOnceBeforeLoop;
    }
  }
  setCallback(callback) {
    this.callback = callback;
    return this;
  }
  setCallType(isCallOnceBeforeLoop) {
    this.isCallOnceBeforeLoop = isCallOnceBeforeLoop;
    return this;
  }
  setSleepTime(time) {
    this.sleep = time;
    return this;
  }
  start() {
    this.goon = true;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    var loop = function() {
      if (this.goon) {
        this.callback();
        this.timer = setTimeout(loop.bind(this), this.sleep);
      }
    };
    const firstTime = this.isCallOnceBeforeLoop ? 0 : this.sleep;
    this.timer = setTimeout(loop.bind(this), firstTime);
    return this;
  }
  stop() {
    this.goon = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    return this;
  }
}
