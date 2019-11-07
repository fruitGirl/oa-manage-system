/*
 * @Description: 扫码状态
 * @Author: danding
 * @Date: 2019-09-06 17:22:44
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-06 17:48:35
 */

import React from 'react';
import Separate from 'components/common/Separate';

// 扫码状态
const ScanEnableStatus = (props) => {
  const { qrCode } = props;

  return (
    <div>
      <Separate size={30} />
      <div className="qrcode-wrapper">
      { qrCode && (
          <img
            src={qrCode}
            alt="登录二维码"
            height="100%"
            width="100%"
          />
        )
      }
      </div>
      <Separate size={31} />
      <div className="scan-attention">打开明聊APP扫码登录</div>
      <Separate size={74} />
    </div>
  );
};

export default ScanEnableStatus;
