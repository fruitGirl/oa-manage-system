/*
 * @Description: 查询我的周报月报
 * @Author: danding
 * @Date: 2019-05-16 14:17:09
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 17:53:34
 */

import React from 'react';
import PropTypes from 'prop-types';
import Separate from 'components/common/Separate';
import { STATUS } from 'constants/components/workReport/myWorkReport';
import { MONTH_REPORT, WEEK_REPORT } from 'constants/workReport/statusNav';

const { Form, Select, Button, DatePicker } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
const WeekPicker = DatePicker.WeekPicker;
const style = { width: 200 };

class SearchBar extends React.PureComponent {
  componentDidMount() {
    this.search();
  }

  search = () => {
    const { selectedNavKey } = this.props;
    const data = this.props.form.getFieldsValue();
    let { date } = data;
    let typeCode;

    // 月报查询
    if (selectedNavKey === MONTH_REPORT) {
      typeCode = MONTH_REPORT;
      date = date ? date.format('YYYY-MM') : undefined;
    } else { // 周报查询
      date = date ? date.format('YYYY-w') : undefined;
      typeCode = WEEK_REPORT;
    }
    this.props.handleSubmit({
      ...data,
      typeCode,
      date,
      currentPage: 1
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.search();
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
          label="日期"
          colon={false}
        >
          {getFieldDecorator('date')(
            <WeekPicker style={style} />
          )}
        </FormItem>
        <FormItem
          label="状态"
          colon={false}
        >
          {getFieldDecorator('status', {
            initialValue: ''
          })(
            <Select style={style} placeholder="请选择">
              <Option value="">全部</Option>
              {
                STATUS.map(i => {
                  const { label, value } = i;
                  return <Option value={value}>{label}</Option>;
                })
              }
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
            <Button type="primary" href="/workReport/weekReportEdit.htm">新增周报</Button>
          </FormItem>
        </div>
      </Form>
    );
  }
}

SearchBar.propTypes = {
  selectedNavKey: PropTypes.string,
  handleSubmit: PropTypes.func
};

SearchBar.defaultProps = {
  selectedNavKey: WEEK_REPORT,
  handleSubmit: () => {}
};

export default Form.create()(SearchBar);


