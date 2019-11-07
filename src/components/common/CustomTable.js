/*
 * @Description: 根据已有业务封装的表格
 * @Author: danding
 * @Date: 2019-08-16 09:37:09
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-16 14:37:59
 */

import React from 'react';
import PropTypes from 'prop-types';

const { Spin, Table } = window.antd;

class CustomTable extends React.PureComponent {
  changePaginator = (page, size) => {
    this.props.onChangePaginator({
      currentPage: page,
      pageSize: size
    });
  }

  render() {
    const { paginator = {}, hasPagination, list, loading, columns, rowKey } = this.props;
    const { itemsPerPage = 0, items = 0, page = 1 } = paginator;
    const pagination = hasPagination
      ? {
          current: page,
          total: items,
          pageSize: itemsPerPage,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: () => `共 ${items} 条`
        }
      : false;

    return (
      <Spin spinning={loading}>
        <Table
          rowKey={(r) => r[rowKey]}
          columns={columns}
          dataSource={list}
          pagination={pagination}
          onChange={this.changePaginator}
        />
      </Spin>
    );
  }
}

CustomTable.PropTypes = {
  paginator: PropTypes.object,
  list: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  columns: PropTypes.array.isRequired,
  rowKey: PropTypes.string,
  onChangePaginator: PropTypes.func,
  hasPagination: PropTypes.bool
};

CustomTable.defaultProps = {
  paginator: {}, // 分页对象
  list: [], // 数据源
  loading: false, // 加载状态
  columns: [], // 列配置
  rowKey: 'id', // 主键
  onChangePaginator: () => {}, // 分页操作
  hasPagination: true, // 是否含有分页
};

export default CustomTable;

