/*
 * @Description: 分类编辑
 * @Author: danding
 * @Date: 2019-09-10 16:06:25
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-12 18:25:25
 */

import React from 'react';
import PropTypes from 'prop-types';

const { Modal, Form, Input, } = window.antd;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

class ClassificationEditModal extends React.PureComponent {
  UNSAFE_componentWillReceiveProps(nextProps) {
    // 重命名的时候，赋值
    if (this.props.detailMsg !== nextProps.detailMsg) {
      this.props.form.setFieldsValue(nextProps.detailMsg);
    }

    // 弹窗隐藏，清空数据
    if (this.props.visible && !nextProps.visible) {
      this.props.form.resetFields();
    }
  }

  onSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit({ ...this.props.detailMsg, ...values });
      }
    });
  }

  render() {
    const {
      visible,
      form,
      hideModal,
      loading,
      detailMsg,
      destroyOnClose
    } = this.props;
    const { getFieldDecorator, } = form;
    const title = `${detailMsg.id ? '重命名' : '新增' }分类`;

    return (
      <Modal
        title={title}
        visible={visible}
        width={400}
        onCancel={hideModal}
        onOk={this.onSubmit}
        forceRender={true}
        confirmLoading={loading}
        destroyOnClose={destroyOnClose}
      >
        <Form
          {...formItemLayout}
        >
          <FormItem
            label="分类名称"
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                message: '请输入分类名称',
                whitespace: true
              }]
            })(
              <Input
                maxLength={15}
                placeholder="请输入分类名称，最多15字"
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

ClassificationEditModal.propTypes = {
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  hideModal: PropTypes.func,
  onSubmit: PropTypes.func,
  detailMsg: PropTypes.object,
  destroyOnClose: PropTypes.bool
};

ClassificationEditModal.defaultProps = {
  visible: false,
  loading: false,
  destroyOnClose: false,
  hideModal: () => {},
  onSubmit: () => {},
  detailMsg: {}
};

export default Form.create()(ClassificationEditModal);
