import PropTypes from 'prop-types';

const { Button, Modal } = window.antd;

class CellVerifyButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      btnText: '获取验证码',
      stepSeconds: 300,
      disabled: false
    };
  }
  componentDidMount() {}
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  clickHandler() {
    // 是否需要手机号
    if (this.props.needCell) {
      if (T.validator.cell().test(this.props.cell)) {
        this.start({
          cell: this.props.cell
        });
      } else {
        Modal.error({
          title: '提示',
          content: '请输入正确的11位手机号码'
        });
      }
    } else {
      this.start({
        userId: this.props.userId
      });
    }
  }

  start(_data) {
    T.get(this.props.url || '/user/sendBindCellSmsAck.json', _data)
      .then((data) => {
        if (data.success) {
          this.startDownCount(data.waitNextPrepareSeconds);

          if (this.props.jsonCallback) {
            this.props.jsonCallback(data);
          }
        }
      })
      .catch((err) => {
        T.showError(err);
      });
  }

  startDownCount(seconds) {
    clearInterval(this.timer);
    this.setState({
      stepSeconds: seconds || 300,
      disabled: true
    });
    this.downCount();
    this.timer = setInterval(this.downCount.bind(this), 1000);
  }

  downCount() {
    if (this.state.stepSeconds <= 0) {
      this.reset();
      if (this.props.countDownCallback) {
        this.props.countDownCallback();
      }
    } else {
      let step = this.state.stepSeconds;
      step = step - 1;
      this.setState({
        stepSeconds: step,
        btnText: `${step}秒后重新获取`
      });
    }
  }

  reset() {
    this.setState({
      btnText: '重新获取短信',
      stepSeconds: 0,
      disabled: false
    });
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  render() {
    return (
      <Button onClick={this.clickHandler.bind(this)} disabled={this.state.disabled}>
        {this.state.btnText}
      </Button>
    );
  }
}
CellVerifyButton.propTypes = {
  countDownCallback: PropTypes.func, //倒计时结束回调
  jsonCallback: PropTypes.func, //接口请求成功回调
  url: PropTypes.string, //接口地址 不传默认为/user/sendBindCellSmsAck.json
  userId: PropTypes.string, // 用户id
  cell: PropTypes.string, //手机号码
  needCell: PropTypes.bool, // 是否需要手机号验证
};

export default CellVerifyButton;
