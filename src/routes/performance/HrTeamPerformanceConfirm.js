import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import PerformanceStatistics from 'components/performance/teamPerformanceConfirm/PerformanceStatistics';
import Separate from 'components/common/Separate';
import RefuseModal from 'components/performance/teamPerformanceConfirm/RefuseModal';
import HistoryListModal from 'components/performance/hrTeamPerformanceConfirm/HistoryListModal';
import ConfirmPerformanceModal from 'components/performance/hrTeamPerformanceConfirm/ConfirmPerformanceModal';

const { Row, Col, Button, Spin } = window.antd;

class HrTeamPerformanceConfirm extends React.PureComponent {
  componentDidMount() {
    this.initData();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // 打回原因弹窗隐藏，重置选择的部门id
    if (this.props.showRefuseModal && !nextProps.showRefuseModal) {
      this.selectedTeamId = null;
    }
  }

  // 初始化数据
  initData() {
    const {
      timeRange,
      performanceTypeCode,
      title,
      year
    } = T.tool.getSearchParams();
    this.title = title; // 标题
    this.timeRange = timeRange; // 绩效的考核期限
    this.year = year; // 年度
    this.performanceAssessmentTypeCode = performanceTypeCode; // 绩效的类型：季度/年度
    this.selectedTeamId = null; // 当前操作的部门id,现仅用于记录当前打回的部门id
    this.teamId = ''; // 团队id

    this.getTeamPerformanceInfo({
      year,
      timeRange,
      performanceAssessmentTypeCode: performanceTypeCode
    });
  }

  // 获取所有团队绩效信息
  getTeamPerformanceInfo(payload) {
    this.props.dispatch({
      type: 'hrTeamPerformanceConfirm/getTeamPerformanceInfo',
      payload
    });
  }

  // 确认绩效
  confirm = (teamMsg, e) => {
    e.stopPropagation(); // 阻止冒泡
    this.props.dispatch({
      type: 'hrTeamPerformanceConfirm/displayConfirmModal',
      payload: true
    });
    this.teamId = teamMsg.teamId;
  }

  // 隐藏打回原因弹窗
  hideModal = () => {
    this.props.dispatch({
      type: 'hrTeamPerformanceConfirm/displayRefuseModal',
      payload: false
    });
  }

  // 提交打回原因
  submitRefuse = (value) => {
    const { timeRange, performanceAssessmentTypeCode, selectedTeamId, year } = this;
    this.props.dispatch({
      type: 'hrTeamPerformanceConfirm/refuse',
      payload: {
        teamId: selectedTeamId,
        timeRange,
        year,
        ...value,
        performanceAssessmentTypeCode
      }
    });
  }

  // 处理打回点击
  handleRefuse = (teamMsg, e) => {
    e.stopPropagation();
    const { teamId } = teamMsg;
    this.selectedTeamId = teamId;
    this.props.dispatch({
      type: 'hrTeamPerformanceConfirm/displayRefuseModal',
      payload: true
    });
  }

  // 点击卡片跳转
  onClickCard = (payload) => {
    const { performanceAssessmentTypeCode, timeRange, year } = this;
    window.open(`/performance/teamPerformanceConfirm.htm?timeRange=${timeRange}&year=${year}&performanceTypeCode=${performanceAssessmentTypeCode}&teamId=${payload}&readonly=true`);
  }

    // 点击最新动态显示历史记录
    handleClickRecentNews = (teamId) => {
      this.props.dispatch({
        type: 'hrTeamPerformanceConfirm/getHistory',
        payload: { teamId }
      });
    }

    // 历史记录弹窗关闭
    handleCloseConfirmModal = () => {
      this.props.dispatch({
        type: 'hrTeamPerformanceConfirm/displayHistoryListModal',
        payload: false
      });
    }

    // 确认绩效 提交简评
    handleConfirmPerformance = (values) => {
      const { timeRange, performanceAssessmentTypeCode, teamId, year } = this;
      this.props.dispatch({
        type: 'hrTeamPerformanceConfirm/confirm',
        payload: {
          ...values,
          year,
          timeRange,
          performanceAssessmentTypeCode,
          teamId
        }
      });
    }

  render() {
    const { title } = this;
    const {
      history,
      teamPerformanceList,
      showRefuseModal,
      showHistoryListModal,
      showConfirmModal,
      loading
    } = this.props;
    const teamLoading = loading.effects['hrTeamPerformanceConfirm/getTeamPerformanceInfo'];

    return (
      <BasicLayout>
        <Spin spinning={teamLoading}>
        <div className="teams-wrapper">
          <h3 className="teams-title">{title}</h3>
          <Row gutter={32} className="teams-content">
            {
              teamPerformanceList.map(i => {
                const { teamName, teamUserNum, confirm } = i;
                return (
                  <Col span={8}>
                    <PerformanceStatistics
                      info={i}
                      onClickCard={this.onClickCard}
                      onClickRecentNews={this.handleClickRecentNews}
                      team={`${teamName}`}
                      desc={(
                        <div
                          className="desc-operate"
                        >
                          <span>共 {teamUserNum || 0} 人</span>
                        </div>
                      )}
                      isConfirmStatus={confirm}
                      showOperate={!confirm}
                      isRecentNews={true}
                      operate={(
                        <div>
                          <Button
                            onClick={(e) => this.handleRefuse(i, e)}
                            size="small"
                            type="primary"
                            ghost
                          >全部打回</Button>
                          <Separate isVertical={false} />
                           <Button
                            onClick={(e) => this.confirm(i, e)}
                            size="small"
                            type="primary"
                          >确认绩效</Button>
                        </div>
                      )}
                    />
                  </Col>
                );
              })
            }
          </Row>
        </div>
        </Spin>
        <Separate size={16} />
        <RefuseModal
          visible={showRefuseModal}
          hideModal={this.hideModal}
          submit={this.submitRefuse}
        />
        <HistoryListModal
          visible={showHistoryListModal}
          closeModal={this.handleCloseConfirmModal}
          list={history}
        />
        <ConfirmPerformanceModal
          visible={showConfirmModal}
          sumbit={this.handleConfirmPerformance}
        />
      </BasicLayout>
    );
  }
}

export default connect(({ hrTeamPerformanceConfirm, loading, }) => ({ ...hrTeamPerformanceConfirm, loading }))(HrTeamPerformanceConfirm);
