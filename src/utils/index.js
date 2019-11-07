import tool from './tool';
import date from './date-helper';
import http from './http-helper';
import error from './error-helper';
import math from './math-helper';
import regex from './regex';
import validator from './validator';

/**
 * 注意:
 * 如果不是使用很频繁的方法,用上面的形式引入
 * 下面这些方法是使用比较频繁的一些方法
 */
/* eslint-disable no-undef */

// 配置
export const config = {
  processPath: `${CONFIG['frontPath']}/process`,
  userPath: `${CONFIG['frontPath']}/user`,
  systemPath: `${CONFIG['frontPath']}/system`,
  rangerTimeConfig: {
    showTime: true,
    format: 'YYYY-MM-DD HH:mm:ss',
    placeholder: ['开始时间', '结束时间']
  },
  timeConfig: {
    showTime: true,
    format: 'YYYY-MM-DD HH:mm:ss',
    placeholder: '选择时间'
  },
  dateMinuteFormat: 'YYYY-MM-DD HH:mm:ss'
};

export const refresh = () => {
  window.location.reload();
};

export const getResourcePath = (name) => {
  return `${CONFIG.resourcePath}${name}`;
};

export const getFrontPath = (name) => {
  return `${CONFIG.frontPath}${name}`;
};

// 根据用户id找到用户头像
export const getUserLogo = (userId) => {
  return `${CONFIG.frontPath}/user/userLogoUrl.htm?userId=${userId}`;
};

// 判断是否在数组里
export const IsInArray = (element, arr) => {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === element) {
      return i;
    }
  }
  return -1;
};

// 阿拉伯数字转中文金额
export const numToMoney = (n) => {
  if (/^(\d+(.\d{0,2})?)$/.test(n)) {
    var fraction = ['角', '分'];
    var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
    // var head = n < 0 ? '欠' : '';
    // n = Math.abs(n);
    var s = '';
    for (let i = 0; i < fraction.length; i++) {
      s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);
    for (let i = 0; i < unit[0].length && n > 0; i++) {
      var p = '';
      for (var j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p;
        n = Math.floor(n / 10);
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整');
  }
};

// 判断是否是函数
export const isFunction = (fn) => {
  return Object.prototype.toString.call(fn) === '[object Function]';
};

// 是否是数组
export const isArray = (array) => {
  return Object.prototype.toString.call(array) === '[object Array]';
};

export const commonFun = {
  // 回填的时候要是设置initialValue为‘’，则无法显示placeHolder的文字
  getSelectInitialValue({ data, key }) {
    let initialValue = {};
    let value = data[key] || '';
    if (value) {
      initialValue['initialValue'] = value;
    }
    if (value === 'null' || value === '0') {
      initialValue['initialValue'] = '0时';
    }

    return initialValue;
  },

  // 得到附件的数据
  getFileParams({ param, uploadName, fileListName }) {
    // 是否是多个
    if (param.indexOf('#') > 0) {
      let files = param.split('#');
      let m = files.length;
      let fileList = [];
      let uploadList = [];

      for (let i = 0; i < m; i++) {
        // 单个附件数据
        let fileMap = this.getSingleFileParam({
          file: files[i],
          uploadName,
          fileListName,
          index: i + 1
        });
        fileList = [...fileList, ...fileMap[fileListName]];
        uploadList = [...uploadList, ...fileMap[uploadName]];
      }

      return {
        [fileListName]: [...fileList],
        [uploadName]: [...uploadList]
      };
    } else {
      // 单个附件数据
      return {
        ...this.getSingleFileParam({
          file: param,
          uploadName,
          fileListName,
          index: 1
        })
      };
    }
  },

  // 得到单个附件的数据
  getSingleFileParam({ file, uploadName, fileListName, index }) {
    if (file) {
      const fileName = file;
      const fileTrueName = fileName.substring(46);
      // const oldFileList = state[fileListName] || [];
      // const oldUploadList = state[uploadName] || [];
      const fileList = {
        uid: index,
        name: fileTrueName,
        status: 'done',
        fileName,
        url: `${T.processPath}/fileDownload.resource?fileName=${fileName}`
      };
      return {
        [fileListName]: [fileList],
        [uploadName]: [fileName]
      };
    } else {
      return {
        [fileListName]: [],
        [uploadName]: []
      };
    }
  },
  //转意符换成普通字符
  escape2Html(str) {
    var arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"', rdquo: '”', ldquo: '“', mdash: '—', hellip: '...', '#39': "'", middot: '.', lsquo: '‘', rsquo: '’' };
    return str.replace(/&(lt|gt|nbsp|amp|quot|rdquo|ldquo|mdash|hellip|#39|middot|lsquo|rsquo);/gi, function(all, t) {
      return arrEntities[t];
    });
  },
  //回车转为br标签
  return2Br(str) {
    return str ? str.replace(/\r?\n/g, '<br />') : '';
  },
  return2n(str) {
    const reg = new RegExp('<br />', 'g');
    return str.replace(reg, '\n');
  }
};
/**
 * 动态引入图片
 *
 * @param {string} name
 * @returns
 */
export const getImg = (name) => {
  let img = require(`img/${name}`);
  // 支持多层目录
  const arr = name.split('/');
  const imgName = arr[arr.length - 1];

  if (img.indexOf('data:image') > -1) {
    return img;
  } else if (window.location.port === '9090') {
    return `http://localhost:9090/static/img/${imgName}`;
  } else {
    return `${CONFIG.resourcePath}/img/${imgName}`;
  }
};

/**
 * @description 错误信息处理
 */
export const getError = error.getError;
export const getErrorCode = error.getErrorCode;
export const showError = error.showError;
export const showErrorMessage = error.showErrorMessage;

/**
 * @description 请求数据方法
 */
export const request = http.request;
export const get = http.get;
export const post = http.post;
export const upload = http.upload;
export const uploadFile = http.uploadFile;

/**
 * ================
 * 开发环境调试用功能
 * ================
 */

/*eslint-disable no-console */
export const log = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

export const logError = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(...args);
  }
};

export default (window.T = {
  // 配置
  ...config,
  // 工具
  tool,
  date,
  ...regex,
  error,
  validator,
  math,
  // 判断是否在数组
  IsInArray,
  // 阿拉伯数字转中文金额
  numToMoney,
  // 判断是否是函数
  isFunction,
  // 是否是数组
  isArray,
  // 公共方法
  ...commonFun,
  // 刷新页面
  refresh,
  // 路径
  getResourcePath,
  getFrontPath,
  getUserLogo,
  getImg,
  // 请求
  request,
  get,
  post,
  upload,
  uploadFile,
  // 错误信息
  getError,
  getErrorCode,
  showError,
  showErrorMessage,
  // 调试
  log,
  logError
});
