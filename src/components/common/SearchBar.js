
/*
 * @Description: 查询表单组件
 * @Author: moran
 * @Date: 2019-08-16 14:10:43
 * @Last Modified by: moran
 * @Last Modified time: 2019-09-24 11:38:45
 */
import React from 'react';
import PropTypes from 'prop-types';
import RemoteTreeSelect from 'components/common/RemoteTreeSelect';
import { isArray } from 'util';
import 'styles/components/common/searchBar.less';

const { Row, Col, Form, Input, Select, DatePicker, Button, InputNumber } = window.antd;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const ALL_OPT_VAL = 'allOptVal';
const inputStyles = { width: '100%' };
const normalFormItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

class SearchBar extends React.PureComponent {
  handleSearch = (e) => {
    e.preventDefault();
    const { configs } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const dateConfigs = configs.filter(i => i.type === 'datePick' || i.type === 'rangePicker'); // 时间类型数据
        // 时间类型数据转换
        const dateValues = {};
        dateConfigs.forEach(i => {
          const { field, props } = i;
          const { format } = props;
          if (!values[field]) return;

          // type为‘rangePicker’时间段 的数据处理
          if (isArray(values[field])) {
            dateValues[field] = values[field].map(res => {
              return res.format(format);
            });
          } else { // datePick的日期转换
            dateValues[field] = values[field].format(format);
          }
        });
        this.props.onSearch && this.props.onSearch({ ...values, ...dateValues });
      }
    });
  }

  matchComponent = ({ type, props }) => {
    // 更新组件
    const combineProps = { ...props, onChange: (val) => {
      this.props.onChange(val);
    } };
    switch(type) {
      case 'input': {
        return (
          <Input style={inputStyles} { ...props } />
        );
      }
      case 'inputNumber': {
        return (
          <InputNumber style={inputStyles} { ...props }/>
        );
      }
      case 'select': {
        let dataProvider = props.dataProvider || [];

        // 是否需要全部选择
        if (props.hasAllOpt) {
          dataProvider = [
            { label: '全部', value: ALL_OPT_VAL },
            ...dataProvider
          ];
        }

        const options = dataProvider.map(res => {
          const { label, value } = res;
          return <Option key={label} vlaue={value}>{label}</Option>;
        });

        return (
          <Select style={inputStyles} { ...props }
          >{options}</Select>
        );
      }
      case 'datePick': {
        return (
          <DatePicker { ...props } />
        );
      }
      case 'rangePicker': {
        return (
          <RangePicker { ...props } />
        );
      }

      case 'remoteTreeSelect': {
        return (
          <RemoteTreeSelect { ...combineProps }/>
        );
      }

      default:
        break;
    }
  }

  /**
   * 生成控件布局
   * @param {Boolean} isDouble 是否占据两倍布局
   */
  getLayout(isDouble) {
    let layout = normalFormItemLayout;
    let span = 8;
    let xl = 6;

    // 双倍布局
    if (isDouble) {
      span = 16;
      xl = 12;
      layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 19 },
      };
    }

    return {
      layout,
      span,
      xl,
    };
  }

  getFields() {
    const { form, configs } = this.props;
    const { getFieldDecorator } = form;

    return configs.map(i => {
      const { label, field, type, props } = i;
      const { initialValue, rules, isDoubleLayout } = props;
      const component = this.matchComponent({ type, props });
      const { layout, span, xl } = this.getLayout(isDoubleLayout);

      return (
        <Col span={span} xl={xl} key={field}>
          <FormItem label={label} {...layout} colon={false}>
            {getFieldDecorator(field, {
              initialValue,
              rules: rules,
            })(component)}
          </FormItem>
        </Col>
      );
    });
  }

  render() {
    const { buttonComponent, showBtn, showSearchBtn } = this.props;
    return (
        <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
          <Row gutter={24}>{this.getFields()}</Row>
          {showBtn && <Row gutter={24}>
            <Col span={8}>
              <FormItem label=' ' {...normalFormItemLayout} colon={false}>
                {showSearchBtn && <Button type="primary" onClick={this.handleSearch}>查询</Button>}
                {buttonComponent}
              </FormItem>
            </Col>
          </Row>}
        </Form>
    );
  }
}

SearchBar.propTypes = {
  configs: PropTypes.array.isRequired, // 表单配置
  buttonComponent: PropTypes.string, // 按钮组件
  showBtn: PropTypes.bool, // 是否显示按钮
  showSearchBtn: PropTypes.bool, // 是否显示查询按钮
  formItemLayout: PropTypes.object // 布局
};

SearchBar.defaultProps = {
  configs: [],
  buttonComponent: null,
  showBtn: true,
  showSearchBtn: true,
  formItemLayout: {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  }
};

export default Form.create()(SearchBar);
