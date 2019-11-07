/*
 * @Description: 会议室预定-确定预约弹窗
 * @Author: danding
 * @Date: 2019-04-26 18:22:56
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-29 15:25:46
 */

import React from 'react';
import PropTypes from 'prop-types';
import 'styles/components/system/meetingRoomReserve/reserveModal.less';
import Separate from 'components/common/Separate';

const { Modal, Form, Input, } = window.antd;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};

class ReserveModal extends React.PureComponent {
  submit = () => {
    const { form } = this.props;
    form.validateFields((err) => {
      if (!err) {
        let { purpose } = this.props.form.getFieldsValue();
        purpose = T.return2Br(purpose);
        this.props.reserveSubmit({ purpose });
      }
    });
  }

  // 展示的时间
  renderTime(start, end) {
    if (!start || !end) {
      return '';
    }
    let startStamp = T.date.toDate(start).getTime();
    let endStamp = T.date.toDate(end).getTime();
    if (startStamp > endStamp) { // 逆序选择
      const wrapperStamp = startStamp;
      startStamp = endStamp;
      endStamp = wrapperStamp;
      const wrapperTime = start;
      start = end;
      end = wrapperTime;
    }
    const diffMiles = endStamp - startStamp;
    const hourMiles = 60 * 60 * 1000;
    const minMiles = 60 * 1000;
    let diffHour = parseInt(diffMiles / hourMiles, 10);
    let diffMin = (diffMiles % hourMiles) / minMiles;
    diffHour = diffHour ? `${diffHour}小时` : '';
    diffMin = diffMin ? `${diffMin}分钟` : '';
    end = end && end.slice(11);
    return `${start}~${end}  ${diffHour} ${diffMin}`;
  }

  render() {
    const {
      visible,
      form,
      hideModal,
      reserveData,
      loading
    } = this.props;
    const { getFieldDecorator, } = form;
    let { name, gmtStart, gmtEnd } = reserveData;
    const reserveTime = this.renderTime(gmtStart, gmtEnd);

    return (
      <Modal
        title="会议室预定"
        visible={visible}
        width={400}
        onCancel={hideModal}
        onOk={this.submit}
        destroyOnClose={true}
        confirmLoading={loading}
      >
        <p className="desc">{name}</p>
        <p className="desc">{reserveTime}</p>
        <Separate />
        <Form
          {...formItemLayout}
        >
          <FormItem
            label="原因"
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('purpose', {
              rules: [{required: true, message: '请填写预约原因', whitespace: true }]
            })(
              <Input.TextArea
                maxLength={30}
                rows={3}
                placeholder="请填写预约原因，最多30字"
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

ReserveModal.propTypes = {
  visible: PropTypes.bool,
  hideModal: PropTypes.func,
  reserveData: PropTypes.object,
  loading: PropTypes.bool
};

ReserveModal.defaultProps = {
  visible: false,
  hideModal: () => {},
  reserveData: {},
  loading: false
};

export default Form.create()(ReserveModal);
