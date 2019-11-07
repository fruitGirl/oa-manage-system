/*
 * @Description: 系统-分类菜单创建
 * @Author: qianqian
 * @Date: 2019-02-18 16:16:47
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-18 16:20:58
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import 'styles/system/sortMenuCreate.less';
const { Form, Select, Input, Button, message, LocaleProvider, zh_CN } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
class SortMenuCreate extends React.Component {
  //表单提交(请求的是查询接口)
  handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }

      this.setState({ loading: true });
      const url = `${T['systemPath']}/sortMenuCreate.json`;
      const mainMenuId = values['mainMenuId'];
      const sortMenuName = values['sortMenuName'];
      const sortMenuHref = values['sortMenuHref'];
      const sortMenuAuthority = values['sortMenuAuthority'];
      const orderNumber = values['orderNumber'];
      const params = {
        mainMenuId,
        sortMenuName,
        sortMenuHref,
        sortMenuAuthority,
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
    // const sortMenuCreate = this.props.sortMenuCreate;
    // const dispatch = this.props.dispatch;

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
    const mainMenuIdOption = CONFIG.mainMenuId.map((item, index) => {
      return (
        <Option key={index} value={item}>
          {CONFIG.mainMenuMap[item]}
        </Option>
      );
    });
    return (
      <LocaleProvider locale={zh_CN}>
        <BasicLayout>
          <Form onSubmit={this.handleSubmit} className="bg-white antd_form_horizontal">
            <FormItem {...formItemLayout} label="所属主菜单" key="mainMenuId" className="formLable" colon={false}>
              {getFieldDecorator('mainMenuId', {
                initialValue: '',
                rules: [{ required: true, message: '请选择所属主菜单' }]
              })(<Select style={{ width: '202px' }}>{mainMenuIdOption}</Select>)}
            </FormItem>
            <FormItem {...formItemLayout} label="分类菜单名" key="sortMenuName" className="formLable" colon={false}>
              {getFieldDecorator('sortMenuName', {
                initialValue: '',
                rules: [{ required: true, message: '请填写分类菜单名' }]
              })(<Input className="modal_input" type="text" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="分类菜单超链接" key="sortMenuHref" className="formLable" colon={false}>
              {getFieldDecorator('sortMenuHref', {
                initialValue: '',
                rules: [{ required: true, message: '请填写分类菜单超链接' }]
              })(<Input className="modal_input" type="text" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="分类菜单权限"
              key="sortMenuAuthority"
              className="formLable"
              colon={false}
            >
              {getFieldDecorator('sortMenuAuthority', {
                initialValue: '',
                rules: [{ required: true, message: '请填写分类菜单权限' }]
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
const WrapSortMenuCreate = Form.create()(SortMenuCreate);

ReactDOM.render(<WrapSortMenuCreate />, document.getElementById('root'));
