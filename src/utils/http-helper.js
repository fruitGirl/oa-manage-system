/*
 * @Description: http请求的方法
 * @Author: qianqian
 * @Date: 2019-01-25 17:53:03
 * @Last Modified by: danding
 * @Last Modified time: 2019-03-28 16:33:18
 */
import axios from 'axios';
import qs from 'qs';

// 早期oa接口请求调用的方法，先拷贝过来放着，后期重构的时候再整理
const fetch = ({ payload, successCallback, failCallback }) => {
  axios(payload)
    .then(function(res) {
      const data = res.data;

      if (data['success']) {
        if (successCallback && T.isFunction(successCallback)) {
          successCallback(data);
        }
      } else {
        // T.showError(data);
        if (failCallback && T.isFunction(failCallback)) {
          failCallback(data);
        }
      }
    })
    .catch(function(err) {
      // T.showError('系统错误');
      if (failCallback && T.isFunction(failCallback)) {
        failCallback(err);
      }
      throw err;
    });
};

/*
 * ====================================
 * 下面的都是其他系统统一的方法 20190125
 * ====================================
 */

/**
 * @example <caption>get请求数据方法</caption>
 * T.get(url, data).then();
 *
 * @param {string} url - 路径
 * @param {object} params - 参数
 * @param {object} withCredentials - 支持跨域
 * @param {function} callback - 取消请求回调
 * @returns
 */
const get = (url, params = {}, withCredentials = false, callback = null) => {
  const CancelToken = axios.CancelToken;
  return new Promise((resolve, reject) => {
    Object.assign(params, { _: Date.now() });
    axios({
      method: 'GET',
      url,
      params: params,
      withCredentials: withCredentials,
      cancelToken: new CancelToken(function executor(c) {
        if (callback) {
          callback(c);
        }
      })
    })
      .then((res) => {
        let data = res.data;
        if (data && data.response) {
          data = data.response;
        }
        if (data.success === true) {
          resolve(data);
        } else {
          reject(data);
        }
      })
      .catch(() => {
        reject('系统错误');
      });
  });
};

/**
 * @example <caption>post请求数据方法</caption>
 * T.post(url, data).then();
 *
 * @param {string} url - 路径
 * @param {object} data - 参数
 *
 * @returns
 */

const post = (url, data = {}, withCredentials = false) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      withCredentials,
      data: qs.stringify(data),
      url
    })
      .then((res) => {
        let data = res.data;
        if (data && data.response) {
          data = data.response;
        }
        if (data.success === true) {
          resolve(data);
        } else {
          reject(data);
        }
      })
      .catch(() => {
        reject('系统错误');
      });
  });
};

/**
 * @example <caption>上传数据方法</caption>
 * T.upload(url, form).then();
 *
 * @param {string} url - 路径
 * @param {object} data - 参数
 *
 * @returns
 */
const upload = (url, formData, withCredentials = false) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials
      })
      .then((res) => {
        const data = res.data;
        if (data.success === true) {
          resolve(data);
        } else {
          reject(data);
        }
      })
      .catch(() => {
        reject('系统错误');
      });
  });
};

/**
 * @example <caption>上传文件方法</caption>
 * T.upload(url, form).then();
 *
 * @param {string} url - 路径
 * @param {object} data - 参数
 *
 * @returns
 */
const uploadFile = (url, option = {}, withCredentials = false) => {
  const formData = new FormData();
  const file = option.file;
  formData.append('fileItem', file, file.name);
  formData.append('name', file.name);
  formData.append('type', file.type);
  formData.append('lastModifiedDate', file.name);
  formData.append('size', file.size);
  return new Promise((resolve, reject) => {
    axios
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials
      })
      .then((res) => {
        const data = res.data;
        if (data.success === true) {
          resolve(data);
        } else {
          reject(data);
        }
      })
      .catch(() => {
        reject('系统错误');
      });
  });
};

axios.defaults.timeout = 30000;

export default {
  fetch,
  get,
  post,
  upload,
  uploadFile
};
