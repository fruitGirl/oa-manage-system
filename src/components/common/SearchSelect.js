/*
 * @Description: 实时查询下拉框
 * @Author: danding
 * @Date: 2019-08-14 14:28:17
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-15 15:36:03
 */
import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

const { Select, Spin } = window.antd;
const { Option } = Select;

class SearchSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.defaultDataProvider || [], // 下拉数据源
      fetching: false, // 正在请求
    };
    this.fetchData = debounce(this.fetchData, 500);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // 更新初始化的下拉框数据源
    if (
      nextProps.defaultDataProvider
      && (nextProps.defaultDataProvider !== this.props.defaultDataProvider)
    ) {
      this.setState({
        data: nextProps.defaultDataProvider || []
      });
    }
  }

  fetchData = async (value) => {
    const { action, param, parseFunc } = this.props;
    this.setState({ fetching: true });
    try {
      const data = await T.get(action, { [param]: value });
      const combineData = parseFunc(data || []);
      this.setState({ data: combineData, fetching: false });
    } catch (err) {
      this.setState({ fetching: false });
      T.showErrorMessage(err);
    }
  };

  handleChange = value => {
    this.setState({
      fetching: false,
    });
    this.props.onChange(value);
  };

  render() {
    const { fetching, data } = this.state;
    const { value, placeholder, mode } = this.props;

    return (
      <Select
        mode={mode}
        dropdownClassName='search-select'
        showSearch
        defaultActiveFirstOption={false}
        value={value}
        placeholder={placeholder}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchData}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(d => (
          <Option key={d.value} value={d.value}>{d.label}</Option>
        ))}
      </Select>
    );
  }
}

SearchSelect.propTypes = {
  onChange: PropTypes.func,
  defaultDataProvider: PropTypes.array,
  action: PropTypes.string,
  param: PropTypes.string,
  parseFunc: PropTypes.func,
  placeholder: PropTypes.string,
  mode: PropTypes.string
};

SearchSelect.defaultProps = {
  onChange: () => {}, // 改变选中值
  parseFunc: () => {}, // 解析请求结果，重构数据结构
  defaultDataProvider: [], // 初始下拉数据源
  action: '', // 请求接口
  params: '', // 请求的search
  placeholder: '请输入关键字',
  mode: '', // 模式
};

export default SearchSelect;
