/*
 * @Description: 系统-员工角色查询
 * @Author: qianqian
 * @Date: 2019-02-18 15:30:29
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-03-01 12:25:55
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
const { Form, Input, Button, Checkbox, Row, Col, message, LocaleProvider, zh_CN } = window.antd;

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

class userRoleQueryForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      modifyDisabled: false,
      success: false,
      roleList: [],
      roleIds: [],
      checkedValues: [],
      userId: ''
    };
  }
  // 进入页面要运行的函数
  componentDidMount() {}

  // 去空
  strTrim(str) {
    return str.replace(/\s/g, '');
  }

  //表单提交验证
  handleSubmit(e) {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      e.preventDefault();
      if (errors) {
        return;
      }

      const url = CONFIG.userRoleQueryJsonUrl;

      const params = {
        nickName: values['nickName']
      };

      // 提交按钮不可点
      this.setState({
        disabled: true
      });

      T.post(url, params)
        .then((data) => {
          const roleList = data.roleList;
          const roleIds = data.roleIds;

          // 提交按钮可点
          this.setState({
            disabled: false,
            success: true,
            roleList: roleList,
            roleIds: roleIds,
            userId: data.user.userId,
            checkedValues: roleIds
          });
        })
        .catch((data) => {
          // 提交按钮可点
          this.setState({
            disabled: false,
            success: false
          });
          T.showError(data);
        });
    });
  }
  modifyHandleSubmit(e) {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      e.preventDefault();
      if (errors) {
        return;
      }

      let url = `${CONFIG.modifyUrl}?userId=${this.state.userId}`;
      this.state.checkedValues.forEach((i) => {
        url += `&roleIds=${i}`;
      });


      // 提交按钮不可点
      this.setState({
        modifyDisabled: true
      });

      T.get(url)
        .then(() => {
          message.success('修改成功！');
          // 提交按钮可点
          this.setState({
            modifyDisabled: false,
            success: true
          });
        })
        .catch((data) => {
          message.error(data['errorMessage']);
          // 提交按钮可点
          this.setState({
            modifyDisabled: false,
            success: true
          });
        });
    });
  }

  onChange(checkedValues) {
    this.setState({
      checkedValues: checkedValues
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { disabled, modifyDisabled, success, roleList, checkedValues } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      }
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 2 }
      }
    };

    return (
      <Form
        name="userRoleQueryForm"
        method="post"
        id="userRoleQueryForm"
        noValidate="novalidate"
        onSubmit={(e) => this.handleSubmit(e)}
        className="bg-white antd_form_horizontal"
      >
        <FormItem {...formItemLayout} label="花名" colon={false} key="nickName">
          {getFieldDecorator('nickName', {
            rules: [{ required: true, message: '请输入员工花名' }]
          })(<Input className="input_width" maxLength={30} placeholder="请输入员工花名" />)}
        </FormItem>
        <FormItem {...formItemLayoutWithOutLabel} style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" disabled={disabled} className="oa-btn">
            查询
          </Button>
        </FormItem>
        <div className={success ? '' : 'hide'} style={{ marginLeft: 100 }}>
          <CheckboxGroup value={checkedValues} onChange={(e) => this.onChange(e)} style={{ width: '100%' }}>
            <Row>
              {roleList.map((item) => {
                return (
                  <Col className="mb10" span={4} key={item.id}>
                    <Checkbox value={item.id}>{item.roleName}</Checkbox>
                  </Col>
                );
              })}
            </Row>
          </CheckboxGroup>
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="primary" disabled={modifyDisabled} onClick={(e) => this.modifyHandleSubmit(e)}>
              修改
            </Button>
          </FormItem>
        </div>
      </Form>
    );
  }
}

const WrappeduserRoleQueryForm = Form.create()(userRoleQueryForm);
const mountNode = document.getElementById('root');

ReactDOM.render(
  <LocaleProvider locale={zh_CN}>
    <BasicLayout>
      <WrappeduserRoleQueryForm />
    </BasicLayout>
  </LocaleProvider>,
  mountNode
);
