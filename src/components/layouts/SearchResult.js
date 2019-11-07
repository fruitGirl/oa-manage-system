import { PureComponent } from 'react';
import { COLUMNS } from 'constants/layouts/searchResult';
import 'styles/components/layouts/SearchResult.less';

const { Modal, Table } = window.antd;

export default class SearchResult extends PureComponent {
  render() {
    const {
      list = [],
      pageLoading = false,
      visible,
      hideModal
    } = this.props;

    return (
      <Modal
        visible={visible}
        width={700}
        footer={null}
        onCancel={hideModal}
        title="搜索结果"
      >
        <div className="ant-table-wrapper bg-white">
            <Table
              rowKey={i => i.jobNumber}
              columns={COLUMNS}
              dataSource={list}
              pagination={false}
              loading={pageLoading}
            />
          </div>
      </Modal>
    );
  }
}
