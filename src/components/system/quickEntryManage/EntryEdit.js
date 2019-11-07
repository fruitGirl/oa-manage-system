/*
 * @Description: 快捷入口编辑弹窗
 * @Author: danding
 * @Date: 2019-04-23 09:37:37
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-29 09:24:47
 */

import React from 'react';
import regex from 'utils/regex';
import UploadImg from 'components/common/UploadImg';

const { Modal, Form, Input, Radio, } = window.antd;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};

class EntryEdit extends React.PureComponent {
  handleSubmit = () => {
    this.props.form.validateFields(err => {
      if (!err) {
        const data = this.props.form.getFieldsValue();
        data.fileName = data.files[0] && data.files[0].imageName;
        delete data.files;
        const { entryItemMsg } = this.props;
        const { id } = entryItemMsg;
        this.props.handleSubmit({ id, ...data });
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.entryItemMsg !== prevProps.entryItemMsg) {
      this.props.form.setFieldsValue(this.props.entryItemMsg);
    }
  }

  render() {
    const { visible, form, hideModal } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="入口配置"
        visible={visible}
        width={500}
        onCancel={hideModal}
        onOk={this.handleSubmit}
        destroyOnClose={true}
      >
        <Form
          {...formItemLayout}
        >
          <FormItem
            label="入口名称"
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('entryName', {
              rules: [{ required: true, message: '必填' }]
            })(
              <Input maxLength={15} placeholder="请输入入口名称，最多15字" />
            )}
          </FormItem>
          <FormItem
            label="URL"
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('entryUrl', {
              rules: [
                { required: true, message: '必填' },
                { pattern: /http/ig, message: '请输入http或者https'}
              ]
            })(
              <Input placeholder="请输入URL" />
            )}
          </FormItem>
          <FormItem
            label="排序值"
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('orderNumber', {
              rules: [{ pattern: regex.positiveInteger, message: '请填写正整数' }]
            })(
              <Input placeholder="请输入排序值"/>
            )}
          </FormItem>
          <FormItem
            label="缩略图"
            colon={false}
            { ...formItemLayout }
          >
            {getFieldDecorator('files', {
              rules: [{ required: true, message: '必填' }]
            })(
              <UploadImg
                size={0.5}
                name="imageContent"
                resFileName="imageName"
                action="/system/quickEntryConfigModifyImage.json"
              />
            )}
          </FormItem>
          <FormItem
            label="是否打开新页面"
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('openNewPage', {
              initialValue: true
            })(
               <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem
            label="是否有效"
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('enabled', {
              initialValue: true
            })(
               <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(EntryEdit);
