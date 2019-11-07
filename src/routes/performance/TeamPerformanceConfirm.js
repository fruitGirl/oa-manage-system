/*
 * @Description: 团队负责人绩效确认详情
 * @Author: danding
 * @Date: 2019-08-15 16:42:22
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-15 16:42:22
 */

import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import PerformanceStatistics from 'components/performance/teamPerformanceConfirm/PerformanceStatistics';
import Separate from 'components/common/Separate';
import SubmitSituation from 'components/performance/teamPerformanceConfirm/SubmitSituation';
import HistoryList from 'components/performance/teamPerformanceConfirm/HistoryList';
import SelfTeamPerformanceStatistics from 'components/performance/teamPerformanceConfirm/SelfTeamPerformanceStatistics';

const { Row, Col, Button, Modal, Spin, Empty } = window.antd;

class TeamPerformanceConfirm extends React.PureComponent {
  componentDidMount() {
    this.initData();
  }

  initData() {
    const {
      timeRange,
      year,
      performanceTypeCode,
      teamId,
      readonly
    } = T.tool.getSearchParams();
    this.timeRange = timeRange; // 绩效的考核期限
    this.year = year;
    this.readonly = readonly; // 是否只读模式
    this.performanceAssessmentTypeCode = performanceTypeCode; // 绩效的类型：季度/年度
    this.teamId = teamId;

    this.getTeamPerformanceInfo({
      timeRange,
      year,
      performanceAssessmentTypeCode: performanceTypeCode,
      teamId
    });
  }

  // 获取团队的所有绩效信息
  getTeamPerformanceInfo(payload) {
    this.props.dispatch({
      type: 'teamPerformanceConfirm/getTeamPerformanceInfo',
      payload
    });
  }

  // 获取团队清单的提交详情
  getOtherPerformanceDetail = (params) => {
    const { departmentId, departmentName } = params;
    this.props.dispatch({
      type: 'teamPerformanceConfirm/getOtherPerformanceDetail',
      payload: {
        departmentId,
        timeRange: this.timeRange,
        year: this.year,
        name: departmentName
      }
    });
  }

  // 获取自己管辖的所有团队信息
  getSelfPerformanceDetail = () => {
    const { selfTeamInfo } = this.props;
    const { id, name } = selfTeamInfo;
    const { timeRange, year } = this;
    this.props.dispatch({
      type: 'teamPerformanceConfirm/getSelfPerformanceDetail',
      payload: {
        teamId: id,
        year,
        timeRange,
        name
      }
    });
  }

  // 打回
  refuse = (params) => {
    Modal.confirm({
      title: '确定打回?',
      content: '打回后，部门内已提交的全部成员将回退到上级点评阶段',
      cancelButtonProps: {
        size: 'small'
      },
      okButtonProps: {
        size: 'small'
      },
      onOk: () => {
        const { timeRange, teamId, performanceAssessmentTypeCode, year } = this;
        const { departmentId } = params;
        this.props.dispatch({
          type: 'teamPerformanceConfirm/refuse',
          payload: {
            departmentId,
            timeRange,
            year,
            teamId,
            performanceAssessmentTypeCode
          }
        });
      }
    });
  }

  // 提交绩效
  submitPerformance = () => {
    const { selfTeamInfo } = this.props;
    const { timeRange, performanceAssessmentTypeCode, year } = this;
    this.props.dispatch({
      type: 'teamPerformanceConfirm/confirm',
      payload: {
        timeRange,
        year,
        performanceAssessmentTypeCode,
        teamId: selfTeamInfo.id
      }
    });
  }

  // 隐藏详情弹窗
  onHide = () => {
    this.props.dispatch({
      type: 'teamPerformanceConfirm/displayPerformanceModal',
      payload: false
    });
  }

  render() {
    const { otherTeamList, history, selfTeamInfo, showPerformanceModal, performanceDetail, loading } = this.props;
    const { readonly } = this;
    const { teamConfirmResult, performanceFinish } = selfTeamInfo;
    const teamLoading = loading.effects['teamPerformanceConfirm/getTeamPerformanceInfo'];
    const loadingModal = loading.effects['teamPerformanceConfirm/getSelfPerformanceDetail'] || loading.effects['teamPerformanceConfirm/getOtherPerformanceDetail'] || false;

    return (
      <BasicLayout>
        <Spin spinning={teamLoading}>
          <SelfTeamPerformanceStatistics
            hideBtn={readonly || teamConfirmResult}
            getPerformanceDetail={this.getSelfPerformanceDetail}
            info={selfTeamInfo}
            submitPerformance={this.submitPerformance}
          />
          <Separate size={15} />
          <div className="teams-wrapper">
            <h3 className="teams-title">团队清单</h3>
            <Row gutter={32} className="teams-content">
              {
                otherTeamList.map(i => {
                  const { submitUserNum, unSubmitUserNum, departmentUserNum, departmentName, departmentManager, departmentId } = i;

                  return (
                    <Col span={8}>
                      <PerformanceStatistics
                        info={i}
                        team={`${departmentName} | ${departmentManager}`}
                        desc={(
                          <div
                            className="desc-operate"
                            onClick={() => this.getOtherPerformanceDetail({ departmentId, departmentName })}
                          >
                            <span>共 {departmentUserNum} 人，</span>
                            <span>
                              未提交
                              <span className="attention"> {unSubmitUserNum} </span>人
                              <span>&nbsp;&gt;</span>
                            </span>
                          </div>
                        )}
                        showOperate={!readonly && !teamConfirmResult}
                        isConfirmStatus={performanceFinish}
                        tip={`总共${submitUserNum}人提交`}
                        operate={(
                          <div>
                            <Button
                              onClick={() => this.refuse(i)}
                              size="small"
                              type="primary"
                              ghost
                            >全部打回</Button>
                          </div>
                        )}
                      />
                    </Col>
                  );
                })
              }
              {
                otherTeamList.length
                  ? null
                  : (
                      <div className="no-result">
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      </div>
                  )
              }
            </Row>
          </div>
        </Spin>
        <Separate size={15} />
        <HistoryList list={history} />
        <SubmitSituation
          onHide={this.onHide}
          info={performanceDetail}
          visible={showPerformanceModal}
          loading={loadingModal}
        />
      </BasicLayout>
    );
  }
}

export default connect(({ teamPerformanceConfirm, loading }) => ({ ...teamPerformanceConfirm, loading }))(TeamPerformanceConfirm);


