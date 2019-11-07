/*
 * @Description: 查询我的周报月报-表格
 * @Author: danding
 * @Date: 2019-05-13 18:58:46
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-16 21:01:59
 */

import React from 'react';
import { connect } from 'dva';
import { createColumns } from 'constants/components/workReport/myWorkReport';

const { Table, Spin } = window.antd;

class ReportTable extends React.PureComponent {
  changePage = ({ current }) => {
    const { searchData } = this.props;
    this.props.dispatch({
      type: 'myWorkReportQuery/getList',
      payload: { ...searchData, currentPage: current, }
    });
  }

  withdraw = (payload) => {
    this.props.dispatch({
      type: 'myWorkReportQuery/withdraw',
      payload
    });
  }

  render() {
    const { list, loading, paginator } = this.props;
    const { itemsPerPage = 0, items = 0, page = 1 } = paginator;
    const pagination = {
      current: page,
      total: items,
      pageSize: itemsPerPage,
      showQuickJumper: true,
      showTotal: () => `共 ${items} 条`
    };
    const tableLoading = loading.effects['myWorkReportQuery/getList'];

    return (
      <Spin spinning={tableLoading}>
        <Table
          className="bg-white"
          dataSource={list}
          rowKey={r => r.id}
          pagination={pagination}
          onChange={this.changePage}
          columns={createColumns({ withdraw: this.withdraw })}
        />
      </Spin>
    );
  }
}

export default connect(({ myWorkReportQuery, loading, }) => ({ ...myWorkReportQuery, loading }))(ReportTable);

