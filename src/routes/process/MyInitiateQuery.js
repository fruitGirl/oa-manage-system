/*
 * @Description: 我的发起
 * @Author: moran
 * @Date: 2019-09-11 16:49:38
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-14 16:11:58
 */
import { connect } from 'dva';
import React from 'react';
import BasicLayout from 'layouts/BasicLayout';
import NavItem from 'components/process/myApprovalQuery/NavItem';
import ApprovalCard from 'components/businessCommon/ApprovalCard';
import { MY_INITISTE_ACTIVE_NAV } from 'constants/process/index';
const { Pagination, Spin } = window.antd;

class MyInitiateQuery extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      approvalStatus: '', // 审批状态
    };
  }

  componentDidMount() {
    const payload = { statusEnum: '', currentPage: 1 };
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

  // 我的发起列表获取
  getLists = (payload) => {
    this.props.dispatch({
      type: 'myInitiateQuery/getMyInitiate',
      payload
    });
  }

  render() {
    const { myInitiateLists, paginator, loading } = this.props;
    const { approvalStatus } = this.state;
    const { items, itemsPerPage, page } = paginator;
    const initiateListLen = myInitiateLists.length;
    const myInitiateLoading = loading.effects['myInitiateQuery/getMyInitiate'];
    return (
      <BasicLayout>
        <NavItem
          defaultIndex={0}
          configs={MY_INITISTE_ACTIVE_NAV}
          click={this.handleNavClick}/>
          <Spin spinning={myInitiateLoading}>
            {
                myInitiateLists.map((i, index) => {
                  return (
                    <div className="my-initiate-query-box" key={index}>
                      <ApprovalCard
                        cardConfig={{ ...i, statusEnum: approvalStatus }}
                        type={2}/>
                    </div>
                  );
                })
            }
            {
                initiateListLen ?
                <Pagination
                  className="pagination-right"
                  onChange={this.handlePageChange}
                  current={page}
                  pageSize={itemsPerPage}
                  total={items}
                  showTotal={(total) => `总共${total}条`}
                  showQuickJumper={true}
                /> :
                <div className="no-data-box">暂无数据</div>
            }
        </Spin>
      </BasicLayout>
    );
  }
}

export default connect(({ myInitiateQuery, loading }) => ({
  ...myInitiateQuery, loading
}))(MyInitiateQuery);
