/*
 * @Description: 系统-忘记登录密码
 * @Author: qianqian
 * @Date: 2019-02-18 16:48:17
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 17:05:43
 */
import React from 'react';
import ReactDOM from 'react-dom';
import CellVerifyButton from 'components/businessCommon/CellVerifyButton';
import 'styles/user/findLoginPasswordByCell.less';

const { Steps, Form, Button, Icon, Input, Modal, LocaleProvider, zh_CN } = window.antd;

const Step = Steps.Step;
const FormItem = Form.Item;
const loginUrl = `${CONFIG.frontPath}/user/userLogin.htm`;
const steps = [
  {
    title: '输入手机号码，并获得验证码',
    content: 'First-content'
  },
  {
    title: '重置密码',
    content: 'Second-content'
  },
  {
    title: '成功',
    content: 'Last-content'
  }
];
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
const FindLoginForm = Form.create()((props) => {
  const { getFieldDecorator } = props.form;

  return (
    <Form className="find-login-form" onSubmit={props.submitHandler}>
      <FormItem {...formItemLayout} label="请输入手机号">
        {getFieldDecorator('cell', {
          rules: [
            {
              required: true,
              message: '请输入手机号'
            },
            {
              pattern: T.validator.cell(),
              message: '请输入正确的手机号'
            }
          ],
          validateFirst: true
        })(
          <Input
            className="find-cell"
            placeholder="请输入您的手机号码"
            maxLength={11}
            onInput={(e) => props.inputHandler(e)}
          />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="短信验证码"
        extra={
          props.showSmsSendMsg ? (
            <span>
              <Icon type="check-circle" style={{ color: '#52c41a' }} /> 验证码已发送到绑定手机，{props.timeTip}
              内有效，请注意查收
            </span>
          ) : null
        }
      >
        {getFieldDecorator('cellVerifyCode', {
          rules: [
            {
              required: true,
              message: '请输入您收到的短信验证码'
            },
            {
              pattern: T.validator.number(),
              message: '验证码为数字'
            },
            {
              min: 6,
              message: '最少为6位'
            },
            {
              max: 6,
              message: '最多为6位'
            }
          ],
          validateFirst: true
        })(<Input className="find-verifyCode" placeholder="请输入您收到的短信验证码" maxLength={6} />)}
        <CellVerifyButton
          cell={props.cell}
          needCell={true}
          url={CONFIG.option.smsUrl}
          jsonCallback={(data) => props.cellVerifyCallback(data)}
          countDownCallback={() => props.countDownCallback()}
        />
      </FormItem>
      <FormItem {...formItemLayout} label=" " colon={false}>
        <Button type="primary" htmlType="submit" className="find-btn" loading={props.loading}>
          下一步
        </Button>
      </FormItem>
    </Form>
  );
});
const EditPwdForm = Form.create()((props) => {
  const { getFieldDecorator } = props.form;
  return (
    <Form className="edit-pwd-form" onSubmit={props.submitHandler}>
      <FormItem {...formItemLayout} label="新密码">
        {getFieldDecorator('newPassword', {
          rules: [
            {
              required: true,
              message: '请输入密码!'
            },
            {
              min: 8,
              message: '至少为8位!'
            },
            {
              max: 20,
              message: '至多为20位!'
            },
            {
              pattern: T.password,
              message: '请输入8-20位数字及字母的组合'
            }
          ]
        })(
          <div>
            <Input className="new-pwd" type="password" placeholder="请输入新密码" />
            <span className="text-info"> 建议您使用英文、数字混合的密码并增加长度。</span>
          </div>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="确认新密码">
        {getFieldDecorator('confirmPassword', {
          rules: [
            {
              required: true,
              message: '请再次输入新密码'
            },
            {
              validator: props.checkPassword
            }
          ],
          validateFirst: true
        })(<Input className="new-pwd" type="password" placeholder="请再次输入新密码" />)}
      </FormItem>
      <FormItem {...formItemLayout} label=" " colon={false}>
        <Button type="primary" htmlType="submit" className="pwd-btn" loading={props.loading}>
          下一步
        </Button>
      </FormItem>
    </Form>
  );
});
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      cell: '',
      nextBtnLoading: false,
      editPwdBtnLoading: false,
      showFindLoginForm: true,
      showEditPwd: false,
      showSmsSendMsg: false,
      timeTip: '',
      countDownSeconds: 3 //s
    };
  }
  submitHandler(e) {
    e.preventDefault();
    this.saveFindForm.validateFields((err, values) => {
      if (!err) {
        if (!this.smsId) {
          Modal.error({
            title: '提示',
            content: '请先点击获取验证码'
          });
          return;
        }
        this.setState({
          nextBtnLoading: true
        });
        T.post(CONFIG.option.findUrl, {
          cell: values.cell,
          cellVerifyCode: values.cellVerifyCode,
          smsId: this.smsId
        })
          .then((data) => {
            if (data.success) {
              let map = data.findLoginPasswordByCellSetPasswordForm;
              this.random = map.random;
              this.randomSign = map.randomSign;
              this.userId = map.userId;

              this.setState({
                showFindLoginForm: false,
                showEditPwd: true,
                current: 1
              });
            } else {
              T.showError(data);
            }
            this.setState({
              nextBtnLoading: false
            });
          })
          .catch((data) => {
            T.showError(data);
            this.setState({
              nextBtnLoading: false
            });
          });
      }
    });
  }
  editHandler(e) {
    e.preventDefault();
    this.editPwdForm.validateFields((err, values) => {
      if (!err) {
        this.setState({
          editPwdBtnLoading: true
        });
        T.post(CONFIG.option.editPwdUrl, {
          newPassword: values.newPassword,
          random: this.random,
          randomSign: this.randomSign,
          userId: this.userId
        }).then((data) => {
          if (data.success) {
            this.setState(
              {
                showFindLoginForm: false,
                showEditPwd: false,
                current: 2
              },
              () => {
                this.startSuccessCountDown();
              }
            );
          } else {
            T.showError(data);
          }
          this.setState({
            editPwdBtnLoading: false
          });
        })
        .catch(err => {
          T.showError(err);
          this.setState({
            editPwdBtnLoading: false
          });
        });
      }
    });
  }
  checkPassword(rule, value, callback) {
    if (value && value !== this.editPwdForm.getFieldValue('newPassword')) {
      callback('请与新密码输入一致');
    } else {
      callback();
    }
  }
  saveFindFormRef(form) {
    this.saveFindForm = form;
  }
  saveEditPwdFormRef(form) {
    this.editPwdForm = form;
  }
  cellVerifyCallback(data) {
    if (data.success) {
      let _time = data.waitNextPrepareSeconds || 900,
        _timeTip;
      if (_time / 60 < 1) {
        _timeTip = _time + '秒';
      } else {
        _timeTip = Math.ceil(_time / 60) + '分钟';
      }
      this.setState({
        timeTip: _timeTip
      });
    }
    this.smsId = data.smsId;
    this.setState({
      showSmsSendMsg: true
    });
  }
  countDownCallback() {
    this.setState({
      showSmsSendMsg: false
    });
  }
  startSuccessCountDown() {
    this.successTimer = setInterval(() => {
      let time = this.state.countDownSeconds;
      if (time <= 0) {
        clearInterval(this.successTimer);
        window.location.href = loginUrl;
      } else {
        time = time - 1;
        this.setState({
          countDownSeconds: time
        });
      }
    }, 1000);
  }

  renderForm() {
    const {
      showFindLoginForm,
      showEditPwd,
      cell,
      nextBtnLoading,
      editPwdBtnLoading,
      countDownSeconds,
      showSmsSendMsg,
      timeTip
    } = this.state;

    if (showFindLoginForm && !showEditPwd) {
      return (
        <FindLoginForm
          inputHandler={(e) => {
            this.setState({
              cell: e.target.value
            });
          }}
          cell={cell}
          submitHandler={this.submitHandler.bind(this)}
          ref={(form) => this.saveFindFormRef(form)}
          cellVerifyCallback={(data) => this.cellVerifyCallback(data)}
          countDownCallback={() => this.countDownCallback()}
          loading={nextBtnLoading}
          showSmsSendMsg={showSmsSendMsg}
          timeTip={timeTip}
        />
      );
    } else if (!showFindLoginForm && showEditPwd) {
      return (
        <EditPwdForm
          submitHandler={this.editHandler.bind(this)}
          ref={(form) => this.saveEditPwdFormRef(form)}
          checkPassword={this.checkPassword.bind(this)}
          loading={editPwdBtnLoading}
        />
      );
    } else {
      return (
        <div className="findpsw-block">
          <div className="content">
            <span className="setPassword-success" />
            <div className="setPassword-text">
              <p className="success-text">设置成功</p>
              <p>
                {countDownSeconds}s后自动跳转登录页面，
                <a className="text-info" href={loginUrl}>
                  立即跳转
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }
  }
  render() {
    const { current } = this.state;
    return (
      <div className="wrap">
        <a className="oa-logo" href={loginUrl}>
          <img src={T.getImg('user/oa_logo.png')} alt="我们是传奇" />
        </a>
        <div className="container">
          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          {this.renderForm()}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <LocaleProvider locale={zh_CN}>
    <App />
  </LocaleProvider>,
  document.getElementById('root')
);
