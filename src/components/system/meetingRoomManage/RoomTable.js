/*
 * @Description: 会议室管理-表格
 * @Author: danding
 * @Date: 2019-04-26 18:16:50
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-29 14:44:15
 */

import React from 'react';
import { connect } from 'dva';
import 'styles/components/system/meetingRoomManage/roomTable.less';
import { createColumns } from 'constants/components/system/roomTable';

const { Table, Spin } = window.antd;

class RoomTable extends React.PureComponent {
  edit = (payload) => {
    this.props.dispatch({
      type: 'meetingRoomManage/edit',
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
    const tableLoading = loading.effects['meetingRoomManage/getList'];

    return isSearched ? (
      <Spin spinning={tableLoading}>
        <Table
          className="bg-white"
          dataSource={list}
          rowKey={r => r.id}
          pagination={pagination}
          onChange={this.onChange}
          columns={createColumns({ edit: this.edit })}
        />
      </Spin>
    ) : null;
  }
}

export default connect(({ meetingRoomManage, loading, }) => ({ ...meetingRoomManage, loading }))(RoomTable);

