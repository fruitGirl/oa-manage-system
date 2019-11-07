/*
 * @Description: 流程-我的审批
 * @Author: moran
 * @Date: 2019-09-10 16:09:39
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-14 16:08:10
 */

import { connect } from 'dva';
import React from 'react';
import BasicLayout from 'layouts/BasicLayout';
import ApprovalCard from 'components/businessCommon/ApprovalCard';
import NavItem from 'components/process/myApprovalQuery/NavItem';
import { ACTIVE_NAV, APPROVE } from 'constants/process/index';
const { Pagination, Spin } = window.antd;

class MyApprovalQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      approvalStatus: APPROVE, // 审批状态
    };
  }

  componentDidMount() {
    const payload = { statusEnum: APPROVE, currentPage: 1 };
    this.getLists(payload);
  }

  // 导航切换
  handleNavClick = (status) => {
    this.setState({
      approvalStatus: status
    });
    const payload = { statusEnum: status, currentPage: 1 };
    this.getLists(payload);
  }

  // 分页跳转
  handlePageChange = (current) => {
    const { approvalStatus } = this.state;
    const payload = { statusEnum: approvalStatus, currentPage: current || 1 };
    this.getLists(payload);
  }

  // 我的审批列表获取
  getLists = (payload) => {
    this.props.dispatch({
      type: 'myApprovalQuery/getMyApproval',
      payload
    });
  }

  render() {
    const { myApprovalLists, paginator, loading } = this.props;
    const { approvalStatus } = this.state;
    const { items, itemsPerPage, page } = paginator;
    const approvalListLen = myApprovalLists.length;
    const myApprovalLoading = loading.effects['myApprovalQuery/getMyApproval'];
    return (
      <BasicLayout>
        <NavItem configs={ACTIVE_NAV} click={this.handleNavClick}/>
        <Spin spinning={myApprovalLoading}>
          {
            myApprovalLists.map((i, index) => {
              return (
                <div className="my-approval-query-box" key={index}>
                  <ApprovalCard cardConfig={{ ...i, statusEnum: approvalStatus }}/>
                </div>
              );
            })
          }
          {
            approvalListLen ?
            <Pagination
              className="pagination-right"
              onChange={this.handlePageChange}
              current={page}
              pageSize={itemsPerPage}
              total={items}
              showQuickJumper={true}
              showTotal={(total) => `总共${total}条`}
            /> :
            <div className="no-data-box">暂无数据</div>
          }
        </Spin>
      </BasicLayout>
    );
  }
}

export default connect(({ myApprovalQuery, loading }) => ({
  ...myApprovalQuery, loading
}))(MyApprovalQuery);
