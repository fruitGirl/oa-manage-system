/*
 * @Description: 分类排序
 * @Author: danding
 * @Date: 2019-09-10 16:36:13
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-10 16:36:41
 */

import React from 'react';
import 'styles/components/process/processConfigQuery/sortClassificationModal.less';
import Sortable from 'react-sortablejs';
import cloneDeep from 'lodash.clonedeep';

const { Modal } = window.antd;

class SortClassificationModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: props.list
    };
  }

  UNSAFE_componentWillUpdate(nextProps) {
    // 分类排序
    if (this.props.list !== nextProps.list) {
      this.setState({
        list: nextProps.list
      });
    }
  }

  onSubmit = () => {
    const ids = this.state.list.map(i => i.id);
    this.props.onSubmit({ ids });
  }

  sort = (order, a, event) => {
    const { list } = this.state;
    let cloneList = cloneDeep(list);
    const { newIndex, oldIndex } = event;
    const cloneItem = cloneList.splice(oldIndex, 1)[0];
    cloneList.splice(newIndex, 0, cloneItem);
    this.setState({
      list: cloneList
    });
  }

  render() {
    const { visible, loading, hideModal } = this.props;
    const { list } = this.state;

    return (
      <Modal
        title="分类排序"
        visible={visible}
        width={550}
        onCancel={hideModal}
        onOk={this.onSubmit}
        destroyOnClose={true}
        confirmLoading={loading}
      >
        <Sortable
          className="scrollbar-modal"
          options={{
            animation: 80,
            handle: '.J-drag-handle',
          }}
          onChange = {this.sort}
        >
          {
            list.map(i => {
              return (
                <div data-id={i.id} className="sort-classif-modal-wrapper">
                  <img
                    className="J-drag-handle"
                    src={T.getImg('common/drag.png')}
                    alt="拖拽"
                  />
                  <span>{i.name}</span>
                </div>
              );
            })
          }
        </Sortable>
      </Modal>
    );
  }
}

SortClassificationModal.propTypes = {
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  hideModal: PropTypes.func,
  onSubmit: PropTypes.func,
};

SortClassificationModal.defaultProps = {
  visible: false,
  loading: false,
  hideModal: () => {},
  onSubmit: () => {},
};

export default SortClassificationModal;
