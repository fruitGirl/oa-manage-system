/*
 * @Description: 修改登录密码
 * @Author: qianqian
 * @Date: 2019-02-13 17:29:31
 * @Last Modified by: lanlan
 * @Last Modified time: 2019-03-12 09:24:22
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
// import 'styles/user/changeLoginPassword.less';
const { Form, Button, Input, message, LocaleProvider, zh_CN } = window.antd;
const FormItem = Form.Item;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.updatePassWord(values);
      }
    });
  };
  updatePassWord = (values) => {
    this.setState({
      loading: true
    });
    T.post(CONFIG.changeLoginPasswordUrl, values)
      .then((data) => {
        // if (data.success) {
        message.success('修改成功');
        setTimeout(() => {
          window.location.href = `${T.userPath}/userLogin.htm`;
        }, 1000);
        // } else {
        //   T.showError(data);
        // }
        this.setState({
          loading: false
        });
      })
      .catch((data) => {
        T.showError(data);
        this.setState({
          loading: false
        });
      });
  };
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('changePassword')) {
      callback('请与新密码输入一致');
    } else {
      callback();
    }
  };
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };
  render() {
    const formlayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8 }
    };
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Form onSubmit={this.handleSubmit} className="bg-white antd_form_horizontal clearfix">
          <FormItem label="原密码" {...formlayout} colon={false}>
            {getFieldDecorator('oldPassword', {
              rules: [
                { required: true, message: '请输入原密码' },
                { max: 20, message: '至多为20位' },
              ],
              validateFirst: true
            })(<Input className="input_width" type="password" />)}
          </FormItem>
          <FormItem label="新密码" {...formlayout} colon={false}>
            {getFieldDecorator('changePassword', {
              rules: [
                { required: true, message: '请输入新密码' },
                { min: 8, message: '至少为8位' },
                { max: 20, message: '至多为20位' },
                { pattern: T.password, message: '请输入8-20位数字及字母的组合' },
                {
                  validator: this.checkConfirm
                }
              ],
              validateFirst: true
            })(<Input className="input_width" type="password" />)}
          </FormItem>
          <FormItem label="重复新密码" {...formlayout} colon={false}>
            {getFieldDecorator('againChangePassword', {
              rules: [
                { required: true, message: '请重新输入新密码' },
                { min: 8, message: '至少为8位' },
                { max: 20, message: '至多为20位' },
                { pattern: T.password, message: '请输入8-20位数字及字母的组合' },
                {
                  validator: this.checkPassword
                }
              ],
              validateFirst: true
            })(<Input className="input_width" type="password" />)}
          </FormItem>

          <FormItem label=" " colon={false} {...formlayout}>
            <Button type="primary" htmlType="submit">
              修改
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
const WrapApp = Form.create()(App);
ReactDOM.render(
  <LocaleProvider locale={zh_CN}>
    <BasicLayout>
      <WrapApp />
    </BasicLayout>
  </LocaleProvider>,
  document.getElementById('root')
);
