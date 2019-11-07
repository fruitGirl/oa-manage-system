/*
 * @Description: 明聊下载模块
 * @Author: danding
 * @Date: 2019-08-14 10:49:32
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 10:49:53
 */

import React from 'react';
import 'styles/components/home/qrcodeCard.less';

const QrcodeCard = () => {
  const url = CONFIG.devEnv
    ? 'http://test-kuaitui-resource.oss-cn-hangzhou.aliyuncs.com/qr_dev.png'
    : 'http://sssynout-prod-oa-resource.oss-cn-hangzhou.aliyuncs.com/qr_prod.png';

  return (
    <div className="qrcode-card">
      <div className="img-wrapper">
        <img src={url} alt="二维码"/>
      </div>
      <p className="tip">明聊二维码下载</p>
    </div>
  );
};

export default QrcodeCard;
