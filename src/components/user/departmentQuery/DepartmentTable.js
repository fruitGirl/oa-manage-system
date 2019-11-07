/*
 * @Description: 部门查询-表格
 * @Author: danding
 * @Date: 2019-05-13 18:58:46
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-13 19:36:40
 */

import React from 'react';
import { connect } from 'dva';
import { createColumns } from 'constants/components/user/departmentTable';

const { Table, Spin } = window.antd;

class DepartmentTable extends React.PureComponent {
  edit = (payload) => {
    this.props.dispatch({
      type: 'departmentQuery/showDepaModal',
      payload
    });
  }

  remove = (payload) => {
    this.props.dispatch({
      type: 'departmentQuery/remove',
      payload
    });
  }

  queryMember = (payload) => {
    this.props.dispatch({
      type: 'departmentQuery/queryMember',
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
    const tableLoading = loading.effects['departmentQuery/getList'];

    return isSearched ? (
      <Spin spinning={tableLoading}>
        <Table
          className="bg-white"
          dataSource={list}
          rowKey={r => r.id}
          pagination={pagination}
          onChange={this.onChange}
          columns={createColumns({
            edit: this.edit,
            remove: this.remove,
            queryMember: this.queryMember
          })}
        />
      </Spin>
    ) : null;
  }
}

export default connect(({ departmentQuery, loading, }) => ({ ...departmentQuery, loading }))(DepartmentTable);

