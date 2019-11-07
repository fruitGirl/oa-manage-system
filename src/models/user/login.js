/*
 * @Description:
 * @Author: danding
 * @Date: 2019-09-06 10:39:49
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-06 19:01:21
 */
import { SCAN_ENABLE_STATUS, FORM_LOGIN_TYPE, SCAN_LOGIN_TYPE, LOGIN_AUTHORIZED_STATUS  } from 'constants/user/login';

export default {
  namespace: 'login',

  state: {
    scanStatus: SCAN_ENABLE_STATUS, // 扫码的状态
    qrCode: '', // 二维码地址
    identifyCode: '', // 发送给服务端的uuid码
    userInfo: {}, // 用户信息,
    loginType: CONFIG.option.isHideScanLogin
      ? FORM_LOGIN_TYPE
      : SCAN_LOGIN_TYPE, // 登录的方式
  },

  effects: {
    // 获取二维码信息
    *getQrCode({ payload }, { call, put }) {
      try {
        const res = yield call(T.post, '/user/authorizeLoginQrCodeCreate.json');
        const { qrCode, identifyCode } = res;
        const { qrCodeContent, extension } = qrCode;
        const combineQrCode = `data:image/${extension};base64,${qrCodeContent}`;
        yield put({
          type: 'setQrCodeInfo',
          payload: {
            qrCode: combineQrCode,
            identifyCode
          }
        });
        yield put({
          type: 'setScanStatusInfo',
          payload: { scanStatus: SCAN_ENABLE_STATUS }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 获取扫码状态值
    *getScanStatus({ payload }, { call, put, select }) {
      try {
        const res = yield call(T.post, '/user/getAuthorizeLoginQrCodeStatus.json', payload);
        const { status = {}, user } = res;

        // 已授权，进行登录
        if (status.name === LOGIN_AUTHORIZED_STATUS) {
          const { userInfo, identifyCode } = yield select(state => state.login);
          const { userId } = userInfo;
          if (userId) {
            yield put({ type: 'handleAuthorizationLogin', payload: {
              userId,
              identifyCode
            }});
          }
        }

        // 设置扫码状态
        yield put({
          type: 'setScanStatusInfo',
          payload: {
            scanStatus: status.name
          }
        });

        // 设置用户信息
        if (user) {
          yield put({
            type: 'setUserInfo',
            payload: {
              userInfo: user
            }
          });
        }
      } catch (err) {
        // 错误，比如二维码失效，登录超时
        if (err.status) {
          yield put({
            type: 'setScanStatusInfo',
            payload: {
              scanStatus: err.status.name
            }
          });
        } else {
          // T.showErrorMessage(err);
        }
      }
    },

    // 授权后，进行登录
    *handleAuthorizationLogin({ payload }, { call, put }) {
      try {
        const res = yield call(T.post, '/user/userLoginByQrCodeAuthorised.json', payload);
        const { gotoUrl } = res;
        window.location.href = gotoUrl;
      } catch (err) {
        T.showErrorMessage(err);
      }
    }
  },

  reducers: {
    setQrCodeInfo(state, { payload }) {
      return { ...state, ...payload };
    },
    setScanStatusInfo(state, { payload }) {
      return { ...state, ...payload };
    },
    setUserInfo(state, { payload }) {
      return { ...state, ...payload };
    },
    setLoginType(state, { payload }) {
      return { ...state, ...payload };
    },
    resetScanState(state, { payload }) {
      return {
        ...state,
        scanStatus: SCAN_ENABLE_STATUS,
        qrCode: '',
        identifyCode: '',
        userInfo: {},
      };
    }
  }
};
