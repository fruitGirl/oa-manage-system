/*
 * @Description: 周报月报统计-检索
 * @Author: juyang
 * @Date: 2019-05-13 18:58:39
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 17:55:28
 */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Separate from 'components/common/Separate';
import DepartmentTree from 'components/businessCommon/departmentTree';

const { Form,  Button, DatePicker }  =  window.antd;
const FormItem = Form.Item;
const style = { width: 200 };
const { WeekPicker } = DatePicker;

class SearchBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      departTreeIsInited: false,

      /** 默认取 props 里面的值 */
      departmentId: props.departmentId
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.getDepartmentList({isSelfDepartment: false});
  }

  getSelfDepartmentList = (e) => {
    e.preventDefault();
    this.setState({
      /** 恢复默认的值 */
      departmentId: this.props.myDepartmentId
    }, () => {
      this.getDepartmentList({isSelfDepartment: true});
    });
  }

  getDepartmentList = (param) => {
    const data = this.props.form.getFieldsValue();

    /** 由 moment 类型格式化为 年-周 形式 */
    data.reportTime = data.reportTime.format('YYYY-w');

    /** 要使用 this.state.departmentId，否则不能获得正确的值  */
    this.props.handleSubmit({ ...param,  ...data, departmentId: this.state.departmentId});
  }

  onDepartmentTreeChange = (val, isSelfDepartment) => {
    this.setState({
      departmentId: val
    }, () => {
      /** 如果是第一次获得 */
      if(this.state.departTreeIsInited === false){
        this.setState({
          departTreeIsInited: true
        });

        /** 直接查询 */
        this.getDepartmentList({isSelfDepartment: isSelfDepartment});
      }
    });
  }

  render() {
    const { form, isGetingInfo, isGetingSelfDepartmentInfo } = this.props;
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
            rules: [{ required: true, message: '请选择日期' }]
          })(
            <WeekPicker style={style} />
          )}
        </FormItem>
        <FormItem
          label="部门"
          colon={false}
        >
          {getFieldDecorator('departmentId', {
            rules: [{ required: true, message: '请选择部门' }]
          })(
            <DepartmentTree onChange={this.onDepartmentTreeChange} treeValue={departmentId} />
          )}
        </FormItem>
        <div>
          <FormItem
            label=" "
            colon={false}
          >
            <Button type="primary" htmlType="submit" loading={isGetingInfo}>查询</Button>
            <Separate isVertical={false} />
            <Button onClick={this.getSelfDepartmentList} loading={isGetingSelfDepartmentInfo}>查看本部门</Button>
          </FormItem>
        </div>
      </Form>
    );
  }
}

SearchBar.propTypes = {
  showModal: PropTypes.bool,
};

SearchBar.defaultProps = {
  showModal: false,
  /** 我的部门 ID */
  myDepartmentId: window.CONFIG.pageData && window.CONFIG.pageData.departmentId,
  /** 当前选中的部门 ID */
  departmentId: window.CONFIG.pageData && window.CONFIG.pageData.departmentId,
  isGetingSelfDepartmentInfo: false,
  isGetingInfo: false
};

export default Form.create()(SearchBar);


