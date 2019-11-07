/*
 * @Description: 扫码失效状态
 * @Author: danding
 * @Date: 2019-09-06 17:21:23
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-06 17:22:14
 */

import React from 'react';
import Separate from 'components/common/Separate';

const { Button } = window.antd;

const ScanExpiredStatus = (props) => {
  const { qrCode, refreshQrCode } = props;

  return (
    <div>
      <Separate size={51} />
      <div className="qrcode-wrapper">
        <img src={qrCode} alt="登录二维码" height="100%" width="100%"/>
        <div className="expired-qrcode-wrapper">
          <div className="scan-attention">二维码已失效</div>
          <Separate size={23} />
          <Button onClick={refreshQrCode} icon="reload" type="primary">点击刷新</Button>
        </div>
      </div>
      <Separate size={31} />
      <p className="scan-attention">打开明聊APP扫码登录</p>
      <Separate size={74} />
    </div>
  );
};

export default ScanExpiredStatus;
