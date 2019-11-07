/*
 * @Description: 个人-我的工资条-微信令牌弹窗
 * @Author: danding
 * @Date: 2019-03-20 16:14:27
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 18:00:08
 */

import PropTypes from 'prop-types';
import WxCodeValidate from 'components/businessCommon/WxCodeValidate';
import Separate from 'components/common/Separate';

const { Modal } = window.antd;

const WxCodeValidModal = (props) => {
  const { visible, onValid, hideModal } = props;

  return (
    <Modal
      title="验证"
      width={400}
      visible={visible}
      zIndex={1005}
      footer={null}
      destroyOnClose={true}
      onCancel={hideModal}
    >
      <WxCodeValidate onValid={onValid} />
      <Separate size={50} />
    </Modal>
  );
};

WxCodeValidModal.propTypes = {
  visible: PropTypes.bool, // 弹框的显隐
  onValid: PropTypes.func, // 提交校验
  hideModal: PropTypes.func, // 隐藏弹框
};

WxCodeValidModal.defaultProps = {
  visible: false,
  onValid: () => {},
  hideModal: () => {}
};

export default WxCodeValidModal;
