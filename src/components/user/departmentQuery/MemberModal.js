
import React from 'react';
import PropTypes from 'prop-types';
import 'styles/components/user/departmentQuery/memberModal.less';

const { Modal, Row, Col, Button} = window.antd;

class MemberModal extends React.PureComponent {
  render() {
    const {
      visible,
      hideModal,
      loading,
      list
    } = this.props;

    return (
      <Modal
        title="部门成员"
        visible={visible}
        width={400}
        onCancel={hideModal}
        destroyOnClose={true}
        confirmLoading={loading}
        footer={(<Button onClick={hideModal}>确定</Button>)}
      >
        <p className="leader">负责人：</p>
        <Row className="text-center list-header">
          <Col span={12}>花名</Col>
          <Col span={12}>职位</Col>
        </Row>
        <ul className="list-content">
          {
            list.map(i => {
              return (
                <li>
                  <Row className="text-center">
                    <Col span={12}></Col>
                    <Col span={12}></Col>
                  </Row>
                </li>
              );
            })
          }
        </ul>
      </Modal>
    );
  }
}

MemberModal.propTypes = {
  visible: PropTypes.bool,
  hideModal: PropTypes.func,
  loading: PropTypes.bool
};

MemberModal.defaultProps = {
  visible: false,
  hideModal: () => {},
  loading: false
};

export default MemberModal;

