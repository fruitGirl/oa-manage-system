/*
 * @Description: 登录确认状态
 * @Author: danding
 * @Date: 2019-09-06 17:20:19
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-06 17:24:46
 */

import React from 'react';
import { LOGIN_SURE_STATUS, LOGINED_STATUS , LOGIN_AUTHORIZED_STATUS, LOGIN_TIME_OUT_STATUS } from 'constants/user/login';
import Separate from 'components/common/Separate';

const LoginSureStatus = (props) => {
  const { scanStatus, userInfo, reloadLogin } = props;
  const { userLogoUrl, userName } =userInfo;
  const isSureLoginStatus = scanStatus === LOGIN_SURE_STATUS; // 确认登录
  const isLoginingStatus = (scanStatus === LOGINED_STATUS) || (scanStatus === LOGIN_AUTHORIZED_STATUS); // 已登录
  const isLoginTimeoutStatus = scanStatus === LOGIN_TIME_OUT_STATUS; // 登录超时

  return (
    <div className="sure-login-wrapper">
      <img className="avatar" src={userLogoUrl} alt="头像"/>
      <Separate size={23} />
      <div className="nickname">{userName}</div>
      <Separate size={23} />
      { isSureLoginStatus && <div className="login-attention">请在手机上确认登录</div> }

      { isLoginTimeoutStatus && <div className="login-attention">登录已超时，<a onClick={reloadLogin} href="javascript:;">重新登录</a></div> }

      { isLoginingStatus && <div className="login-attention">正在登录...</div> }
      <Separate size={92} />
    </div>
  );
};

export default LoginSureStatus;
