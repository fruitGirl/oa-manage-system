// 浮点数加法计算
const floatAdd = (arg1, arg2) => {
  var r1, r2, m;
  try {
    r1 = ('' + arg1).split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = ('' + arg2).split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
};

// 浮点数减法计算
const floatSub = (arg1, arg2) => {
  var r1, r2, m, n;
  try {
    r1 = ('' + arg1).split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = ('' + arg2).split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  //动态控制精度长度
  n = r1 >= r2 ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
};

//浮点数乘法运算
const floatMul = (arg1, arg2) => {
  var m = 0,
    s1 = '' + arg1,
    s2 = '' + arg2;

  try {
    m += s1.split('.')[1].length;
  } catch (e) {
    //
  }
  try {
    m += s2.split('.')[1].length;
  } catch (e) {
    //
  }
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
};

//浮点数除法运算
const floatDiv = (arg1, arg2) => {
  var t1 = 0,
    t2 = 0,
    r1,
    r2;
  try {
    t1 = ('' + arg1).split('.')[1].length;
  } catch (e) {
    //
  }
  try {
    t2 = ('' + arg2).split('.')[1].length;
  } catch (e) {
    //
  }

  r1 = Number(('' + arg1).replace('.', ''));
  r2 = Number(('' + arg2).replace('.', ''));
  return (r1 / r2) * Math.pow(10, t2 - t1);
};

export default {
  floatAdd,
  floatSub,
  floatMul,
  floatDiv
};
