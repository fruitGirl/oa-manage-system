/*
 * @Description: 表单配置
 * @Author: danding
 * @Date: 2019-09-05 15:53:16
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-17 19:19:36
 */

import React from 'react';
import Label from 'components/businessCommon/dragForm/formSetting/Label';
import * as formType from 'constants/components/businessCommon/dragForm';

export const FORMAT_CONFIG = [ // 时间的选择配置
  {
    label: '年-月-日',
    value: formType.DEFAULT_TIME_FORMAT
  },
  {
    label: '年-月-日 时-分',
    value: 'YYYY-MM-DD HH:mm'
  }
];

export const REQUIRE_CONFIG = [ // 校验的配置
  {
    label: '必填',
    value: true
  },
  {
    label: '非必填',
    value: false
  }
];

// 基础表单配置
const createBaseConfig = (children = []) => {
  const configs = [
    {
      type: 'input',
      field: 'label',
      label: (<Label label="标题" attention="最多30字" />),
      rules: [{ required: true, message: '请输入标题' }],
      props: {
        maxLength: 30,
      }
    },
    ...children,
    {
      type: 'radio',
      field: 'required',
      label: '校验',
      props: {
        options: REQUIRE_CONFIG
      }
    }
  ];
  return configs.filter(Boolean);
};

// 时间
const timeConfig = {
  title: '时间',
  formConfigs: createBaseConfig([
    {
      type: 'radio',
      field: 'format',
      label: '方式',
      props: {
        options: FORMAT_CONFIG
      }
    },
  ])
};

// 时间区间
const timeRangeConfig = {
  title: '时间区间',
  formConfigs: createBaseConfig([
    {
      type: 'radio',
      field: 'format',
      label: '方式',
      props: {
        options: FORMAT_CONFIG
      }
    },
  ])
};

// 多行文本
const textareaConfig = {
  title: '文本',
  formConfigs: createBaseConfig([
    {
      type: 'input',
      field: 'placeholder',
      label: <Label label="提示" attention="最多50字" />,
      props: {
        maxLength: 50
      }
    },
  ])
};

// 数字
const numberConfig = {
  title: '数字',
  formConfigs: createBaseConfig([
    {
      type: 'input',
      field: 'placeholder',
      label: <Label label="提示" attention="最多50字" />,
      props: {
        maxLength: 50
      }
    },
  ])
};

// 金额
const moneyConfig = {
  title: '金额',
  formConfigs: createBaseConfig([
    {
      type: 'input',
      field: 'placeholder',
      label: <Label label="提示" attention="最多50字" />,
      props: {
        maxLength: 50
      }
    },
  ])
};

// 计算时长/h
const hourDurationConfig = {
  title: '计算时长/小时',
  formConfigs: createBaseConfig()
};

// 计算时长/天
const dayDurationConfig = {
  title: '计算时长/天',
  formConfigs: createBaseConfig()
};

// 附件
const uploadFileConfig = {
  title: '附件',
  formConfigs: createBaseConfig()
};

// 图片
const uploadImgConfig = {
  title: '图片',
  formConfigs: createBaseConfig()
};

// 人员信息
const userConfig = {
  title: '人员信息',
  formConfigs: [
    {
      type: 'radio',
      field: 'required',
      label: '校验',
      props: {
        options: REQUIRE_CONFIG
      }
    }
  ]
};

// 多选
const selectConfig = {
  title: '多选',
  formConfigs: createBaseConfig([
    {
      type: 'options',
      field: 'options',
      label: <Label label="选项" attention="单个选项名称最多50字" />,
    }
  ])
};

// 单选
const radioConfig = {
  title: '单选',
  formConfigs: createBaseConfig([
    {
      type: 'options',
      field: 'options',
      label: <Label label="选项" attention="单个选项名称最多50字" />
    }
  ])
};

// 配置和类型映射关系
export const typeMapConfig = {
  [formType.TIME_COMPONENT_TYPE]: timeConfig,
  [formType.TIME_RANGE_COMPONENT_TYPE]: timeRangeConfig,
  [formType.TEXTAREA_COMPONENT_TYPE]: textareaConfig,
  [formType.NUMBER_COMPONENT_TYPE]: numberConfig,
  [formType.MONEY_COMPONENT_TYPE]: moneyConfig,
  [formType.DURATION_HOUR_COMPONENT_TYPE]: hourDurationConfig,
  [formType.DURATION_DAY_COMPONENT_TYPE]: dayDurationConfig,
  [formType.UPLOAD_FILE_COMPONENT_TYPE]: uploadFileConfig,
  [formType.UPLOAD_IMG_COMPONENT_TYPE]: uploadImgConfig,
  [formType.USER_COMPONENT_TYPE]: userConfig,
  [formType.RADIO_COMPONENT_TYPE]: radioConfig,
  [formType.CHECKBOX_COMPONENT_TYPE]: selectConfig
};

