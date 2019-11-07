/*
 * @Description: 数字输入框
 * @Author: danding
 * @Date: 2019-05-15 19:27:12
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-15 19:27:12
 */

import React from 'react';

const { Input } = window.antd;

class NumberInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || ''
    };
  }

  componentWillReceipeProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  handleNumberChange = (e) => {
    const { pattern } = this.props;
    let value =e.target.value;
    const reg = new RegExp(pattern);
    const isMatch = reg.test(value);

    if (isMatch || (value === '')) {
      value = value ? Number(value) : '';
      this.setState({
        value
      });
      this.props.onChange(value);
    }
  }

  render() {
    const {  nodeRef, onChange, ...restProps } = this.props;
    const { value } = this.state;

    return (
      <Input
        value={value}
        onChange={this.handleNumberChange}
        ref={nodeRef}
        { ...restProps }
      />
    );
  }
}

export default NumberInput;
