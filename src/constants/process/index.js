/*
 * @Description: 流程-状态管理
 * @Author: moran 
 * @Date: 2019-09-18 10:15:05 
 * @Last Modified by: moran
 * @Last Modified time: 2019-09-19 11:57:16
 */
export const INIT = 'INIT'; // 初始化
export const UNAPPROVED = 'UNAPPROVED'; // 未审批
export const APPROVE = 'APPROVE'; // 待审批
export const APPROVED = 'APPROVED'; // 已审批
export const VETOED = 'VETOED'; // 已否决
export const FLOWED = 'FLOWED'; // 已流转
export const REJECT = 'REJECT'; // 已拒绝
export const RECALLED = 'RECALLED'; // 已撤回
export const FINISH = 'FINISH'; // 已完成 
export const NOTICED = 'NOTICED'; // 已抄送

// 我的审批 nav
export const ACTIVE_NAV = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '待审批',
    value: 'APPROVE'
  },
  {
    label: '已审批',
    value: 'APPROVED'
  },
  {
    label: '已否决',
    value: 'VETOED'
  },
];

// 我的发起 nav
export const MY_INITISTE_ACTIVE_NAV = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '待审批',
    value: 'APPROVE'
  },
  {
    label: '已审批',
    value: 'APPROVED'
  },
  {
    label: '已否决',
    value: 'VETOED'
  },
  {
    label: '已撤回',
    value: 'RECALLED'
  },
];