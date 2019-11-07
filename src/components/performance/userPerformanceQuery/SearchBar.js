/*
 * @Description: 用户查询条件表单
 * @Author: danding
 * @Date: 2019-08-07 10:22:54
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-07 16:39:10
 */

import React from 'react';
import PropTypes from 'prop-types';
import 'styles/performance/userPerformanceQuery.less';
import { createPerformanceYears, PERFORMANCE_TYPE, PERFORMANCE_RANGE, parseDepartmentTreeData, parseCompanyTreeData, QUARTER_PERFORMANCE } from 'constants/performance/index';
import { USER_TAB_KEY, URL_DEPARTMENT_DATA, URL_COMPANY_DATA } from 'constants/performance/userPerformanceQuery';
import RemoteTreeSelect from 'components/common/RemoteTreeSelect';

const { Form, Button, Input, Select } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
const inputItemStyle = { width: 200 };

class UserSearchBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companyId: '', // 选择的公司id
      showQuarterPerformance: false, // 显示季度下拉
    };
  }

  submit = (e) => {
    e.preventDefault();
    const data = this.props.form.getFieldsValue();
    let { performanceTypeCode, timeRange } = data;

    // 解决选择非季度类型，查询时带上上一次的季度
    if (performanceTypeCode !== QUARTER_PERFORMANCE) {
      timeRange = undefined;
    }

    this.props.submit({ ...data, timeRange });
  }

  changeCompany = (val) => {
    this.setState({
      companyId: val
    });

    this.props.form.resetFields(['departmentId']);
  }

  // 选择类型
  changeType = (val) => {
    let showQuarterPerformance = false;

    // 选择季度
    if (val === QUARTER_PERFORMANCE) {
      showQuarterPerformance = true;
    }

    this.setState({
      showQuarterPerformance
    });
  }

  render() {
    const { form, selectedTabKey } = this.props;
    const { getFieldDecorator } = form;
    const { companyId, showQuarterPerformance } = this.state;

    return (
      <Form
        className="form-inline search-wrapper"
        layout="inline"
        onSubmit={this.submit}
      >
        <FormItem colon={false} label="年度">
          {getFieldDecorator('year', {
            initialValue: new Date().getFullYear()
          })(
            <Select
              showSearch
              dropdownMatchSelectWidth={false}
              placeholder="请选择"
              style={inputItemStyle}
            >
              {
                createPerformanceYears().map(i => {
                  const { label, value } = i;
                  return <Option value={value}>{label}</Option>;
                })
              }
            </Select>
          )}
        </FormItem>
        <FormItem colon={false} label="类型">
          {getFieldDecorator('performanceTypeCode', {
            initialValue: ''
          })(
            <Select
              showSearch
              dropdownMatchSelectWidth={false}
              placeholder="请选择"
              style={inputItemStyle}
              onChange={this.changeType}
            >
              <Option value="">全部</Option>
              {
                PERFORMANCE_TYPE.map(i => {
                  const { label, value } = i;
                  return <Option value={value}>{label}</Option>;
                })
              }
            </Select>
          )}
        </FormItem>
        {showQuarterPerformance
          ? <FormItem colon={false} label="季度">
            {getFieldDecorator('timeRange', {
              initialValue: ''
            })(
              <Select
                showSearch
                dropdownMatchSelectWidth={false}
                placeholder="请选择"
                style={inputItemStyle}
              >
                <Option value="">全部</Option>
                {
                  PERFORMANCE_RANGE.map(i => {
                    const { label, value } = i;
                    return <Option value={value}>{label}</Option>;
                  })
                }
              </Select>
            )}
          </FormItem>
          : null
        }
        {
          selectedTabKey === USER_TAB_KEY
            ? <FormItem label="阶段" colon={false}>
                {getFieldDecorator('status', {
                  initialValue: ''
                })(
                  <Select
                    showSearch
                    style={inputItemStyle}
                  >
                    <Option value="">全部</Option>
                    {CONFIG.statusArr.map((item) => {
                      const { label, value } = item;
                      return (
                        <Option value={value}>
                          { label }
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
            : null
        }
        {
          selectedTabKey === USER_TAB_KEY
            ? <FormItem colon={false} label="花名">
                {getFieldDecorator('nickName')(
                  <Input placeholder="请输入花名" style={inputItemStyle} />
                )}
              </FormItem>
            : null
        }
        <FormItem colon={false} label="公司">
          {getFieldDecorator('companyId')(
            <RemoteTreeSelect
              style={inputItemStyle}
              action={URL_COMPANY_DATA}
              onChangeVal={this.changeCompany}
              parseStructure={parseCompanyTreeData}
            />
          )}
        </FormItem>
        <FormItem colon={false} label="部门">
          {getFieldDecorator('departmentId')(
            <RemoteTreeSelect
              style={inputItemStyle}
              action={companyId ? `${URL_DEPARTMENT_DATA}${companyId}` : ''}
              parseStructure={parseDepartmentTreeData}
            />
          )}
        </FormItem>
        <div>
          <FormItem label=" " colon={false}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: 20 }}
            >
              查询
            </Button>
          </FormItem>
        </div>
      </Form>
    );
  }
}

UserSearchBar.propTypes = {
  submit: PropTypes.func
};

UserSearchBar.defaultProps = {
  submit: () => {}
};

export default Form.create()(UserSearchBar);
