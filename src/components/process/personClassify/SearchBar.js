/*
 * @Description: 员工分类-查询
 * @Author: moran 
 * @Date: 2019-09-24 11:39:18 
 * @Last Modified by: moran
 * @Last Modified time: 2019-09-25 15:00:54
 */
import React from 'react';
import { parseDepartmentTreeData, parseCompanyTreeData } from 'constants/performance';
import { URL_COMPANY_DATA, URL_DEPARTMENT_DATA } from 'constants/process/personList';
import RemoteTreeSelect from 'components/common/RemoteTreeSelect';
const { Form, Input, Button } = window.antd;
const FormItem = Form.Item;

class SearchBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companyId: '' // 公司id
    };
  }

  // 搜索
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSearch && this.props.onSearch({ ...values });
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
          <FormItem label="花名" key="nickName" colon={false}>
            {getFieldDecorator('nickName', {
              initialValue: ''
            })(<Input placeholder="请输入花名" type="text" maxLength={20} />)}
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