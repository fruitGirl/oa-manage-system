/*
 * @Description: hr绩效确认列表
 * @Author: danding
 * @Date: 2019-07-09 10:16:56
 * @Last Modified by: danding
 * @Last Modified time: 2019-07-10 18:37:37
 */

import { PureComponent } from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import { createColumns } from 'constants/performance/hrTeamPerformanceConfirmTimeRange';

const { Table } = window.antd;

class HrTeamPerformanceConfirmTimeRange extends PureComponent {
  componentDidMount() {
    this.getList();
  }

  getList = (currentPage) => {
    this.props.dispatch({
      type: 'hrTeamPerformanceConfirmTimeRange/getList',
      payload: { currentPage: currentPage || 1, }
    });
  }

  render() {
    const { list, loading } = this.props;
    const items = list ? list.length : 0;
    const pagination = {
      showTotal: () => `共 ${items} 条`
    };

    const tableLoading = loading.effects['hrTeamPerformanceConfirmTimeRange/getList'] || false;

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

export default connect(({ hrTeamPerformanceConfirmTimeRange, loading }) => ({ ...hrTeamPerformanceConfirmTimeRange, loading }))(HrTeamPerformanceConfirmTimeRange);
