/*
 * @Description: 移动流程单到其他分类
 * @Author: danding
 * @Date: 2019-09-10 16:36:13
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-10 16:43:40
 */

import React from 'react';
import 'styles/components/process/processConfigQuery/moveProcessModal.less';
import Separate from 'components/common/Separate';

const { Modal, Icon, } = window.antd;

class MoveProcessModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedKey: props.processMsg.parentId, // 选择的主键
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // 更新选中项
    if (this.props.processMsg !== nextProps.processMsg) {
      this.setState({
        checkedKey: nextProps.processMsg.parentId
      });
    }
  }

  onSubmit = () => {
    const { processMsg } = this.props;
    const payload = {
      typeId: this.state.checkedKey,
      id: processMsg.id
    };
    this.props.onSubmit(payload);
  }

  onCheck = (key) => {
    this.setState({
      checkedKey: key
    });
  }

  render() {
    const { visible, loading, hideModal, classificList, processMsg } = this.props;
    const { checkedKey } = this.state;
    const { parentId, name } = processMsg;

    return (
      <Modal
        title={(
          <div>
            <span className="process-move-title">{name}</span>
            <Separate isVertical={false} />
            <span className="process-move-tip">移动到</span>
          </div>
        )}
        visible={visible}
        width={400}
        className="move-process-modal"
        onCancel={hideModal}
        onOk={this.onSubmit}
        destroyOnClose={true}
        confirmLoading={loading}
      >
        {
          classificList.map(i => {
            const { id, name } = i;

            // 是否选中
            const isCheck = checkedKey === id;

            // 是否在当前所在分类
            const isCurClass = parentId === id;
            return (
              <div
                className={`classification-item ${isCheck ? 'checked' : ''}`}
                onClick={() => this.onCheck(id)}
              >
                <span>{name}</span>
                { isCurClass && <span className="cur-position">当前所在分类</span> }
                { isCheck && <Icon className="pull-right checked-icon" type="check" /> }
              </div>
            );
          })
        }
      </Modal>
    );
  }
}

MoveProcessModal.propTypes = {
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  hideModal: PropTypes.func,
  onSubmit: PropTypes.func,
};

MoveProcessModal.defaultProps = {
  visible: false,
  loading: false,
  hideModal: () => {},
  onSubmit: () => {},
};

export default MoveProcessModal;
