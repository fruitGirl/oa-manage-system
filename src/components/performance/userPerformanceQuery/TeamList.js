/*
 * @Description: 团队列表
 * @Author: danding
 * @Date: 2019-08-07 15:58:42
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-16 12:22:46
 */

import React from 'react';
import PropTypes from 'prop-types';
import PerformanceStatistics from 'components/performance/teamPerformanceConfirm/PerformanceStatistics';
import Separate from 'components/common/Separate';
import { QUARTER_PERFORMANCE } from 'constants/performance';

const { Spin, Row, Col, Empty, Pagination } = window.antd;

class TeamList extends React.PureComponent {
  changePaginator = (page, size) => {
    this.props.changePaginator({
      currentPage: page,
      pageSize: size
    });
  }

  getPerformanceDetail = (payload) => {
    this.props.getPerformanceDetail(payload);
  }

  render() {
    const { list, loading, paginator } = this.props;

    return (
      <Spin spinning={loading}>
        <div className="teams-wrapper">
          <h3 className="teams-title">部门清单</h3>
          <Row gutter={32} className="teams-content">
            {
              list.map(i => {
                const { submitUserNum = '', unSubmitUserNum = '', departmentUserNum, departmentName, departmentManager, departmentId, year, timeRange, performanceTypeCode, hasFinish } = i;
                const showTimeRange = (performanceTypeCode === QUARTER_PERFORMANCE); // 是否显示季度

                return (
                  <Col span={8}>
                    <PerformanceStatistics
                      info={i}
                      showOperate={false}
                      isConfirmStatus={hasFinish}
                      noDataText="无上级点评，暂无数据"
                      team={`${departmentName} | ${departmentManager}`}
                      desc={(
                        <div className="clearfix">
                          <div
                            className="desc-operate pull-left"
                            onClick={() => this.getPerformanceDetail({           departmentId,
                              name: departmentName,
                              year,
                              timeRange
                            })}
                          >
                            <span>共 {departmentUserNum} 人，</span>
                            <span>
                              未提交
                              <span className="attention"> {unSubmitUserNum} </span>人
                              <span>&nbsp;&gt;</span>
                            </span>
                          </div>
                          <div className="text-gray9 pull-right">{`${year}年${showTimeRange ? timeRange : ''}考核`}</div>
                        </div>
                      )}
                      tip={`已提交${submitUserNum}人`}
                    />
                  </Col>
                );
              })
            }
            {
              list.length
                ? null
                : (
                    <div className="no-result">
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )
            }
          </Row>
          <Separate />
          <Pagination
            style={{ textAlign: 'right' }}
            total={paginator.items || 0}
            pageSize={paginator.itemsPerPage || 9}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `总共${total}条`}
            defaultPageSize={9}
            pageSizeOptions={['9', '18', '27', '36']}
            onChange={this.changePaginator}
            onShowSizeChange={this.changePaginator}
          />
          <Separate />
        </div>
      </Spin>
    );
  }
}

TeamList.propTypes = {
  list: PropTypes.array,
  loading: PropTypes.bool,
  paginator: PropTypes.object,
  changePaginator: PropTypes.func,
  getPerformanceDetail: PropTypes.func
};

TeamList.defaultProps = {
  list: [],
  loading: false,
  paginator: {},
  changePaginator: () => {},
  getPerformanceDetail: () => {}
};

export default TeamList;
