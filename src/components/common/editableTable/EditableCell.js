/*
 * @Description: 列配置
 * @Author: danding
 * @Date: 2019-05-15 19:27:24
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 14:11:37
 */

import React from 'react';
import EditableContext from 'components/common/editableTable/EditableContext';
import NumberInput from 'components/common/editableTable/NumberInput';

const { Input, Form, Select } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;

class EditableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { dataIndex } = nextProps;
    if (
      nextProps.editable
      && nextProps.dataIndex
      && nextProps.record
    ) {
      this.form.setFieldsValue({
        [dataIndex]: nextProps.record[dataIndex]
      });
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  save = e => {
    const { record, handleSave, dataIndex, } = this.props;
    const values = this.form.getFieldsValue();
    this.toggleEdit();
    // 输入空
    if (
      (typeof values[dataIndex] === 'string')
      && (typeof record[dataIndex] === 'undefined')
      && (values[dataIndex].trim() === '')
    ) return;

    // 判断是否输入相同值
    if (
      (typeof values[dataIndex] === 'string')
      && (typeof record[dataIndex] === 'string')
      && (values[dataIndex].trim() === record[dataIndex].trim())
    ) return;

    // 非空值，且前后修改不同时，保存
    if (
      (typeof values[dataIndex] !== 'undefined')
      && (values[dataIndex] !== record[dataIndex])
    ) {
      handleSave && handleSave({
        ...record,
        ...values,
        editField: dataIndex, // 当前编辑项字段名
      });
    }
  }

  // 匹配類型
  switchComponent = ({
    type,
    props,
    editing,
    restProps
  }) => {
    if (!editing) {
      return (
        <div
          className="editable-cell-value-wrap"
          onClick={this.toggleEdit}
        >
          {restProps.children}
        </div>
      );
    }

    switch (type) {
      case 'textarea':
        return (
          <Input.TextArea
            ref={node => (this.input = node)}
            onBlur={this.save}
            { ...props }
          />
        );
      case 'numberInput':
        return (
          <NumberInput
            nodeRef={node => (this.input = node)}
            onBlur={() => this.save()}
            { ...props }
          />
        );
      case 'select':
        {
          const dataProvider = props.dataProvider || [];
          const opts = dataProvider.map(i => {
            const { label, value } = i;
            return <Option key={value} vlaue={value}>{label}</Option>;
          });

          return (
            <Select
              ref={node => (this.input = node)}
              onBlur={this.save}
              { ...props }
            >
              { opts }
            </Select>
          );
        }
      default:
        return (
          <Input
            ref={node => (this.input = node)}
            onBlur={this.save}
            { ...props }
          />
        );
    }
  }

  render() {
    const { editing } = this.state;
    let { editable, dataIndex, title, record, index, handleSave, type, rules, componentProps, formRef, ...restProps } = this.props;
    const component = this.switchComponent({
      type,
      props: componentProps,
      editing,
      restProps
    });

    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form;
              formRef(form);
              return  (
                <FormItem style={{ margin: 0,  }}>
                  {form.getFieldDecorator(dataIndex, {
                    rules,
                    initialValue: record[dataIndex],
                    validateTrigger: 'falsy'
                  })(
                    component,
                  )}
                </FormItem>
              );
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}

export default EditableCell;
