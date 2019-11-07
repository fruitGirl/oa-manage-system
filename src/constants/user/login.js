// 扫码状态
export const SCAN_ENABLE_STATUS = 'INIT'; // 初始状态
export const SCAN_EXPIRED_STATUS = 'EXPIRED'; // 已过期
export const LOGIN_SURE_STATUS = 'SCANED'; // 已扫描
export const LOGINED_STATUS = 'LOGGED'; // 已登录
export const LOGIN_AUTHORIZED_STATUS = 'AUTHORIZED'; // 已授权
export const LOGIN_TIME_OUT_STATUS = 'TIME_OUT'; // 登录超时

// 登录方式：扫码和表单
export const SCAN_LOGIN_TYPE = 'scan';
export const FORM_LOGIN_TYPE = 'form';
