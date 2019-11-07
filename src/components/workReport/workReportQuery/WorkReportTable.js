/*
 * @Description: 部门查询-表格
 * @Author: danding
 * @Date: 2019-05-13 18:58:46
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 15:53:30
 */

import React from 'react';
import { connect } from 'dva';
import { createColumns } from 'constants/components/workReport/workReportTable';

const { Table } = window.antd;

class WorkReportTable extends React.PureComponent {
  remind = (payload) => {
    this.props.dispatch({
      type: 'workReportQuery/remind',
      payload
    });
  }

  render() {
    const { list, loading, isSearched, } = this.props;
    const len = list.length;
    const pagination = {
      total: len,
      showQuickJumper: true,
      showTotal: () => `共 ${len} 条`
    };
    const tableLoading = loading.effects['workReportQuery/getList'];

    return isSearched ? (

        <Table
          loading={tableLoading}
          className="bg-white"
          dataSource={list}
          rowKey={r => r.id}
          pagination={pagination}
          onChange={this.onChange}
          columns={createColumns({
            remind: this.remind
          })}
        />
    ) : null;
  }
}

export default connect(({ workReportQuery, loading, }) => ({ ...workReportQuery, loading }))(WorkReportTable);

