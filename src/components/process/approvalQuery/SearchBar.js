/*
 * @Description: 审批查询
 * @Author: moran 
 * @Date: 2019-09-25 09:57:03 
 * @Last Modified by: moran
 * @Last Modified time: 2019-09-25 14:51:58
 */

import React from 'react';
import { parseDepartmentTreeData, parseCompanyTreeData } from 'constants/performance';
import { URL_COMPANY_DATA, URL_DEPARTMENT_DATA } from 'constants/process/personList';
import { APPROVAL_STATUS } from 'constants/process/approvalQuery';
import RemoteTreeSelect from 'components/common/RemoteTreeSelect';
const { Form, Input, Button, DatePicker, Select } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const formatTime = 'YYYY-MM-DD HH:mm:ss';

class SearchBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companyId: ''
    };
  }

  // 搜索
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { gmtCreate } = values;
        // 创建时间
        const minGmtCreate = gmtCreate ? gmtCreate[0].format(formatTime) : null;
        const maxGmtCreate = gmtCreate ? gmtCreate[1].format(formatTime) : null;

        const dataValues = { ...values, minGmtCreate, maxGmtCreate};
        delete dataValues.gmtCreate;
        this.props.onSearch && this.props.onSearch({ ...dataValues });
      }
    });
  }

  // 选择公司
  changeCompany = (val) => {
    this.setState({
      companyId: val
    });
    this.props.form.resetFields(['departmentId']);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { companyId } = this.state;
    
    // 时间参数
    const timeConfig = {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间']
    };
    
    return (
      <Form layout="inline" onSubmit={this.handleSearch}>
        <div>
          <FormItem colon={false} label="公司">
            {getFieldDecorator('companyId')(
              <RemoteTreeSelect
                onChangeVal={this.changeCompany}
                action={URL_COMPANY_DATA}
                parseStructure={parseCompanyTreeData}
              />
            )}
          </FormItem>
          <FormItem colon={false} label="部门">
            {getFieldDecorator('departmentId')(
              <RemoteTreeSelect
                action={companyId ? `${URL_DEPARTMENT_DATA}${companyId}` : ''}
                parseStructure={parseDepartmentTreeData}
              />
            )}
          </FormItem>
          <FormItem label="申请人" key="nickName" colon={false}>
            {getFieldDecorator('nickName', {
              initialValue: ''
            })(<Input placeholder="请输入花名" type="text" maxLength={20} />)}
          </FormItem>
          
          <FormItem label="创建时间" key="gmtCreate" colon={false}>
            {getFieldDecorator('gmtCreate', {
              initialValue: ''
            })(<RangePicker {...timeConfig} />)}
          </FormItem>
          <FormItem label="状态" key="status" colon={false}>
            {getFieldDecorator('status', {
              initialValue: ''
            })(
              <Select className="input_width">
                  {
                    APPROVAL_STATUS.map(i => {
                      const { label, value } = i;
                      return (
                        <Option value={value} key={value}>
                          {label}
                        </Option>
                      );
                    })
                  }
              </Select>
            )}
          </FormItem>
          <FormItem label=' ' colon={false}>
            <Button type="primary" onClick={this.handleSearch}>查询</Button>
          </FormItem>
        </div>
      </Form>
    );
  }
}

export default Form.create()(SearchBar);
