/*
 * @Description: 登录验证
 * @Author: qianqian
 * @Date: 2019-02-18 17:20:03
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 17:05:54
 */
import React from 'react';
import ReactDOM from 'react-dom';
import CellVerifyButton from 'components/businessCommon/CellVerifyButton';
import 'styles/user/validateAuthLogin.less';
const { Form, Input, Button, Radio, Modal, Icon, LocaleProvider, zh_CN } = window.antd;
const FormItem = Form.Item;
const loginUrl = `${CONFIG.frontPath}/user/userLogin.htm`;
class ValidateForm extends React.Component {
  state = {
    validateLoginType: CONFIG.option.validateLoginType[0].name,
    showSmsBtn: false,
    showSmsSendMsg: false,
    btnLoading: false,
    timeTip: ''
  };
  changeHandler = (e) => {
    let target = e.target.value;
    let showSmsBtn = false;
    if (target === 'SMS') {
      showSmsBtn = true;
    } else {
      this.setState({
        showSmsSendMsg: false
      });
    }
    this.setState({
      validateLoginType: target,
      showSmsBtn
    });
  };
  submitHandler = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let _data = {
          token: values.token,
          combineString: CONFIG.option.combineString,
          validateLoginType: this.state.validateLoginType,
          properties: CONFIG.option.properties,
          _service_parameter_id_: CONFIG.option._service_parameter_id_
        };

        if (this.state.validateLoginType === 'SMS') {
          if (!this.properties) {
            Modal.error({
              title: '提示',
              content: '请先点击获取验证码'
            });
            return;
          }
          //如果已经点击了获取验证码，那么把properties赋值为验证码接口里返回的properties
          _data.properties = this.properties;
        }
        this.setState({
          btnLoading: true
        });
        T.post(CONFIG.option.url, _data)
          .then((data) => {
            if (data.success) {
              window.location.href = data.redirectUrl;
            }

            this.setState({
              btnLoading: false
            });
          })
          .catch((err) => {
            this.setState({
              btnLoading: false
            });
            Modal.error({
              title: '提示',
              content: T.getError(err),
              onOk() {
                if (err.redirectUrl) {
                  window.location.href = err.redirectUrl;
                }
              }
            });
          });
      }
    });
  };
  componentDidMount() {
    // 判断是否绑定微信
    if (CONFIG.option.validateLoginType[0]['name'] === 'WEIXIN_TOKEN') {
      this.initUserTokenExistConfirm();
    }
    if (CONFIG.option.validateLoginType[0]['name'] === 'SMS') {
      this.setState({
        showSmsBtn: true
      });
    }
  }
  initUserTokenExistConfirm(callback) {
    T.get(CONFIG.option.userTokenExistConfirmUrl, {
      userId: CONFIG.option.userId,
      tokenType: 'WEIXIN_TOKEN'
    })
      .then((data) => {
        callback && callback();
      })
      .catch((err) => {
        T.showError(err);
      });
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
    //点击获取验证码后才会有的值，可以用来判断是否点击了获取验证码
    this.properties = data.properties;
    this.setState({
      showSmsSendMsg: true
    });
  }
  countDownCallback() {
    this.setState({
      showSmsSendMsg: false
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };
    const array = CONFIG.option.validateLoginType;
    return (
      <div className="wrap">
        <a className="oa-logo" href={loginUrl}>
          <img src={T.getImg('user/oa_logo.png')} alt="我们是传奇" />
        </a>
        <div className="container">
          <Form
            style={{ maxWidth: '500px', margin: '0 auto' }}
            hideRequiredMark={true}
            onSubmit={this.submitHandler}
            id="validateForm"
          >
            <FormItem label="当前验证方式" {...formlayout}>
              <Radio.Group defaultValue={array[0].name} onChange={this.changeHandler}>
                {array.map(function(item, index) {
                  return (
                    <Radio.Button value={item.name} key={index}>
                      {item.message}
                    </Radio.Button>
                  );
                })}
              </Radio.Group>
            </FormItem>
            <FormItem
              label="请输入验证码"
              {...formlayout}
              extra={
                this.state.showSmsSendMsg ? (
                  <span>
                    <Icon type="check-circle" style={{ color: '#52c41a' }} /> 验证码已发送到绑定手机，
                    {this.state.timeTip}
                    内有效，请注意查收
                  </span>
                ) : null
              }
            >
              {getFieldDecorator('token', {
                rules: [
                  {
                    required: true,
                    message: '请输入验证码'
                  }
                ]
              })(
                <Input
                  name="token"
                  placeholder="验证码"
                  style={{
                    width: '200px',
                    marginRight: '10px'
                  }}
                />
              )}
              {this.state.showSmsBtn ? (
                <CellVerifyButton
                  userId={CONFIG.option.userId}
                  url={CONFIG.option.smsUrl}
                  jsonCallback={(data) => this.cellVerifyCallback(data)}
                  countDownCallback={() => this.countDownCallback()}
                />
              ) : null}
            </FormItem>
            <FormItem {...formlayout} colon={false} label=" ">
              <Button type="primary" htmlType="submit" style={{ width: '200px' }} loading={this.state.btnLoading}>
                验证
              </Button>
            </FormItem>
            <input type="hidden" name="combineString" value={CONFIG.option.combineString} />
            <input type="hidden" name="validateLoginType" value={this.state.validateLoginType} />
            <input type="hidden" name="properties" value={CONFIG.option.properties} />
            {CONFIG.option.isAuthLogin ? (
              <input type="hidden" name="_service_parameter_id_" value={CONFIG.option._service_parameter_id_} />
            ) : null}
          </Form>
        </div>
      </div>
    );
  }
}

const WrappedValidateForm = Form.create()(ValidateForm);
ReactDOM.render(
  <LocaleProvider locale={zh_CN}>
    <WrappedValidateForm />
  </LocaleProvider>,
  document.getElementById('root')
);
