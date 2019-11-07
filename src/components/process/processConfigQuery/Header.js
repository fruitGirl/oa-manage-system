/*
 * @Description: 审批管理-头部（按钮集合、查询操作）
 * @Author: danding
 * @Date: 2019-09-10 14:18:49
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-10 14:44:52
 */

import React from 'react';
import Separate from 'components/common/Separate';
import { ENABLE_STATUS, STOP_STATUS } from 'constants/process/processConfigQuery';

const { Button, Form, Input, Select, Row, Col } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;

class Header extends React.PureComponent {
  onSearch = () => {
    const vals = this.props.form.getFieldsValue();
    let { status } = vals;
    status = status === 'ALL' ? '' : status;
    this.props.onSearch({ ...vals, status });
  }

  goCreatePage = () => {
    this.props.goCreatePage();
  }

  addClassification = () => {
    this.props.addClassification();
  }

  sort = () => {
    this.props.onSort();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Row type="flex" justify="space-between" align="middle">
        <Col>
          <Button type="primary" onClick={this.goCreatePage}>新增审批</Button>
          <Separate isVertical={false} />
          <Button onClick={this.addClassification}>新增分类</Button>
          <Separate isVertical={false} />
          <Button onClick={this.sort}>分类排序</Button>
        </Col>
        <Col>
          <Form layout="inline">
            <FormItem>
              {getFieldDecorator('name')(
                <Input placeholder="请输入审批名称" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('status', {
                initialValue: 'ALL'
              })(
                <Select style={{width: '100px'}}>
                  <Option key="ALL">全部</Option>
                  <Option key={ENABLE_STATUS}>启用</Option>
                  <Option key={STOP_STATUS}>停用</Option>
                </Select>
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.onSearch}>查询</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default Form.create()(Header);
