/*
 * @Description: 部门查询-检索
 * @Author: danding
 * @Date: 2019-05-13 18:58:39
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 15:40:51
 */

import React from 'react';
import Separate from 'components/common/Separate';
import PropTypes from 'prop-types';

const { Form, Input, Button, } = window.antd;
const FormItem = Form.Item;
const style = { width: 200 };

class SearchBar extends React.PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    const data = this.props.form.getFieldsValue();
    this.props.handleSubmit(data);
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form
        className="form-inline"
        layout="inline"
        onSubmit={this.handleSubmit}
      >
        <FormItem
          label="公司名称"
          colon={false}
        >
          {getFieldDecorator('a')(
            <Input placeholder="请输入公司名称" style={style} />
          )}
        </FormItem>
        <FormItem
          label="部门"
          colon={false}
        >
          {getFieldDecorator('b')(
            <Input placeholder="请输入部门" style={style} />
          )}
        </FormItem>
        <FormItem
          label="负责人花名"
          colon={false}
        >
          {getFieldDecorator('enabled')(
            <Input placeholder="请输入花名" style={style} />
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
              onClick={() => this.handleSubmit()}
              type="primary"
            >未设置负责人部门</Button>
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


