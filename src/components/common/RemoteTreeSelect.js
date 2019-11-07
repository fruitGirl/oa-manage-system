/*
 * @Description: 远程数据的 TreeSelect
 * @Author: danding
 * @Date: 2019-08-07 17:29:40
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-07 17:45:22
 */

import React from 'react';
import PropTypes from 'prop-types';

const { TreeSelect } = window.antd;

class RemoteTreeSelect extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      treeData: []
    };
  }

  componentDidMount() {
    this.fetchData(this.props.action);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // 接口改变时
    if (nextProps.action !== this.props.action) {
      this.fetchData(nextProps.action);
    }
  }

  onChange = (value) => {
    this.props.onChange(value);
    this.props.onChangeVal && this.props.onChangeVal(value);
  }

  fetchData = async (action) => {
    if (!action) return;
    const { parseStructure } = this.props;
    try {
      const data = await T.get(action);
      const parseData = parseStructure(data);
      this.setState({
        treeData: parseData
      });
    } catch (err) {
      T.showErrorMessage(err);
    }
  }

  render() {
    const { value, style } = this.props;
    const { treeData } = this.state;

    return (
      <TreeSelect
        style={style}
        showSearch
        value={value}
        treeData={treeData}
        treeNodeFilterProp="title"
        placeholder="请选择"
        onChange={this.onChange}
      />
    );
  }
}

RemoteTreeSelect.propTypes = {
  value: PropTypes.any,
  action: PropTypes.string, // 接口
  onChange: PropTypes.func,
  parseStructure: PropTypes.func, // 解析数据结构
  style: PropTypes.object, // 样式
};

RemoteTreeSelect.defaultProps = {
  value: null,
  action: '',
  onChange: () => {},
  parseStructure: () => {},
  style: { width: '176px' }
};

export default RemoteTreeSelect;
