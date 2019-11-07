/*
 * @Description: 人事绩效-打回理由弹窗
 * @Author: danding
 * @Date: 2019-04-26 18:22:56
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-15 15:37:55
 */

import React from 'react';
import PropTypes from 'prop-types';

const { Modal, Form, Input, } = window.antd;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};

class RefuseModal extends React.PureComponent {
  submit = () => {
    const { form } = this.props;
    form.validateFields((err) => {
      if (!err) {
        let refuseReason = this.props.form.getFieldValue('refuseReason');
        refuseReason = T.return2Br(refuseReason || '');
        this.props.submit({ refuseReason });
      }
    });
  }

  render() {
    const {
      visible,
      form,
      hideModal,
      loading
    } = this.props;
    const { getFieldDecorator, } = form;

    return (
      <Modal
        title="打回原因"
        visible={visible}
        width={400}
        onCancel={hideModal}
        onOk={this.submit}
        destroyOnClose={true}
        confirmLoading={loading}
        cancelButtonProps={{
          size: 'small'
        }}
        okButtonProps={{
          size: 'small'
        }}
      >
        <Form
          {...formItemLayout}
        >
          <FormItem
            label="原因"
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('refuseReason', {
              rules: [{
                required: true,
                message: '请填写原因',
                whitespace: true
              }]
            })(
              <Input.TextArea
                maxLength={1000}
                rows={3}
                placeholder="请输入原因，最多1000字"
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

RefuseModal.propTypes = {
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  hideModal: PropTypes.func,
  submit: PropTypes.func,
};

RefuseModal.defaultProps = {
  visible: false,
  loading: false,
  hideModal: () => {},
  submit: () => {},
};

export default Form.create()(RefuseModal);
