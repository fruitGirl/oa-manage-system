/*
 * @Description: 会议室管理-检索
 * @Author: danding
 * @Date: 2019-04-26 18:20:30
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-29 15:16:49
 */

import React from 'react';
import Separate from 'components/common/Separate';
import PropTypes from 'prop-types';

const { Form, Input, Select, Button, } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
const style = { width: 200 };

class SearchBar extends React.PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    const data = this.props.form.getFieldsValue();
    this.props.handleSubmit(data);
  }

  render() {
    const { form, showModal } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form
        className="form-inline"
        layout="inline"
        onSubmit={this.handleSubmit}
      >
        <FormItem
          label="会议室名称"
          colon={false}
        >
          {getFieldDecorator('name')(
            <Input placeholder="请输入会议室名称" style={style} />
          )}
        </FormItem>
        <FormItem
          label="地点"
          colon={false}
        >
          {getFieldDecorator('location')(
            <Input placeholder="请输入地点" style={style} />
          )}
        </FormItem>
        <FormItem
          label="有效性"
          colon={false}
        >
          {getFieldDecorator('enabled', {
            initialValue: ""
          })(
            <Select placeholder="请选择发表状态" style={style}>
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
            <Separate isVertical={false} size={20}/>
            <Button
              onClick={showModal}
              type="primary"
              htmlType="submit"
            >新增会议室</Button>
          </FormItem>
        </div>
      </Form>
    );
  }
}

SearchBar.propTypes = {
  showModal: PropTypes.bool
};

SearchBar.defaultProps = {
  showModal: false
};

export default Form.create()(SearchBar);


