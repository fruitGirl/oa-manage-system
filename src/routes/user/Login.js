/*
 * @Description: 登录页面
 * @Author: qianqian
 * @Date: 2019-01-25 17:24:13
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-06 18:50:30
 */

import React from 'react';
import { connect } from 'dva';
import ScanLogin from 'components/user/login/ScanLogin';
import { SCAN_LOGIN_TYPE, FORM_LOGIN_TYPE, SCAN_ENABLE_STATUS, } from 'constants/user/login';
import Separate from 'components/common/Separate';

const { Form, Icon, Input, Button, Checkbox } = window.antd;
const FormItem = Form.Item;
const imgUrl = T.getImg('user/login_bg.jpg');

class NormalLoginForm extends React.Component {
  state = {
    checkCodeUrl: CONFIG.option.checkCodeUrl,
    loading: false,
    removeBlur: false,
    styleOption: null
  };
  UNSAFE_componentWillMount() {
    // 输入登录模式下，返回错误时，显示输入登录模式
    if (CONFIG.option.loginError) {
      this.props.dispatch({
        type: 'login/setLoginType',
        payload: { loginType: FORM_LOGIN_TYPE }
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        this.setState({
          loading: true
        });

        document.getElementById('loginForm').submit();
      }
    });
  };

  changeCheckcode = () => {
    let url = CONFIG.option.checkCodeUrl;
    let _now = new Date().valueOf();
    this.setState({ checkCodeUrl: `${url}?_=${_now}` });
  };

  componentDidMount() {
    // 登录的时候要清楚缓存
    sessionStorage.clear();
  }

  imgLoadHandler(e) {
    e.persist();

    this.setState({
      styleOption: {
        backgroundImage: `url(${imgUrl})`
      },
      removeBlur: true
    });
  }

  // 切换登录方式
  switchLoginType = () => {
    CONFIG.option.loginError = '';
    const { loginType } = this.props;
    const isFormLoginType = loginType === FORM_LOGIN_TYPE;
    this.props.dispatch({
      type: 'login/setLoginType',
      payload: {
        loginType: isFormLoginType
          ? SCAN_LOGIN_TYPE
          : FORM_LOGIN_TYPE
      }
    });
    this.props.dispatch({
      type: 'login/setScanStatusInfo',
      payload: {
        scanStatus: isFormLoginType ? SCAN_ENABLE_STATUS : ''
      }
    });
  }

  render() {
    const { loginType, form } = this.props;
    const { getFieldDecorator } = form;
    const isFormLoginType = loginType === FORM_LOGIN_TYPE;
    const isScanLoginType = loginType === SCAN_LOGIN_TYPE;

    let bgClass = this.state.removeBlur ? 'bg-cover fade-in' : 'bg-cover';
    return (
      <React.Fragment>
        <img className="hide" onLoad={(e) => this.imgLoadHandler(e)} src={imgUrl} alt="" />
        <div className={bgClass} style={this.state.styleOption} />
        <div className="login-logo">
          <img className="logo-img" src={T.getImg('user/login_logo.png')} alt="我们是传奇" />
        </div>
        <div className="login-box">
          <div className="login-content">
            {CONFIG.option.isAuthLogin ? <h3 className="authlogin-title">正在登陆{CONFIG.appName}</h3> : null}
            { isFormLoginType && (
                <Form
                  onSubmit={this.handleSubmit}
                  className="login-form"
                  id="loginForm"
                  hideRequiredMark={true}
                  action={CONFIG.option.loginUrl}
                  method="post"
                >
                  <FormItem>
                    {getFieldDecorator('cell', {
                      rules: [
                        {
                          required: true,
                          message: '请输入用户名(手机号)!'
                        },
                        {
                          min: 11,
                          message: '至少为11位!'
                        },
                        {
                          min: 11,
                          message: '至多为11位!'
                        },
                        {
                          pattern: T.cell,
                          message: '请正确输入手机号!'
                        }
                      ],
                      validateFirst: true
                    })(
                      <Input
                        minLength={11}
                        maxLength={11}
                        name="cell"
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="用户名"
                        autoComplete="off"
                      />
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('password', {
                      rules: [
                        {
                          required: true,
                          message: '请输入密码!'
                        },
                        { max: 20, message: '至多为20位' },
                      ],
                      validateFirst: true
                    })(
                      <Input
                        name="password"
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="密码"
                        autoComplete="off"
                      />
                    )}
                  </FormItem>
                  <FormItem className="checkcode-item" extra={CONFIG.option.loginError}>
                    {getFieldDecorator('checkCode', {
                      rules: [
                        {
                          required: true,
                          message: '请输入验证码!'
                        },
                        {
                          min: 4,
                          message: '验证码为4个字符!'
                        },
                        {
                          max: 4,
                          message: '验证码为4个字符!'
                        },
                        {
                          pattern: T.number,
                          message: '请输入数字验证码!'
                        }
                      ],
                      validateFirst: true
                    })(
                      <div>
                        <Input name="checkCode" className="checkcode-input" placeholder="验证码" />
                        <img
                          className="checkcode-img"
                          src={this.state.checkCodeUrl}
                          onClick={this.changeCheckcode}
                          alt=""
                        />
                        <a className="change-code" onClick={this.changeCheckcode}>
                          看不清？换一换
                        </a>
                      </div>
                    )}
                  </FormItem>
                  <div>
                    <Button type="primary" htmlType="submit" className="login-btn" loading={this.state.loading}>
                      登录
                    </Button>
                  </div>
                  <div className="remember-area">
                    <Checkbox>记住用户名</Checkbox>
                    {CONFIG.option.isAuthLogin ? null : (
                      <a href={CONFIG.option.findLoginUrl} className="forget-pwd">
                        忘记密码？
                      </a>
                    )}
                  </div>
                  {CONFIG.option.isAuthLogin ? (
                    <input type="hidden" name="_service_parameter_id_" value={CONFIG.option._service_parameter_id_} />
                  ) : null}
                </Form>
              )
            }
            { isScanLoginType && <ScanLogin /> }
            { CONFIG.option.isHideScanLogin
              ? null
              : (
                  <div className="login-footer">
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={CONFIG.option.pcDownloadUrl}
                    >明聊客户端下载</a>
                    <div className="login-shfit" onClick={this.switchLoginType}>
                      <span>{ isFormLoginType ? '扫码登录' : '账户密码登录' }</span>
                      <Separate isVertical={false} size={10} />
                      <i className={`login-shift-icon ${isFormLoginType ?'login-scan-type-icon' : 'login-form-type-icon'}`} />
                    </div>
                  </div>
                )
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default connect(({ login }) => ({ ...login, }))(WrappedNormalLoginForm);
