/*
 * @Description: 团队配置列表
 * @Author: danding
 * @Date: 2019-07-09 10:47:39
 * @Last Modified by: danding
 * @Last Modified time: 2019-07-10 17:04:31
 */

import React from 'react';
import { connect } from 'dva';
import { createColumns } from 'constants/performance/teamQuery';
import Separate from 'components/common/Separate';

const { Button, Table, Spin } = window.antd;

class TeamTable extends React.PureComponent {
  changePage = ({ current }) => {
    this.props.dispatch({
      type: 'teamQuery/getList',
      payload: { currentPage: current, }
    });
  }

  addTeam = () => {
    this.props.dispatch({
      type: 'teamQuery/displayModal',
      payload: true
    });
  }

  editTeam = (payload) => {
    this.props.dispatch({
      type: 'teamQuery/displayModal',
      payload: true
    });

    this.props.dispatch({
      type: 'teamQuery/getTeamDetail',
      payload
    });
  }

  render() {
    const { paginator = {}, list, loading } = this.props;
    const { itemsPerPage = 0, items = 0, page = 1 } = paginator;
    const pagination = {
      current: page,
      total: items,
      pageSize: itemsPerPage,
      showQuickJumper: true,
      showTotal: () => `共 ${items} 条`
    };

    const tableLoading = loading.effects['teamQuery/getList'] || false;

    return (
        <Spin spinning={tableLoading}>
          <div className="info-table">
            <div className="action-btns">
              <Button
                type="primary"
                onClick={() => this.addTeam()}
              >新建团队</Button>
            </div>
            <Separate size={20} />
            <Table
              rowKey={(r) => r.id}
              columns={createColumns({
                editTeam: this.editTeam
              })}
              dataSource={list}
              pagination={pagination}
              onChange={this.changePage}
            />
          </div>
        </Spin>
      );
  }
}

export default connect(({ teamQuery, loading, }) => ({ ...teamQuery, loading }))(TeamTable);

