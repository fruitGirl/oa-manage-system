/*
 * @Description: 绩效统计卡片
 * @Author: danding
 * @Date: 2019-07-09 19:04:04
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-13 15:27:07
 */

import React from 'react';
import PropTypes from 'prop-types';
import 'styles/components/performance/PerformanceStatistics.less';
import Separate from 'components/common/Separate';
import { COLORS } from 'constants/performance/performanceStatistics';

const { Row, Col, Progress } = window.antd;

class PerformanceStatistics extends React.PureComponent {
  // 点击卡片
  onClickCard = () => {
    const { info } = this.props;
    this.props.onClickCard && this.props.onClickCard(info.teamId);
  }

  // 点击最新动态
  onClickRecentNews = () => {
    const { info } = this.props;
    this.props.onClickRecentNews && this.props.onClickRecentNews(info.teamId);
  }

  render() {
    const {
      showOperate = true,
      operate,
      tip,
      team,
      desc,
      isConfirmStatus,
      info,
      isRecentNews,
      noDataText,
    } = this.props;
    const {
      performanceScoreStatistics = [],
      departmentUserNum = 0,
      teamUserNum = 0,
      latestLog = null
    } = info;
    const showPercentLine = performanceScoreStatistics && performanceScoreStatistics.length; // 显示百分比线

    return (
      <div className='performance-statistics'>
        <div onClick={this.onClickCard} className="performance-statistics-wrapper">
          <div className="header">
            <Row type="flex" justify="space-between">
              <Col style={{flex: 1}}>
                <div className="team">{team}</div>
                <Separate size={12} />
                <div className="desc">{desc}</div>
              </Col>
              { (showOperate && showPercentLine)
                ? (
                    <Col>
                      <div className="operate-wrapper">
                        { operate }
                      </div>
                    </Col>
                )
                : null
              }
            </Row>
          </div>
          <Separate />
          <div>
            <div className="tip-wrapper">
              {tip}
            </div>
            {
              showPercentLine
                ? (
                    <div className="process-wrapper">
                      { performanceScoreStatistics.map((i, index) => {
                          const { userNum, score, } = i;
                          return (
                            <Row type="flex" className="process-item">
                              <Col className="label" span={4}>{score}分</Col>
                              <Col span={17}>
                                <Progress
                                  format={(percent) => {
                                    return (
                                      <div className="value">
                                        <Separate size={5} isVertical={false} />
                                        {userNum}人
                                        <Separate isVertical={false} />
                                        {`${percent}%`}
                                      </div>
                                    );
                                  }}
                                  percent={T.tool.getPercent(userNum, (departmentUserNum || teamUserNum))}
                                  strokeColor={COLORS[index]}
                                />
                              </Col>
                            </Row>
                          );
                        })
                      }
                    </div>
                  )
                : <div className="no-result">{noDataText}</div>
            }
          </div>
          { isConfirmStatus
              ? <img
                  className="confirm-performance-icon"
                  src={T.getImg('end_performance.png')}
                  alt=""
                />
              : null
          }
        </div>
        {
          isRecentNews && showPercentLine
          ? (
            <div onClick={this.onClickRecentNews} className="recent-new">
              最新动态
              {
                latestLog ? (
                  <span className="lasest-log-show">
                    {latestLog.operator || ''} {latestLog.gmtCreate || ''} {latestLog.action.message || ''} {latestLog.content ? `确认简评: ${latestLog.content}` : ''}
                  </span>
                ) : '无'
              }
            </div>
          ) : null
        }
      </div>
    );
  }
}

PerformanceStatistics.propTypes = {
  showOperate: PropTypes.bool, // 是否显示操作按钮
  operate: PropTypes.node, // 操作按钮
  tip: PropTypes.string, // 提示
  team: PropTypes.string, // 团队名
  desc: PropTypes.string, // 团队提交详情
  isConfirmStatus: PropTypes.bool, // 是否确认绩效
  info: PropTypes.object, // 绩效分数信息
  isRecentNews: PropTypes.bool, // 是否显示最新动态
  noDataText: PropTypes.string, // 无数据时的提示
};

PerformanceStatistics.defaultProps = {
  showOperate: true,
  operate: null,
  tip: '',
  team: '',
  desc: '',
  isConfirmStatus: false,
  info: {},
  isRecentNews: false,
  noDataText: '负责人未确认，暂无数据'
};

export default PerformanceStatistics;
