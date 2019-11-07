/*
 * @Description: 远程数据下拉选择框
 * @Author: danding
 * @Date: 2019-08-14 14:28:17
 * @Last Modified by: moran
 * @Last Modified time: 2019-09-25 17:31:24
 */
import React from 'react';
import PropTypes from 'prop-types';

const { Select } = window.antd;
const { Option } = Select;

class RemoteSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 下拉数据源
    };
  }

  UNSAFE_componentWillMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const { action, parseFunc } = this.props;
    this.setState({ fetching: true });
    try {
      const data = await T.get(action);
      const combineData = parseFunc(data || []);
      this.setState({ data: combineData });
    } catch (err) {
      T.showErrorMessage(err);
    }
  };

  handleChange = value => {
    this.props.onChange(value);
  };

  render() {
    const { data } = this.state;
    const { value, mode, placeholder } = this.props;

    return (
      <Select
        mode={mode}
        showSearch
        defaultActiveFirstOption={false}
        value={value}
        placeholder={placeholder}
        onChange={this.handleChange}
        style={{ width: '100%' }}
        optionFilterProp="children"
      >
        {data.map(d => (
          <Option key={d.value} value={d.value}>{d.label}</Option>
        ))}
      </Select>
    );
  }
}

RemoteSelect.propTypes = {
  onChange: PropTypes.func,
  action: PropTypes.string,
  parseFunc: PropTypes.func,
  mode: PropTypes.string,
  placeholder: PropTypes.string
};

RemoteSelect.defaultProps = {
  onChange: () => {}, // 改变选中值
  parseFunc: () => {}, // 解析请求结果，重构数据结构
  action: '', // 请求接口
  mode: '',
  placeholder: '请输入关键字'
};

export default RemoteSelect;
