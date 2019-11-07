/*
 * @Description: 我的周报查询
 * @Author: danding
 * @Date: 2019-05-22 10:13:51
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-22 10:13:51
 */

import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import ReportTable from 'components/workReport/myWorkReportQuery/ReportTable';
import SearchBar from 'components/workReport/myWorkReportQuery/SearchBar';

class MyWorkReportQuery extends React.PureComponent {
  handleSubmit = (payload) => {
    this.props.dispatch({
      type: 'myWorkReportQuery/getList',
      payload
    });
  }

  render() {
    const { selectedNavKey } = this.props;

    return (
        <BasicLayout>
          <SearchBar
            selectedNavKey={selectedNavKey}
            handleSubmit={this.handleSubmit}
          />
          <ReportTable />
        </BasicLayout>
    );
  }
}

export default connect(({ myWorkReportQuery, loading }) => ({ loading, ...myWorkReportQuery }))(MyWorkReportQuery);


