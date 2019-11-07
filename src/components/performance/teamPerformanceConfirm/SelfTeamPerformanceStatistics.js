/*
 * @Description: 自己管辖团队的绩效
 * @Author: danding
 * @Date: 2019-07-09 19:04:04
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-16 12:20:36
 */

import React from 'react';
import PropTypes from 'prop-types';
import 'styles/components/performance/selfTeamPerformanceStatistics.less';
import Separate from 'components/common/Separate';
import { COLORS } from 'constants/performance/performanceStatistics';

const { Row, Col, Progress, Button, } = window.antd;

class SelfTeamPerformanceStatistics extends React.PureComponent {
  // 提交绩效
  submitPerformance = () => {
    this.props.submitPerformance && this.props.submitPerformance();
  }

  // 获取详情信息
  getPerformanceDetail = () => {
    const { info } = this.props;
    this.props.getPerformanceDetail && this.props.getPerformanceDetail({ departmentId: info.departmentId });
  }

  render() {
    const { info, hideBtn } = this.props;
    const {
      performanceScoreStatistics = [], // 绩效统计分数信息
      name,
      submitUserNum = '',
      unSubmitUserNum = '',
      allUserNum = '',
    } = info;

    return (
      <div className="self-team-performance-statistics">
        <h3 className="team-title">{name}</h3>
        <div>
        { hideBtn
          ? null
          : <Button
              disabled={!!unSubmitUserNum}
              type="primary"
              onClick={this.submitPerformance}
            >提交团队绩效</Button>
        }
        { hideBtn ? null : <Separate isVertical={false} /> }
          <span>
            该团队共 {allUserNum} 人，
            已提交 {submitUserNum} 人，
            未提交<span className="attention"> {unSubmitUserNum} </span>人
          </span>
          <Separate isVertical={false} />
          <a href="javascript:;" onClick={this.getPerformanceDetail}>查看提交详情</a>
        </div>
        <Separate size={25} />
        <div>
          <div className="process-wrapper">
            {
              performanceScoreStatistics.map((i, index) => {
                const { userNum, score, } = i;

                return (
                  <Row type="flex" className="process-item">
                    <Col className="label" span={3}>{score}分</Col>
                    <Col span={15}>
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
                        percent={T.tool.getPercent(userNum, allUserNum)}
                        strokeColor={COLORS[index]}
                      />
                    </Col>
                  </Row>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

SelfTeamPerformanceStatistics.propTypes = {
  info: PropTypes.object, // 绩效信息
  hideBtn: PropTypes.bool, // 是否隐藏确认绩效按钮
};

SelfTeamPerformanceStatistics.defaultProps = {
  info: {},
  hideBtn: false,
};

export default SelfTeamPerformanceStatistics;
