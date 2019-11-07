/*
 * @Description: 工具-工资发放-导入失败提示组件
 * @Author: danding
 * @Date: 2019-03-22 19:46:47
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-02 17:36:12
 */

import { PureComponent, Fragment, } from 'react';
import PropTypes from 'prop-types';
import 'styles/components/salary/salarySend/UploadWarnAlert.less';
import Separate from 'components/common/Separate';

const { Icon, Modal, Table, } = window.antd;

class UploadWarnAlert extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  createColumns = (num = 0) => {
    return [{
      title: `错误名单（${num}）人`,
      dataIndex: 'desc',
    }];
  }

  onHideModal = () => {
    this.setState({ showModal: false });
  }

  onShowModal = () => {
    this.setState({ showModal: true });
  }

  render() {
    const { showModal } = this.state;
    const { list } = this.props;
    const count = list.length;

    return (
      <Fragment>
        <Separate size={10} />
        <div className="warn-alert-wrapper">
          <Icon type="exclamation-circle" className="warn-icon" />
          <Separate isVertical={false} />
          <span>{count}名员工导入失败</span>
          <Separate isVertical={false} size={20} />
          <a href="javascript:;" onClick={this.onShowModal}>查看</a>
        </div>
        <Separate size={10} />
        <Modal
          title="错误信息"
          visible={showModal}
          width={500}
          footer={false}
          onCancel={this.onHideModal}
        >
          <p>以下员工信息有误，导入失败</p>
          <div className="warn-table-wrapper">
            <Table
              rowKey={r => r.desc}
              columns={this.createColumns(count)}
              dataSource={list}
              pagination={false}
            />
          </div>
        </Modal>
      </Fragment>
    );
  }
}

UploadWarnAlert.propTypes = {
  list: PropTypes.array
};

UploadWarnAlert.defaultProps = {
  list: []
};

export default UploadWarnAlert;
