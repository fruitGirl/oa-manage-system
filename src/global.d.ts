// utils

declare namespace CONFIG {
  var frontPath: string;
  var resourcePath: string;
  var timeDiff: number;
}

declare namespace T {
  function get(url: string, data: object, withCredentials: boolean);
  function post(url: string, data: object, withCredentials: boolean);
  function upload(url: string, data: object, withCredentials: boolean);
  function uploadFile(url: string, data: object, withCredentials: boolean);

  // 捕获错误
  function getError(data: object);
  function getErrorCode(data: object);
  function showErrorModal(data: object);
  function showErrorMessage(data: object);

  // 调试
  function log(...args);
  function logError(...args);

  // 时间相关工具
  declare namespace date {
    function getNow();
    function toDate();
    function format();
  }

  // 数据请求
  declare namespace http {
    function get(url: string, data: object, withCredentials: boolean);
    function post(url: string, data: object, withCredentials: boolean);
    function upload(url: string, data: object, withCredentials: boolean);
    function uploadFile(url: string, data: object, withCredentials: boolean);
  }

  // 工具
  declare namespace tool {
    function zeropad(val: number, len: number);
    function debounce(func: function, wait: number, immediate: boolean);
    function throttle(fn: function, delay: number);
    function splitBase64(base64: string);
  }

  // 错误处理
  declare namespace error {
    function getError(data: object);
    function getErrorCode(data: object);
    function showCatchError(data: object);
    function showErrorModal(data: object);
    function showErrorMessage(data: object);
  }

  // 常用正则
  declare namespace regex {
    var password: RegExp; //字符验证，支持字母、数字和特殊字符（仅限!@#$%^&*())
    var cell: RegExp; // 手机号
    var chinese: RegExp; // 中文
    var notSymbol: RegExp; // 中英文数字
    var positiveInteger: RegExp; // 正整数
    var twoDigitNumber: RegExp; // 两位小数
    var reallyName: RegExp; // 中英文姓名
    var checkCardNo: RegExp; // 银行卡号
  }

  // 其他
  function getFrontPath(str: string) {}
}
