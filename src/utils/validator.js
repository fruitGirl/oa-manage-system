import regex from './regex';

// 验证是否是真实姓名
function isRealName(rule, value, callback) {
  !value && callback('请输入真实姓名');
  !regex.realName.test(value) && callback('请输入正确的姓名');
  callback();
}

// 验证身份证号码
function isCertNo(rule, value, callback) {
  !value && callback('请输入身份证号码');
  !regex.certNo.test(value) && callback('请输入正确的身份证号码');
  callback();
}

// 验证手机号
function isCNCell(rule, value, callback) {
  !value && callback('请再次输入手机号');
  !regex.cell.test(value) && callback('请输入正确的手机号');
  callback();
}

// 验证最多只能有两位小数(十位整数)的正实数(非零)
function checkFixedTwoNum(rule, value, callback) {
  //value && !/^[0-9]+(\.[0-9]{1,2})?$/.test(value) && !/^[1-9]$/.test(value)
  // /^([0]*)(\.0*)$/.test(value)   匹配不能输入0.000这样的数字
  // /^([0]*)$/.test(value)   匹配不能输入0，或00000这样的数字
  //!/^([0]{1,1})(\.\d{1,2})$/.test(value)   匹配不能输入00.01这样的数字
  // /^([0]*)$/.test(value)||!/^([0-9]\d{1,9})(?:\.\d{1,2})?$/.test(value)
  if (
    value &&
    (/^([0]*)(\.0*)$/.test(value) || /^([0]*)$/.test(value) || !/^([0-9]\d{0,9})(?:\.\d{1,2})?$/.test(value))
  ) {
    callback('输入的金额需大于0且不得超过十位整数，两位小数');
  }
  callback();
}
// 验证最多只能有1位小数点的正实数
function checkFixedOneNum(rule, value, callback) {
  if (value && !/^[0-9]+(\.[0,5]{1})?$/.test(value)) {
    callback('请正确填写请假天数，如：0.5,1,1.5');
  }
  callback();
}

// 验证整数的数字
function checkDistNum(rule, value, callback) {
  if (value && !/^[0-9]+[0-9]*]*$/.test(value)) {
    callback('请输入正整数');
  }
  callback();
}

// 验证大于0整数的数字
function checkNum(rule, value, callback) {
  if (value && !/^[1-9]+[0-9]*]*$/.test(value)) {
    callback('请输入大于0的整数');
  }
  callback();
}

// 验证银行卡号
function checkCardNo(rule, value, callback) {
  if (value && !/^\d{16,19}$/.test(value)) {
    callback('请正确输入银行卡号');
  }
  callback();
}

/**
 * 验证税号
 * 15或者17或者18或者20位字母、数字组成
 */
function checkTax(rule, value, callback) {
  if (value && !/^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/.test(value)) {
    callback('请正确输入税号');
  }
  callback();
}
// 验证手机号
function checkCell(rule, value, callback) {
  if (value && !/^[1][2-9][0-9]{9}$/.test(value)) {
    callback('请正确输入11位手机号');
  }
  callback();
}

function cell() {
  //手机号验证
  return /^[1][2-9][0-9]{9}$/ || /^[9][0-9]{10}$/;
}

function idCard() {
  //身份证号验证
  return /(^\d{15}$)|(\d{17}(?:\d|x|X)$)/;
}
function bankCard() {
  //银行卡号验证
  // return /^\d{16,19}$/.test(value.replace(/\s/g, ''));
  return /^\d{16,19}$/;
}

function email() {
  //邮箱验证
  return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
}

function number() {
  //纯数字
  return /^[0-9]*$/;
}

function password() {
  //字符验证，支持字母、数字和特殊字符（仅限!@#$%^&*())
  return /^[a-zA-Z0-9\!\@\#\$\_\.\%\^\&\*\(\)]+$/;
}

function includeNumbers() {
  return /^[0-9]+.?[0-9]*$/;
}

function userName() {
  //只允许输入中英文和.
  return /[·a-zA-Z\u4E00-\u9FA5]/;
}

export default {
  isRealName,
  isCertNo,
  isCNCell,
  checkFixedTwoNum,
  checkFixedOneNum,
  checkDistNum,
  checkNum,
  checkCardNo,
  checkTax,
  checkCell,
  cell,
  idCard,
  bankCard,
  email,
  number,
  password,
  includeNumbers,
  userName
};
