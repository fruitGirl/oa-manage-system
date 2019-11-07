/*
 * @Description: 快捷入口-表格
 * @Author: danding
 * @Date: 2019-04-23 09:43:56
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-29 14:24:36
 */

import React from 'react';
import { connect } from 'dva';
import 'styles/components/system/quickEntryManage/entryTable.less';
import { createColumns } from 'constants/components/system/entryTable.js';

const { Table, Spin, } = window.antd;

class EntryTable extends React.PureComponent {
  changePage = ({ current }) => {
    const { searchData } = this.props;
    this.props.dispatch({
      type: 'quickEntryManage/getList',
      payload: {
        ...searchData,
        currentPage: current
      }
    });
  }

  editEntry = (payload) => {
    this.props.dispatch({
      type: 'quickEntryManage/editEntry',
      payload
    });
  }

  render() {
    const { paginator, list, loading, isSearched, } = this.props;
    const { itemsPerPage = 0, items = 0, page = 1 } = paginator;
    const pagination = {
      current: page,
      total: items,
      pageSize: itemsPerPage,
      showQuickJumper: true,
      showTotal: () => `共 ${items} 条`
    };
    const tableLoading = loading.effects['quickEntryManage/getList'];

    return isSearched ? (
      <Spin spinning={tableLoading}>
        <Table
          className="bg-white"
          rowKey={r => r.id}
          columns={createColumns({ editEntry: this.editEntry })}
          dataSource={list}
          pagination={pagination}
          onChange={this.changePage}
        />
      </Spin>
    ) : null;
  }
}

export default connect(({ quickEntryManage, loading, }) => ({ ...quickEntryManage, loading }))(EntryTable);

