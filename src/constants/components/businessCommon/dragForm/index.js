/*
 * @Description: 可拖拽表单配置
 * @Author: danding
 * @Date: 2019-09-05 16:02:31
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-18 16:38:40
 */

// 组件类型
export const TIME_COMPONENT_TYPE = 'TIME'; // 时间
export const TIME_RANGE_COMPONENT_TYPE = 'TIME_RANGE'; // 时间区间
export const TEXTAREA_COMPONENT_TYPE = 'TEXTAREA'; // 多行文本
export const NUMBER_COMPONENT_TYPE = 'NUMBER'; // 数字
export const MONEY_COMPONENT_TYPE = 'MONEY'; // 金额
export const RADIO_COMPONENT_TYPE = 'RADIO'; // 单选
export const CHECKBOX_COMPONENT_TYPE = 'CHECKBOX'; // 多选
export const DURATION_HOUR_COMPONENT_TYPE = 'HOURS'; // 时长（小时）
export const DURATION_DAY_COMPONENT_TYPE = 'DAYS'; // 时长（天）
export const UPLOAD_FILE_COMPONENT_TYPE = 'FILE'; // 上传文件
export const UPLOAD_IMG_COMPONENT_TYPE = 'IMAGE'; // 上传图片
export const USER_COMPONENT_TYPE = 'NICK_NAME'; // 用户信息

// 默认时间格式
export const DEFAULT_TIME_FORMAT = 'YYYY-MM-DD';

// 条件类型
export const CONDITION_TYPES = [MONEY_COMPONENT_TYPE, DURATION_HOUR_COMPONENT_TYPE, DURATION_DAY_COMPONENT_TYPE, RADIO_COMPONENT_TYPE];

// 组件库配置
export const SOURCE_CONFIGS = [
  {
    type: TIME_COMPONENT_TYPE,
    props: {
      label: '时间',
      required: true,
      format: DEFAULT_TIME_FORMAT
    }
  },
  {
    type: TIME_RANGE_COMPONENT_TYPE,
    props: {
      label: '时间区间',
      required: true,
      format: DEFAULT_TIME_FORMAT
    }
  },
  {
    type: TEXTAREA_COMPONENT_TYPE,
    props: {
      label: '文本',
      required: true,
      placeholder: '请输入'
    }
  },
  {
    type: NUMBER_COMPONENT_TYPE,
    props: {
      label: '数字输入',
      required: true,
      placeholder: '请输入'
    }
  },
  {
    type: MONEY_COMPONENT_TYPE,
    isCondition: true,
    props: {
      label: '金额输入',
      required: true,
      placeholder: '请输入'
    }
  },
  {
    type: RADIO_COMPONENT_TYPE,
    isCondition: true,
    props: {
      label: '单选',
      required: true,
      options: [
        { label: '选项1', value: T.tool.createUuid('radioOption') },
        { label: '选项2', value: T.tool.createUuid('radioOption') },
        { label: '选项3', value: T.tool.createUuid('radioOption') },
      ]
    }
  },
  {
    type: CHECKBOX_COMPONENT_TYPE,
    props: {
      label: '多选',
      required: true,
      options: [
        { label: '选项1', value: T.tool.createUuid('checkboxOption') },
        { label: '选项2', value: T.tool.createUuid('checkboxOption') },
        { label: '选项3', value: T.tool.createUuid('checkboxOption') },
      ]
    }
  },
  {
    type: DURATION_HOUR_COMPONENT_TYPE,
    isCondition: true,
    props: {
      label: '计算时长/小时',
      required: true
    }
  },
  {
    type: DURATION_DAY_COMPONENT_TYPE,
    isCondition: true,
    props: {
      label: '计算时长/天',
      required: true,
    }
  },
  {
    type: UPLOAD_FILE_COMPONENT_TYPE,
    props: {
      label: '附件',
      required: true
    }
  },
  {
    type: UPLOAD_IMG_COMPONENT_TYPE,
    props: {
      label: '图片',
      required: true
    }
  },
  {
    type: USER_COMPONENT_TYPE,
    props: {
      label: '人员信息',
      required: true
    }
  }
];

// 用户信息组件的配置
export const USER_COMPONENT_CONFIG = [
  {
    label: '花名',
    placeholder: '请输入花名'
  },
  {
    label: '姓名',
    placeholder: '输入花名，自动回填'
  },
  {
    label: '部门',
    placeholder: '输入花名，自动回填'
  },
  {
    label: '职位',
    placeholder: '输入花名，自动回填'
  }
];
