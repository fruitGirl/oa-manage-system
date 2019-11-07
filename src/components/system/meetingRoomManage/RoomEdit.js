/*
 * @Description: 会议室新增/编辑弹窗
 * @Author: danding
 * @Date: 2019-04-26 18:12:17
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-26 18:15:28
 */

import React from 'react';
import PropTypes from 'prop-types';

const { Modal, Form, Input, Radio } = window.antd;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};

class RoomEdit extends React.PureComponent {
  componentDidUpdate(prevProps) {
    // 查看会议室，表单赋值
    if (this.props.roomData !== prevProps.roomData) {
      const { name, location, enabled, reserved } = this.props.roomData || {};
      this.props.form.setFieldsValue({
        name,
        location,
        enabled,
        reserved
      });
    }
  }

  submit = () => {
    const { form } = this.props;
    form.validateFields((err) => {
      if (!err) {
        const { roomData } = this.props;
        const { id } = roomData;
        this.props.submit({ ...form.getFieldsValue(), id });
      }
    });
  }

  render() {
    const { visible, form, hideModal } = this.props;
    const { getFieldDecorator, } = form;
    return (
      <Modal
        title="会议室"
        visible={visible}
        width={500}
        onCancel={hideModal}
        onOk={this.submit}
        destroyOnClose={true}
      >
        <Form
          {...formItemLayout}
        >
          <FormItem
            label="会议室名称"
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('name')(
              <Input placeholder="请输入会议室名称" />
            )}
          </FormItem>
          <FormItem
            label="地点"
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('location')(
              <Input placeholder="请输入地点" />
            )}
          </FormItem>
          <FormItem
            label="是否预约开放"
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('reserved', {
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

RoomEdit.propTypes = {
  visible: PropTypes.bool,
  hideModal: PropTypes.func
};

RoomEdit.defaultProps = {
  visible: false,
  hideModal: () => {}
};

export default Form.create()(RoomEdit);
