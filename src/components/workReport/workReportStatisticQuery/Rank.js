/*
 * @Description: 周报月报统计-部门提交情况
 * @Author: juyang
 * @Date: 2019-05-14 16:56:26
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-22 10:14:53
 */

import React from 'react';
import 'styles/components/workReport/workReportStatisticQuery/rank.less';

class Rank extends React.PureComponent {
  render() {
    return (
      <div className="department-rank">
        <div className="header">
          <span className="department-rank-tit">
            公司部门排行
            &nbsp;&nbsp;
            第xxx
          </span>
        </div>
        <div className="rank-content-wrapper">
          <p className="clearfix title">
            <span className="pull-left">部门</span>
            <span className="pull-right">提交率</span>
          </p>
          <ul className="scroll">
            <li className="clearfix">
              <span>1</span>
              <span className="pull-left">王林</span>
              <a className="pull-right detail-link">查看</a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Rank;
