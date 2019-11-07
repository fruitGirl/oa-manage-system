import React, { PureComponent } from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import { COLUMNS } from 'constants/user/userPersonalHomePageQuery';
import qs from 'qs';

const { Table } = window.antd;

class UserPersonalHomePageQuery extends PureComponent {
  componentDidMount() {
    this.queryList();
  }

  // 获取搜索列表
  queryList() {
    const { search } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    search && this.props.dispatch({
      type: 'userPersonalHomePageQuery/queryList',
      payload: { user: decodeURIComponent(search) }
    });
  }

  render() {
    const { list, loading } = this.props;
    const pageLoading = loading.effects['userPersonalHomePageQuery/queryList'];

    return (
        <BasicLayout>
          <div className="ant-table-wrapper bg-white">
            <Table
              rowKey={i => i.jobNumber}
              columns={COLUMNS}
              dataSource={list}
              pagination={false}
              loading={pageLoading}
            />
          </div>
        </BasicLayout>
    );
  }
}

export default connect(({ userPersonalHomePageQuery, loading, }) => ({ list: userPersonalHomePageQuery.list, loading }))(UserPersonalHomePageQuery);
