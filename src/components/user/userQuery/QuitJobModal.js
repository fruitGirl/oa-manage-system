/*
 * @Description: 离职弹窗
 * @Author: danding
 * @Date: 2019-05-13 12:30:16
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-13 14:55:59
 */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Separate from 'components/common/Separate';

const { Modal, Form, DatePicker } = window.antd;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

class QuitJobModal extends React.PureComponent {
  submit = () => {
    const { form, curUserMsg } = this.props;
    form.validateFields((err) => {
      if (!err) {
        const data = form.getFieldsValue();
        const { userId } = curUserMsg;
        let { gmtQuit } = data;
        gmtQuit = gmtQuit.format('YYYY-MM-DD HH:mm:ss');
        this.props.submit({ gmtQuit, userId });
      }
    });
  }

  render() {
    const {
      visible,
      form,
      hideModal,
      loading,
      curUserMsg
    } = this.props;
    const { getFieldDecorator, } = form;
    const { department, stageName } = curUserMsg;

    return (
      <Modal
        title="离职"
        visible={visible}
        width={400}
        onCancel={hideModal}
        onOk={this.submit}
        destroyOnClose={true}
        confirmLoading={loading}
      >
        <h4 className="text-center">{stageName}（{department}）</h4>
        <Separate />
        <Form
          {...formItemLayout}
        >
          <FormItem
            label="离职时间"
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('gmtQuit', {
              initialValue: moment(new Date()),
              rules: [{ required: true, message: '必填项' }]
            })(
              <DatePicker style={{width: '100%'}} allowClear={false} showTime placeholder="请选择时间" />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

QuitJobModal.propTypes = {
  visible: PropTypes.bool,
  hideModal: PropTypes.func,
  submit: PropTypes.func,
  loading: PropTypes.bool,
  curUserMsg: PropTypes.object
};

QuitJobModal.defaultProps = {
  visible: false,
  hideModal: () => {},
  submit: () => {},
  loading: false,
  curUserMsg: {}
};

export default Form.create()(QuitJobModal);
