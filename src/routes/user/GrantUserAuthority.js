/*
 * @Description: 系统-授予员工权限
 * @Author: qianqian
 * @Date: 2019-02-18 15:15:43
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 17:36:16
 */
import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import TreeSelectComptent from 'components/businessCommon/TreeSelectComptent';
const { Form, Select, Input, Button, message, LocaleProvider, zh_CN } = window.antd;

const FormItem = Form.Item;
const Option = Select.Option;
// const SHOW_PARENT = TreeSelect.SHOW_PARENT;
class GrantUserAuthority extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      domainVal: ''
    };
  }
  //表单提交(请求的是查询接口)
  handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      const nickName = values['nickName'] ? encodeURIComponent(values['nickName']) : '';
      const domain = values['domain'];
      const authorityId = values['authorityIds'];
      const departmentId = this.props.grantUserAuthority.departmentId;
      const isIncludeChildDept = values['isIncludeChildDept'] ? values['isIncludeChildDept'] : '';
      let authorityIds = '';
      authorityId.forEach((item) => {
        authorityIds += `authorityIds=${item}&`;
      });
      const url = `${
        T['userPath']
      }/grantUserAuthority.json?${authorityIds}nickName=${nickName}&domain=${domain}&departmentId=${departmentId}&isIncludeChildDept=${isIncludeChildDept}`;

      T.post(url)
        .then(() => {
          message.success('创建成功');
        })
        .catch((data) => {
          T.showError(data);
        });
    });
  };
  handleDomainChange = (value) => {
    this.setState({ domainVal: value });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const grantUserAuthority = this.props.grantUserAuthority;
    const dispatch = this.props.dispatch;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 9 }
      }
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 9, offset: 2 }
      }
    };
    const treeSelectComptentConfig = {
      dispatch,
      pageData: grantUserAuthority,
      nameSpace: 'grantUserAuthority',
      formItemLayout: formItemLayout,
      label: '可操作部门',
      form: this.props.form,
      inputId: 'operationalDepartment',
      departmentIdConfig: {}
    };
    //作用域的下拉框
    const domainOption = CONFIG.domainConfigId.map((item, index) => {
      const { label, value } = item;
      return (
        <Option key={value} value={value}>
          {label}
        </Option>
      );
    });
    //权限名的下拉框
    const authorityOption = CONFIG.authorityId.map((item) => {
      return (
        <Option value={item} key={item}>
          {CONFIG.authorityMap[item]}
        </Option>
      );
    });
    return (
      <LocaleProvider locale={zh_CN}>
        <BasicLayout>
          <Form onSubmit={this.handleSubmit} className="bg-white antd_form_horizontal">
            <FormItem {...formItemLayout} label="授权对象" key="nickName" className="formLable" colon={false}>
              {getFieldDecorator('nickName', {
                initialValue: '',
                rules: [{ required: true, message: '请输入授权对象' }]
              })(<Input className="modal_input" type="text" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="作用域" key="domain" className="formLable" colon={false}>
              {getFieldDecorator('domain', {
                initialValue: '',
                rules: [{ required: true, message: '请选择作用域' }]
              })(
                <Select style={{ width: '202px' }} onChange={this.handleDomainChange}>
                  <Option value="">全部</Option>
                  {domainOption}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="权限名" key="authorityIds" className="formLable" colon={false}>
              {getFieldDecorator('authorityIds', {
                initialValue: [],
                rules: [
                  // { required: true, message: '请选择权限名' },
                ]
              })(
                <Select mode="multiple" style={{ width: '425px' }} placeholder="请选择" optionFilterProp="children">
                  {authorityOption}
                </Select>
              )}
            </FormItem>
            {this.state.domainVal === 'OA' ? (
              <div>
                <FormItem {...formItemLayout} label="可操作部门" key="operationalDepartment" colon={false}>
                  {getFieldDecorator('operationalDepartment', {})(<TreeSelectComptent {...treeSelectComptentConfig} />)}
                </FormItem>
                {/* <TreeSelectComptent {...treeSelectComptentConfig}/> */}
                <FormItem
                  {...formItemLayout}
                  label="是否包含子部门"
                  key="isIncludeChildDept"
                  className="formLable"
                  colon={false}
                >
                  {getFieldDecorator('isIncludeChildDept', {
                    initialValue: 'false'
                  })(
                    <Select style={{ width: 202 }}>
                      {/* <Option value="">全部</Option> */}
                      <Option value="true">是</Option>
                      <Option value="false">否</Option>
                    </Select>
                  )}
                </FormItem>
              </div>
            ) : (
              ''
            )}
            <FormItem {...formItemLayoutWithOutLabel}>
              <Button type="primary" className="oa-btn" htmlType="submit">
                创建
              </Button>
            </FormItem>
          </Form>
        </BasicLayout>
      </LocaleProvider>
    );
  }
}

export default connect(({ grantUserAuthority }) => ({ grantUserAuthority }))(Form.create()(GrantUserAuthority));
