import React from 'react';
import PropTypes from 'prop-types';

const { Breadcrumb } = window.antd;

export default class WorkReportQueryHeader extends React.PureComponent {
  render() {
    const { userInfo, workReport } = this.props;

    /** 第几周 */
    const workNo = workReport.reportTime
      ? workReport.reportTime.split('-')[1]
      : '';
    const startTime = workReport.startTime
      ? workReport.startTime.substr(0, 10)
      : '';
    const endTime = workReport.endTime
      ? workReport.endTime.substr(0, 10)
      : '';

    return (<div>
      <Breadcrumb>
        <Breadcrumb.Item>月报周报统计</Breadcrumb.Item>
        <Breadcrumb.Item>周报</Breadcrumb.Item>
      </Breadcrumb>
      <strong>{ userInfo.nickName }的周报</strong>（第{workNo}周 {startTime}/{endTime} ）
      </div>);
  }

}


WorkReportQueryHeader.propTypes = {
  userInfo: PropTypes.obj,
  workReport: PropTypes.obj
};

WorkReportQueryHeader.defaultProps = {

};
