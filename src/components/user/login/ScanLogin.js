import React from 'react';
import { connect } from 'dva';
import { SCAN_ENABLE_STATUS, SCAN_EXPIRED_STATUS, LOGIN_SURE_STATUS, LOGINED_STATUS , LOGIN_AUTHORIZED_STATUS, LOGIN_TIME_OUT_STATUS } from 'constants/user/login';
import 'styles/components/user/login/scanLogin.less';
import LoginSureStatus from 'components/user/login/LoginSureStatus';
import ScanExpiredStatus from 'components/user/login/ScanExpiredStatus';
import ScanEnableStatus from 'components/user/login/ScanEnableStatus';

class ScanLogin extends React.PureComponent {
  constructor(props) {
    super(props);
    this.timer = null;
  }

  async UNSAFE_componentWillMount() {
    await this.getQrcode();
    this.checkLoginStatusTimer(this.props.identifyCode);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // 扫码状态变更为初始状态
    if (this.props.scanStatus !== nextProps.scanStatus) {
      if (nextProps.scanStatus === SCAN_ENABLE_STATUS) {
        this.checkLoginStatusTimer(nextProps.identifyCode);
      } else if (
        (nextProps.scanStatus === SCAN_EXPIRED_STATUS)
         || (nextProps.scanStatus === LOGIN_TIME_OUT_STATUS)
      ) {
        this.clearTimer();
      }
    }
  }

  componentWillUnmount() {
    this.clearTimer();
    this.resetState();
  }

  resetState() {
    this.props.dispatch({
      type: 'login/resetScanState'
    });
  }

  clearTimer() {
    clearInterval(this.timer);
    this.timer = null;
  }

  // 短轮询-检查状态
  checkLoginStatusTimer(identifyCode) {
    if (identifyCode) {
      this.timer = setInterval(async () => {
        await this.props.dispatch({
          type: 'login/getScanStatus',
          payload: {
            identifyCode
          }
        });
      }, 2000);
    }
  }

  async getQrcode() {
    await this.props.dispatch({
      type: 'login/getQrCode',
    });
  }

  // 更新扫码状态，重新初始化
  refreshQrCode = () => {
    this.clearTimer();
    this.getQrcode();
  }

  render() {
    const { scanStatus, qrCode, userInfo } = this.props;

    // 初始状态
    const isScanEnableStatus = scanStatus === SCAN_ENABLE_STATUS;

    // 过期状态
    const isScanExpiredStatus = scanStatus === SCAN_EXPIRED_STATUS;

    // 已扫描/已登录/已授权/登录超时状态
    const isAfterLoginSureStatus = (scanStatus === LOGIN_SURE_STATUS)
      || (scanStatus === LOGINED_STATUS)
      || (scanStatus === LOGIN_AUTHORIZED_STATUS)
      || (scanStatus === LOGIN_TIME_OUT_STATUS);

    return (
      <div className="scan-login-wrapper">
        { isScanEnableStatus && (<ScanEnableStatus qrCode={qrCode} />) }

        { isScanExpiredStatus && (<ScanExpiredStatus qrCode={qrCode} refreshQrCode={this.refreshQrCode} />) }

        { isAfterLoginSureStatus && (
            <LoginSureStatus
            scanStatus={scanStatus}
            reloadLogin={this.refreshQrCode}
            userInfo={userInfo} />
          )
        }
      </div>
    );
  }
}

export default connect(({ login }) => ({ ...login }))(ScanLogin);
