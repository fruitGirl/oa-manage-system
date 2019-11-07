/*
 * @Description: 周报月报统计-部门提交情况
 * @Author: juyang
 * @Date: 2019-05-14 16:56:26
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 11:06:16
 */

import React from 'react';
import 'styles/components/workReport/workReportStatisticQuery/pushSituation.less';

const { Row, Col, Checkbox } = window.antd;

class PushSituation extends React.PureComponent {
  render() {
    const {workReprotDetailUrl, submitList, unSubmitList, reportTime, needSubDepartment} = this.props;
    const submitListCount = submitList.length;
    const unSubmitListCount = unSubmitList.length;
    const allListCount = submitListCount + unSubmitListCount;
    const dataTimes = reportTime.split('-');

    return (
      <div className="push-situation">
        <div className="clearfix header">
          <span className="pull-left push-situatin-tit">
            部门提交情况
            &nbsp;&nbsp;
            {dataTimes[0]}年第{dataTimes[1]}周
          </span>
          <span className="pull-right">
            <Checkbox onChange={this.props.onChildrenDepartChange} checked={needSubDepartment}>子部门</Checkbox>
            <a href="/workReport/workReportPageQuery.htm" style={{"marginLeft":"10px"}}>全公司</a>
          </span>
        </div>
        <Row>
          <Col span={12} className="even-push-wrapper">
            <p className="title">已提交({submitListCount} / {allListCount})</p>
            <ul className="scroll">
              {
                submitList.map((item) => {
                  const linkUrl = workReprotDetailUrl + '?workReportId=' + item.id;
                  return (<li className="clearfix" key={item.id}>
                        <span className="pull-left">{item.userName}</span>
                        {item.canView ? <a className="pull-right detail-link" href={linkUrl} target="_blank" rel="noopener noreferrer">查看</a> : <span className="pull-right">-</span>}
                      </li>);
                })
              }
            </ul>
          </Col>
          <Col span={12} className="none-push-wrapper">
            <p className="title">未提交({unSubmitListCount} / {allListCount})</p>
            <ul className="scroll">
            {unSubmitList.map( (item) => {
              return (<li className="clearfix" key={item.id}>
                    <span className="pull-left">{item.userName}</span>
                    </li>);
            })}
            </ul>
          </Col>
        </Row>
      </div>
    );
  }
}


PushSituation.propTypes = {
  /** 部门名称 */
  departmentName: PropTypes.string,

  /** 已经提交 */
  submitList: PropTypes.array,

  /** 未提交 */
  unSubmitList: PropTypes.array,
  workReprotDetailUrl: PropTypes.string
};

PushSituation.defaultProps = {
  workReprotDetailUrl: window.CONFIG.pageData && window.CONFIG.pageData.userWorkReportQueryUrl
};

export default PushSituation;
