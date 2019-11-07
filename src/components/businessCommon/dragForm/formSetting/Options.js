/*
 * @Description: 表单设置-多选的选择项
 * @Author: danding
 * @Date: 2019-09-23 18:40:25
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-23 19:24:45
 */

import React from 'react';
import cloneDeep from 'lodash.clonedeep';

const { Button, Input, Row, Col } = window.antd;

class Options extends React.PureComponent {
  // 修改输入框的值
  changeLabel = (e, paramName) => {
    let { value = [] } = this.props;
    const matchIdx = value.findIndex(i => i.value === paramName);
    value[matchIdx] = { ...value[matchIdx], label: e.target.value };
    this.props.onChange(value);
  }

  // 删除
  remove = (idx) => {
    const { value } = this.props;
    const cloneOpts = cloneDeep(value);
    cloneOpts.splice(idx, 1);
    this.props.onChange(cloneOpts);
  }

  // 新增
  add = (idx) => {
    const { value } = this.props;
    const cloneOpts = cloneDeep(value);
    const addOpt = {
      label: `选项${value.length + 1}`,
      value: T.tool.createUuid('option')
    };
    cloneOpts.splice(idx + 1, 0, addOpt);
    this.props.onChange(cloneOpts);
  }

  // 创建输入框集合
  createItem = (config) => {
    return config.map((i, idx) => {
      const { value, label } = i;
      return (
        <Row type="flex" key={value}>
          <Col style={{marginRight: '9px'}}>
            <Input
              maxLength={50}
              value={label}
              onChange={(e) => this.changeLabel(e, value)}
            />
          </Col>
          <Col style={{marginRight: '4px'}}>
            <Button
              disabled={(config.length === 1)}
              size="small"
              shape="circle"
              icon="minus"
              onClick={() => this.remove(idx)}
            />
          </Col>
          <Col>
            <Button
              size="small"
              shape="circle"
              icon="plus"
              onClick={() => this.add(idx)}
            />
          </Col>
        </Row>
      );
    });
  }

  render() {
    const { value = [] } = this.props;

    return (
      <div>
        { this.createItem(value) }
      </div>
    );
  }
}

export default Options;
