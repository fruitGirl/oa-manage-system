import React from 'react';
import { connect } from 'dva';
const { Modal, Form, Input, } = window.antd;
const { TextArea } = Input;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};

class RecallNoteModal extends React.PureComponent {
   // 确认
   handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.submit(values);
      }
    });
  };

  // 取消
  handleCancel = () => {
    this.props.dispatch({
      type: 'myInitiateQuery/displayRecallModal',
      payload: false
    });
  };

  render() {
    const {
      visible,
      form
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="撤回"
        visible={visible}
        width={650}
        destroyOnClose={true}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
      >
        <Form {...formItemLayout}>
          <FormItem label="原因" colon={false} {...formItemLayout}>
            {getFieldDecorator('memo', {
              rules: [
                { required: true, message: '请输入原因' }
              ]
            })(
            <TextArea
              rows={15}
              maxLength={1000}
              placeholder="请输入原因，最多1000字" />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default connect (({ myInitiateQuery, loading }) => ({ ...myInitiateQuery, loading }))(Form.create()(RecallNoteModal));
