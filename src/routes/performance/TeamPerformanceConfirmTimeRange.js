/*
 * @Description: 团队绩效确认列表
 * @Author: danding
 * @Date: 2019-07-09 10:16:56
 * @Last Modified by: danding
 * @Last Modified time: 2019-07-09 12:18:15
 */

import { PureComponent } from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import { createColumns } from 'constants/performance/teamPerformanceConfirmTimeRange';

const { Table } = window.antd;

class TeamPerformanceConfirmTimeRange extends PureComponent {
  componentDidMount() {
    this.getList();
  }

  getList = (currentPage) => {
    this.props.dispatch({
      type: 'teamPerformanceConfirmTimeRange/getList',
      payload: { currentPage: currentPage || 1, }
    });
  }

  render() {
    const { list, loading } = this.props;
    const items = list ? list.length : 0;
    const pagination = {
      total: items,
      showTotal: () => `共 ${items} 条`
    };

    const tableLoading = loading.effects['teamPerformanceConfirmTimeRange/getList'] || false;

    return (
      <BasicLayout>
        <Table
          loading={tableLoading}
          rowKey={(r) => `${r.year}_${r.timeRange}`}
          columns={createColumns()}
          dataSource={list}
          pagination={pagination}
        />
      </BasicLayout>
    );
  }
}

export default connect(({ teamPerformanceConfirmTimeRange, loading }) => ({ ...teamPerformanceConfirmTimeRange, loading }))(TeamPerformanceConfirmTimeRange);
