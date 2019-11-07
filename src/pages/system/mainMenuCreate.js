/*
 * @Description: 系统-主菜单创建
 * @Author: qianqian
 * @Date: 2019-02-18 16:30:45
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-03-01 14:16:37
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import 'styles/system/mainMenuCreate.less';
const { Form, Select, Input, Button, message, LocaleProvider, zh_CN } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
class MainMenuCreate extends React.Component {
  //表单提交(请求的是查询接口)
  handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      const url = `${T['systemPath']}/mainMenuCreate.json`;
      const topMenuId = values['topMenuId'];
      const mainMenuName = values['mainMenuName'];
      const mainMenuLogo = values['mainMenuLogo'];
      const orderNumber = values['orderNumber'];
      const params = {
        topMenuId,
        mainMenuName,
        mainMenuLogo,
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
    if (!/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(value) && value) {
      callback('排序号不能为负数');
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
    //所属主菜单的下拉框
    const topMenuIdOption = CONFIG.topMenuId.map((item, index) => {
      return (
        <Option key={index} value={item}>
          {CONFIG.topMenuMap[item]}
        </Option>
      );
    });
    return (
      <LocaleProvider locale={zh_CN}>
        <BasicLayout>
          <Form onSubmit={this.handleSubmit} className="bg-white antd_form_horizontal">
            <FormItem {...formItemLayout} label="所属顶部菜单" key="topMenuId" className="formLable" colon={false}>
              {getFieldDecorator('topMenuId', {
                initialValue: '',
                rules: [{ required: true, message: '请选择所属顶部菜单' }]
              })(<Select style={{ width: '202px' }}>{topMenuIdOption}</Select>)}
            </FormItem>
            <FormItem {...formItemLayout} label="主菜单名" key="mainMenuName" className="formLable" colon={false}>
              {getFieldDecorator('mainMenuName', {
                initialValue: '',
                rules: [{ required: true, message: '请填写主菜单名' }]
              })(<Input className="modal_input" type="text" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="主菜单logo" key="mainMenuLogo" className="formLable" colon={false}>
              {getFieldDecorator('mainMenuLogo', {
                initialValue: '',
                rules: [{ required: true, message: '请填写主菜单logo' }]
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
const WrapMainMenuCreate = Form.create()(MainMenuCreate);

ReactDOM.render(<WrapMainMenuCreate />, document.getElementById('root'));
