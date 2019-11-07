/*
 * @Description: 系统-顶部菜单创建
 * @Author: qianqian
 * @Date: 2019-02-18 16:39:12
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-18 16:41:41
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import 'styles/system/topMenuCreate.less';
const { Form, Input, Button, message, LocaleProvider, zh_CN } = window.antd;
const FormItem = Form.Item;
class TopMenuCreate extends React.Component {
  //表单提交(请求的是查询接口)
  handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      const url = `${T['systemPath']}/topMenuCreate.json`;
      const topMenuName = values['topMenuName'];
      const indexUrl = values['indexUrl'];
      const orderNumber = values['orderNumber'];
      const params = {
        topMenuName,
        indexUrl,
        orderNumber
      };

      T.post(url, params)
        .then(() => {
          setTimeout(function() {
            message.success('创建成功');
            window.location.reload(true);
          }, 1000);
        })
        .catch((err) => {
          T.showError(err);
        });
    });
  };
  handleIsNumber = (rule, value, callback) => {
    if (value) {
      if (!/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(value)) {
        callback('排序号不能为负数');
      }
    }
    callback();
  };
  render() {
    const { getFieldDecorator } = this.props.form;

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
    return (
      <LocaleProvider locale={zh_CN}>
        <BasicLayout>
          <Form onSubmit={this.handleSubmit} className="bg-white antd_form_horizontal">
            <FormItem {...formItemLayout} label="顶部菜单名" key="topMenuName" className="formLable" colon={false}>
              {getFieldDecorator('topMenuName', {
                initialValue: '',
                rules: [{ required: true, message: '请填写顶部菜单名' }]
              })(<Input className="modal_input" type="text" placeholder="顶部菜单不能为空" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="首页地址" key="indexUrl" className="formLable" colon={false}>
              {getFieldDecorator('indexUrl', {
                initialValue: '',
                rules: [
                  // { required: true, message: '请填写首页地址' },
                ]
              })(<Input className="modal_input" type="text" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="排序号" key="orderNumber" className="formLable" colon={false}>
              {getFieldDecorator('orderNumber', {
                initialValue: '',
                rules: [
                  // { required: true, message: '请填写排序号' },
                  { validator: this.handleIsNumber }
                ]
              })(<Input className="modal_input" type="text" />)}
            </FormItem>
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
const WrapTopMenuCreate = Form.create()(TopMenuCreate);

ReactDOM.render(<WrapTopMenuCreate />, document.getElementById('root'));
