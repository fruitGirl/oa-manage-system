/*
 * @Description: 表单属性配置-表单label
 * @Author: danding
 * @Date: 2019-09-05 16:09:25
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-05 16:09:51
 */

import React from 'react';

const Label = (props) => {
  const { attention, label } = props;
  return (
    <span>
      <span>{label}</span>
      {attention && <span style={{color: '#999', fontSize: '12px'}}>（{attention}）</span>}
    </span>
  );
};

export default Label;
