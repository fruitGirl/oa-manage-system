/*
 * @Description: 确认绩效弹框
 * @Author: moran 
 * @Date: 2019-08-12 16:48:21 
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-15 16:34:08
 */
import React from 'react';
import { connect } from 'dva';
const { Modal, Form, Input, } = window.antd;
const { TextArea } = Input;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};

class ConfirmPerformanceModal extends React.PureComponent {
  // 确认
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.sumbit(values);
      }
    });
  };

  // 取消
  handleCancel = () => {
    this.props.dispatch({
      type: 'hrTeamPerformanceConfirm/displayConfirmModal',
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
        title="确认绩效"
        visible={visible}
        width={650}
        destroyOnClose={true}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        cancelButtonProps={{
          size: 'small'
        }}
        okButtonProps={{
          size: 'small'
        }}
      >
        <Form {...formItemLayout}>
          <FormItem label="简评" colon={false} {...formItemLayout}>
            {getFieldDecorator('comment', {
              rules: [
                { required: true, message: '请输入简评' }
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

ConfirmPerformanceModal.propTypes = {
  visible: PropTypes.bool, // 弹框展开
};

export default connect (({ hrTeamPerformanceConfirm }) => ({ hrTeamPerformanceConfirm }))(Form.create()(ConfirmPerformanceModal));