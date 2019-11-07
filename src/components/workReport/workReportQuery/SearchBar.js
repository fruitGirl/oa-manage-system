/*
 * @Description: 周报月报-检索
 * @Author: danding
 * @Date: 2019-05-13 18:58:39
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 17:55:22
 */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DepartmentTree from 'components/businessCommon/departmentTree';

const { Form, Input, Button, DatePicker, Checkbox, }  = window.antd;
const FormItem = Form.Item;
const style = { width: 200 };
const { WeekPicker } = DatePicker;

class SearchBar extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      /** 默认取 props 里面的值 */
      departmentId: props.departmentId
    };

  }

  handleSubmit = (e) => {
    e.preventDefault();
    const data = this.props.form.getFieldsValue();

    /** 加入是月是周的数据 */
    data.typeCode = this.props.selectedNavKey;

    /** 由 moment 类型格式化为 年-周 形式 */
    data.reportTime = data.reportTime && data.reportTime.format('YYYY-w');

    this.props.handleSubmit(data);
  }

  onDepartmentTreeChange = (val) => {
    this.setState({
      departmentId: val
    });
  }

  render() {
    const { form, isLoading} = this.props;
    const { departmentId } = this.state;
    const { getFieldDecorator } = form;

    let week = moment(new Date()).week();
    week = week - 1; // 初始周为上一周

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
          {getFieldDecorator('reportTime', {
            initialValue: moment().week(week),
          })(
            <WeekPicker style={style} />
          )}
        </FormItem>
        <FormItem
          label="部门"
          colon={false}
        >
          {getFieldDecorator('departmentId')(
            <DepartmentTree
              onChange={this.onDepartmentTreeChange}
              treeValue={departmentId}
              placeholder="请选择部门"
            />
          )}
        </FormItem>
        <FormItem
          label=""
          colon={false}
        >
          {getFieldDecorator('needSubDepartment', {
            initialValue: true,
            valuePropName: 'checked'
          })(
            <Checkbox>子部门</Checkbox>
          )}
        </FormItem>
        <FormItem
          label="花名"
          colon={false}
        >
          {getFieldDecorator('nickName')(
            <Input placeholder="请输入花名" style={style} />
          )}
        </FormItem>
        <div>
          <FormItem
            label=" "
            colon={false}
          >
            <Button type="primary" htmlType="submit" loading={isLoading}>查询</Button>
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


