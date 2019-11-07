/*
 * @Description: 适应业务的Textarea组件
 * @Author: danding
 * @Date: 2019-08-19 15:10:28
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-19 15:11:15
 */

import React from 'react';

const { Input } = window.antd;
const TextArea  = Input.TextArea ;

class CustomTextarea extends React.PureComponent {
  changeVal = (e) => {
    const { value } = e.target;
    this.onChange(T.return2Br(value));
  }

  render() {
    const { value, ...rest } = this.props;

    return (
      <TextArea
        {...rest}
        value={T.return2n(T.escape2Html(value))}
      />
    );
  }
}

export default CustomTextarea;
