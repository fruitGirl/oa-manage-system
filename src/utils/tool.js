/*
 * @Description: 工具库
 * @Author: moran
 * @Date: 2019-09-18 18:23:28
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-11 14:28:14
 */

import qs from 'qs';
import Hashids from 'hashids';

/**
 * 自动补充0，比如在分钟把 3 变成 03
 *
 * @param {Int} val 传入的数字
 * @param {Int} len 要填补0的个数
 * @returns {String} val
 */
const zeropad = () => {
  let val, len;
  val = '' + val;
  len = len || 2;
  while (val.length < len) {
    val = '0' + val;
  }
  return val;
};

/**
 * 获取url中的参数
 *
 * @param {String} name 要获取的参数名
 */
const getQueryString = (name) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return '';
};

/**
 * 页面跳转函数
 *
 * @param {String} url 要跳转的url
 */
const redirectTo = (url) => {
  typeof url === 'string' && (window.location.href = url);
};

/**
 * 获取路由的search对象
 *
 * @return { Object }
 */
const getSearchParams = () => {
  return qs.parse(
    window.location.search,
    { ignoreQueryPrefix: true }
  );
};

/**
 * 返回占比
 *
 * @param {Number} num 数量
 * @param {Number} count 总数
 * @return {String} 百分比
 */
const getPercent = (num, count) => {
  if (!num || !count) return '0';
  return Number(((num * 100) / (count * 100) * 100).toFixed(1));
};

/**
 * 数组遍历 转换成label,value格式
 *
 * @param {Array} arr 数组
 * @param {String} labelField 默认label字段
 * @param {String} valueField 默认value字段
 * @return {Array} 转换的数组
 */
const transArrs = (arr, labelField = 'title', valueField = 'id') => {
  const needData = arr.map(res => {
    return {
      label: res[labelField],
      value: res[valueField]
    };
  });
  return needData;
};

/**
 * 对象转换成数组对象
 *
 * @param {Object} obj 对象
 * @return {Array} 转换的数组
 */
const getArrsByObject = (obj) => {
  const arrLists = [];
  for(const i in obj) {
    const params = {};
    params[i] = obj[i];
    arrLists.push(params);
  }
  return arrLists;
};

// 一个自增的闭包
const increaseCount = (() => {
  let count = 1;
  return () => {
    return count++;
  };
})();

/**
 * 生成唯一性字符串
 *
 * @param {String}  prefix 前缀
 * @return {String} 唯一性id
 */
const createUuid = (prefix) => {
  const count = increaseCount();
  const hashids = new Hashids(`${prefix}-${count}`);
  return `${prefix}-${hashids.encode(Date.now())}`;
};

/**
 * 获取天数
 *
 * @param {String}  startDate 开始时间
 * @param {String}  endDate 结束时间
 * @return {String} 天数（保留一位小数）
 */
const getDays = (startDate, endDate) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / oneDay;
  return (Math.round(days * 10) / 10);
};

/**
 * 获取小时数
 *
 * @param {String}  startDate 开始时间
 * @param {String}  endDate 结束时间
 * @return {String} 小时数（保留一位小数）
 */
const getHours = (startDate, endDate) => {
  const oneHours = 60 * 60 * 1000;
  const hours = (new Date(endDate).getTime() - new Date(startDate).getTime()) / oneHours;
  return Math.round(hours * 10) / 10;
};

export default {
  zeropad,
  getQueryString,
  redirectTo,
  getSearchParams,
  getPercent,
  transArrs,
  getArrsByObject,
  createUuid,
  getDays,
  getHours
};
