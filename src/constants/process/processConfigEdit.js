// 可见范围，所有用户，自定义用户，自定义部门，自定义分类,自定义公司
export const VISIBLE_RANGE_ALL_USER = 'ALL_USER';
export const VISIBLE_RANGE_CUSTOM_USER = 'CUSTOM_USER';
export const VISIBLE_RANGE_CUSTOM_DEPART = 'CUSTOM_DEPARTMENT';
export const VISIBLE_RANGE_CUSTOM_GROUP = 'CUSTOM_GROUP';
export const VISIBLE_RANGE_CUSTOM_COMPANY = 'CUSTOM_COMPANY';

// 审批人枚举：部门负责人，指定分类，指定人员，发起人自选
export const APPROVE_USER_MANAGEER = 'DEPARTMENT_MANAGER';
export const APPROVE_USER_GROUP = 'CUSTOM_GROUP';
export const APPROVE_USER_USER = 'CUSTOM_USER';
export const APPROVE_USER_SELF_SELECT = 'SELF_SELECT';

// 审批人为空时，自动通过，转交给人员，转交给分类
export const APPROVE_FORWARD_AUTO_PASS = true;
export const APPROVE_FORWARD_USER = 'CUSTOM_USER';
export const APPROVE_FORWARD_GROUP = 'CUSTOM_GROUP';

// 审批会签
export const ALL_APPROVE_PASS_WAY = 'ALL_APPROVE';

// 审批方式
export const APPROVE_WAYS = [
  {
    label: (
      <span>
        <span>会签</span>
        &nbsp;
        <span>(需所有审批人同意，任意一人拒绝则回退至上一流程)</span>
      </span>
    ),
    value: ALL_APPROVE_PASS_WAY
  },
  {
    label: (
      <span>
        <span>或签</span>
        &nbsp;
        <span>(任意一名审批人同意或拒绝即可)</span>
      </span>
    ),
    value: 'SINGLE_APPROVE'
  },
];

// 抄送人：指定分类和指定人员
export const NOTICE_TO_GROUP = 'CUSTOM_GROUP';
export const NOTICE_TO_USER = 'CUSTOM_USER';

// 介于两个数之间
export const BETWEEN_TYPE = 'BT';

// 大于类型
export const GT_TYPE = 'GT';

// 条件流程的计算条件
export const compareConfig = [
  {
    label: '大于',
    value: GT_TYPE
  },
  {
    label: '大于等于',
    value: 'GET'
  },
  {
    label: '等于',
    value: 'E'
  },
  {
    label: '小于等于',
    value: 'LET'
  },
  {
    label: '小于',
    value: 'LT'
  },
  {
    label: '介于两个数之间',
    value: BETWEEN_TYPE
  },
];

export const DEFAULT_APPROVAL_LOGO = 'approval_1.png'; // 默认的审批图标




