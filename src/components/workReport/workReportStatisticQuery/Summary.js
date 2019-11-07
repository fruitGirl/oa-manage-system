/*
 * @Description: 周报月报统计-基本情况
 * @Author: juyang
 * @Date: 2019-05-14 16:56:55
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 11:06:59
 */

import PropTypes from 'prop-types';
import Separate from 'components/common/Separate';
import 'styles/components/workReport/workReportStatisticQuery/summary.less';

const { Button } = window.antd;

const Summary = (props) => {
  const {departmentName, submitCount, myUnSbmitReport} = props;
  const hasUnSubmit = myUnSbmitReport.id !== undefined;
  let reportLink = '';
  if(hasUnSubmit) {
    reportLink =`/workReport/weekReportEdit.htm?workReportId=${myUnSbmitReport.id}`;
  }

  return (
    <div className="clearfix summary-wrapper">
      <div className="pull-left">
        <span>部门：{departmentName}</span>
        <Separate isVertical={false} size={20} />
        <span>部门已提交人数：{submitCount > -1 ? submitCount : '-'}</span>
      </div>
      {hasUnSubmit ? <div className="pull-right">
        <Button className="summary-link" href={reportLink}>查看我的周报(未提交)</Button>
      </div> : null}
    </div>
  );
};

Summary.propTypes = {
  departmentName: PropTypes.string,
  submitCount: PropTypes.number
};

Summary.defaultProps = {
  departmentName: '-',
  submitCount: -1
};

export default Summary;
