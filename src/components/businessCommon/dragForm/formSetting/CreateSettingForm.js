/*
 * @Description: 表单属性配置-创建其他表单配置
 * @Author: danding
 * @Date: 2019-09-05 16:10:32
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-23 19:26:34
 */

import React from 'react';
import Options from 'components/businessCommon/dragForm/formSetting/Options';

const { Form, Input, Radio } = window.antd;

class CreateSettingForm extends React.Component {
  // 初始化数据，校验规则
  componentDidMount() {
    this.props.form.setFieldsValue(this.props.curSelectedTarget.props);
    this.props.form.validateFields();
  }

  // 匹配当前的组件类型
  matchComponent = ({ type, props, field, curSelectedTarget }) => {
    switch(type) {
      case 'input': {
        return (
          <Input { ...props } />
        );
      }
      case 'radio': {
        let { props: { isCondition } } = curSelectedTarget;
        const isRequireField = field === 'required';
        isCondition = isRequireField && isCondition;
        return (
          <Radio.Group { ...props } disabled={isCondition}/>
        );
      }
      case 'options': {
        return (
          <Options />
        );
      }
      default:
        return <Input { ...props } />;
    }
  }

  // 组合表单项
  getFields() {
    const { configs = {}, curSelectedTarget, } = this.props;
    const { paramName, props: { isCondition } } = curSelectedTarget;
    const { formConfigs = [] } = configs;
    const { getFieldDecorator } = this.props.form;
    return formConfigs.map((i, idx) => {
      const { label, field, type, rules, props } = i;
      const extra = (isCondition && (field === 'required'))
        ? '（组件已被设置为审批条件，不可取消勾选）'
        : '';
      const component = this.matchComponent({ type, props, field, curSelectedTarget });
      return (
        <Form.Item extra={extra} key={`${paramName}_${field}_${idx}`} label={label}>
          {getFieldDecorator(field, {
            rules: rules,
          })(component)}
        </Form.Item>
      );
    });
  }

  render() {
    const { title } = this.props.configs;

    return (
      <Form>
        <h3>{title}</h3>
        {this.getFields()}
      </Form>
    );
  }
}

export default Form.create({
  onFieldsChange(props, changedValues) {
    for (let i in changedValues) {
      const { name, value } = changedValues[i];
      props.onChange && props.onChange({ [name]: value });
    }
  }
})(CreateSettingForm);


