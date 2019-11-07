/*
 * @Description: 绩效查询
 * @Author: lanlan
 * @Date: 2019-02-19 14:53:36
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-15 17:13:42
 */
import { connect } from 'dva';
import React from 'react';
import BasicLayout from 'layouts/BasicLayout';
import { COLUMNS, USER_TAB_KEY, TEAM_TAB_KEY  } from 'constants/performance/userPerformanceQuery';
import SearchBar from 'components/performance/userPerformanceQuery/SearchBar';
import TeamList from 'components/performance/userPerformanceQuery/TeamList';
import Separate from 'components/common/Separate';
import SubmitSituation from 'components/performance/teamPerformanceConfirm/SubmitSituation';

const { Table, Tabs } = window.antd;
const TabPane = Tabs.TabPane;

class UserPerformance extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: USER_TAB_KEY, // 当前的 tab key
    };
    this.userSearchRef = null; // 人员查询组件
    this.teamSearchRef = null; // 团队查询组件
  }

  // 查询人员列表
  componentDidMount() {
    const payload = this.userSearchRef.getFieldsValue();
    this.handleQueryUserList(payload);
  }

  // 改变人员分页
  handleUserPageSubmit = (current) => {
    this.handleQueryUserList({ currentPage: current });
  };

  // 请求用户列表
  handleQueryUserList = (payload) => {
    this.props.dispatch({
      type: 'userPerformanceQuery/getUserList',
      payload
    });
  }

  // 请求团队列表
  handleQueryTeamList = (payload) => {
    this.props.dispatch({
      type: 'userPerformanceQuery/getTeamList',
      payload
    });
  }

  // 切换tab
  changeTab = (tab) => {
    this.setState({
      activeKey: tab
    });

    // 选择人员 tab
    if (tab === USER_TAB_KEY) {
      const payload = this.userSearchRef.getFieldsValue();
      this.handleQueryUserList(payload);
    } else {
      const payload = this.teamSearchRef.getFieldsValue();
      this.handleQueryTeamList(payload);
    }
  }

  // 修改团队分页器
  changeTeamPaginator = (payload) => {
    this.handleQueryTeamList(payload);
  }

  // 获取绩效详情
  getPerformanceDetail = (payload) => {
    this.props.dispatch({
      type: 'userPerformanceQuery/getPerformanceDetail',
      payload
    });
  }

  // 关闭绩效详情弹窗
  onHideSituation = () => {
    this.props.dispatch({
      type: 'userPerformanceQuery/displayPerformanceModal',
      payload: false
    });
  }

  render() {
    const { activeKey } = this.state;
    const {
      userList,
      userPaginator,
      loading,
      teamList,
      teamPaginator,
      performanceDetail,
      showPerformanceModal,
    } = this.props;

    // 人员列表 loading
    const userListLoading = loading.effects['userPerformanceQuery/getUserList'];

    // 团队列表 loading
    const teamListLoading = loading.effects['userPerformanceQuery/getTeamList'];

    // 绩效详情弹窗 loading
    const loadingPerformanceModal = loading.effects['userPerformanceQuery/getPerformanceDetail'];
    const showUserList = activeKey === USER_TAB_KEY; // 显示人员列表

    return (
      <BasicLayout>
        <div className="content-header">
          <Tabs activeKey={activeKey} onChange={this.changeTab}>
            <TabPane tab="人员" key={USER_TAB_KEY}>
              <SearchBar
                ref={(ref) => this.userSearchRef = ref}
                selectedTabKey={USER_TAB_KEY}
                submit={this.handleQueryUserList}
              />
            </TabPane>
            <TabPane forceRender tab="部门" key={TEAM_TAB_KEY}>
              <SearchBar
                ref={(ref) => this.teamSearchRef = ref}
                selectedTabKey={TEAM_TAB_KEY}
                submit={this.handleQueryTeamList}
              />
            </TabPane>
          </Tabs>
        </div>
        <Separate size={15} />
        {
          showUserList
            ? (
                <Table
                  rowKey="id"
                  className="bg-white"
                  columns={COLUMNS}
                  dataSource={userList}
                  loading={userListLoading}
                  pagination={{
                    showQuickJumper: true,
                    total: userPaginator.items,
                    current: userPaginator.page,
                    onChange: this.handleUserPageSubmit,
                    showTotal: (total) => {
                      return `共${total}条`;
                    }
                  }}
                />
              )
            : (
                <TeamList
                  loading={teamListLoading}
                  list={teamList}
                  changePaginator={this.changeTeamPaginator}
                  paginator={teamPaginator}
                  getPerformanceDetail={this.getPerformanceDetail}
                />
              )
        }
        <SubmitSituation
          info={performanceDetail}
          onHide={this.onHideSituation}
          visible={showPerformanceModal}
          loading={loadingPerformanceModal}
        />
      </BasicLayout>
    );
  }
}

export default connect(
  ({ userPerformanceQuery, loading }) => ({ loading, ...userPerformanceQuery })
)(UserPerformance);
