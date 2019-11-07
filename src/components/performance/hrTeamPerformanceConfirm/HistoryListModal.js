/*
 * @Description: 历史纪录弹窗
 * @Author: moran 
 * @Date: 2019-08-07 12:11:34 
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-15 16:32:10
 */
import React from 'react';
import PropTypes from 'prop-types';
import 'styles/components/performance/HistoryListModal.less';
import { columns } from 'constants/components/performance/historyListModal';
const { Modal, Button, Table } = window.antd;

class HistoryListModal extends React.PureComponent {

  render() {
    const {
      title,
      visible,
      list,
      closeModal,
    } = this.props;
    return (
      <Modal
      title={title}
      visible={visible}
      destroyOnClose={true}
      width={800}
      footer={null}
      onCancel={closeModal}
      >
        <div className="history-container scrollbar">
          <Table
          columns={columns()}
          dataSource={list}
          rowKey={(r) => r.id}
          showHeader={false}
          pagination={false}
          ></Table>
        </div>
        <Button className="btn-position" size="small" type="primary" onClick={closeModal}>确定</Button>
      </Modal>
    );
  }
}

HistoryListModal.propTypes = {
  title: PropTypes.string, // 标题
  visible: PropTypes.bool, // 弹框展开
  closeModal: PropTypes.func, // 关闭弹窗
  list: PropTypes.array, // 历史记录列表
};

HistoryListModal.defaultProps = {
  title: '历史记录',
  visible: false,
  list: [],
  closeModal: () => {},
};

export default HistoryListModal;

