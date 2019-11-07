/*
 * @Description: 快捷入口-检索
 * @Author: danding
 * @Date: 2019-04-23 09:45:42
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-29 18:27:48
 */

import React from 'react';
import Separate from 'components/common/Separate';

const { Form, Input, Select, Button } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
const style = { width: 200 };

class SearchBar extends React.PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    const data = this.props.form.getFieldsValue();
    this.props.handleSubmit({ ...data, currentPage: 1 });
  }

  render() {
    const { form, onAdd } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form
        className="form-inline"
        layout="inline"
        onSubmit={this.handleSubmit}
      >
        <FormItem
          label="入口名称"
          colon={false}
        >
          {getFieldDecorator('entryName')(
            <Input placeholder="请输入入口名称" style={style} />
          )}
        </FormItem>
        <FormItem
          label="是否打开新页面"
          colon={false}
        >
          {getFieldDecorator('openNewPage', {
                initialValue: ''
          })(
            <Select placeholder="请选择发表状态" style={style}>
              <Option value="">全部</Option>
              <Option value={true}>是</Option>
              <Option value={false}>否</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          label="有效性"
          colon={false}
        >
          {getFieldDecorator('enabled', {
                initialValue: ''
          })(
            <Select placeholder="请选择有效性" style={style}>
              <Option value="">全部</Option>
              <Option value={true}>有效</Option>
              <Option value={false}>无效</Option>
            </Select>
          )}
        </FormItem>
        <div>
          <FormItem
            label=" "
            colon={false}
          >
            <Button type="primary" htmlType="submit">查询</Button>
            <Separate size={20} isVertical={false} />
            <Button type="primary" onClick={onAdd}>新增快捷入口</Button>
          </FormItem>
        </div>
      </Form>
    );
  }
}

export default Form.create()(SearchBar);


