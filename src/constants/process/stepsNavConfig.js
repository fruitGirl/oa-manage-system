/*
 * @Description: 审批流程-导航栏配置
 * @Author: danding
 * @Date: 2019-09-05 16:03:29
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-05 16:03:29
 */

export const NORMAL_INFO_STEP = 'normalInfo';
export const FORM_CONFIG_STEP = 'formConfig';
export const PROCESS_CONFIG_STEP = 'processConfig';

// 审批配置Tab配置
export const configs = [
  {
    label: '基本信息',
    value: NORMAL_INFO_STEP
  },
  {
    label: '表单设计',
    value: FORM_CONFIG_STEP
  },
  {
    label: '流程配置',
    value: PROCESS_CONFIG_STEP
  }
];

// 面包屑
export const BREADCRUMB_CONFIG = [
  { link: '/process/processConfigQuery.htm', label: '审批管理' },
  { label: '编辑审批' }
];
