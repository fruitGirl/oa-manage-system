const { Modal, message } = window.antd;
/**
 * 获取错误信息
 *
 * @param {object} data
 * @returns
 */
const getError = (data) => {
  if (!data) return '';
  if (typeof data !== 'object') {
    return data;
  }
  if (data['detailMessage']) {
    return data['detailMessage'];
  }
  if (data['errorMessage']) {
    if (typeof data['errorMessage'] === 'object') {
      return data['errorMessage']['message'];
    }
    return data['errorMessage'];
  } else if (typeof data['errorEnum'] === 'object') {
    return data['errorEnum']['message'];
  } else if (data['errorCode']) {
    return data['errorCode']['message'];
  } else if (data['error']) {
    if (typeof data['error'] === 'object') {
      return data['error']['message'] || data['error']['code'];
    }
    return data['error'];
  } else if (data['fieldErrors']) {
    return data['fieldErrors'];
  } else {
    return '系统错误';
  }
};

/**
 * 获取错误代码
 *
 * @param {object} data
 * @returns
 */
const getErrorCode = (data) => {
  if (data['errorCode']) {
    return data['errorCode'];
  } else if (data['error'] && typeof data['error'] === 'object') {
    return data['error']['code'];
  } else if (data['errorEnum'] && typeof data['error'] === 'object') {
    return data['errorEnum']['name'] || data['errorEnum']['message'];
  } else if (data['target']) {
    // window.location = data['target'];
  } else {
    return null;
  }
};

/**
 * 用modal显示错误信息
 *
 * @param {object} data
 * @returns
 */
export const showError = (data) => {
  if (T.getErrorCode(data) === 'USER_NOT_LOGIN') {
    Modal.error({
      width: 360,
      title: '提示',
      content: '未登录，请先登录！',
      okText: '去登录',
      onOk() {
        window.location.reload();
      }
    });
  } else if (T.getErrorCode(data) === 'USER_PERMISSION_DENIED') {
    // 访问被拒绝
    window.location.href = data.outputParameters.targetUrl;
  } else if (T.getErrorCode(data) === 'SALARY_OPERATE_VALIDATE_EXPIRE') { // 令牌失效，重定向
    T.tool.redirectTo(data.outputParameters.targetUrl);
  } else {
    Modal.error({
      width: 360,
      title: '提示',
      content: T.getError(data),
      okText: '知道了'
    });
  }
};

/**
 * 用message显示错误信息
 *
 * @param {object} data
 * @returns
 */
export const showErrorMessage = (data) => {
  if (T.getErrorCode(data) === 'USER_NOT_LOGIN') {
    // message.error(T.getError(data));
    Modal.error({
      width: 360,
      title: '提示',
      content: '未登录，请先登录！',
      okText: '去登录',
      onOk() {
        window.location.reload();
      }
    });
  } else if (T.getErrorCode(data) === 'SALARY_OPERATE_VALIDATE_EXPIRE') { // 令牌失效，重定向
    T.tool.redirectTo(data.outputParameters.targetUrl);
  } else {
    message.error(T.getError(data));
  }
};

export default {
  getError,
  getErrorCode,
  showError,
  showErrorMessage
};
