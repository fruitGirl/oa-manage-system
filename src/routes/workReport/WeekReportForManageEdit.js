/*
 * @Description: 周报-主管模板
 * @Author: danding
 * @Date: 2019-05-15 19:24:20
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 17:46:13
 */

import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import Header from 'components/workReport/weekReportForManageEdit/Header';
import CurrentWeek from 'components/workReport/weekReportForManageEdit/CurrentWeek';
import NextWeek from 'components/workReport/weekReportForManageEdit/NextWeek';
import Footer from 'components/workReport/weekReportForManageEdit/Footer';
import Separate from 'components/common/Separate';

class WeekReportForManageEdit extends React.PureComponent {
  componentDidMount() {
    this.initList();
  }

  // 初始化数据
  initList() {
    const { currentWeekList, nextWeekList, imgList, } = CONFIG;
    this.props.dispatch({
      type: 'weekReportForManageEdit/initList',
      payload: {
        currentWeekList,
        nextWeekList,
        imgList
      }
    });
  }

  // 提交
  submitPage = () => {
    let isCurWeekPassValid = true;
    this.currentWeekRef.wrappedInstance.validateFields((err, values) => {
      if (err) {
        isCurWeekPassValid = false;
      }
    });
    const isNextWeekPassValid = this.nextWeekRef.wrappedInstance.isPassValid();

    // 校验表单是否通过验证
    if (isCurWeekPassValid && isNextWeekPassValid) {
      const { workReportId } = T.tool.getSearchParams();
      const subTypeEnum = (/weekReportForCommonEdit/).test(window.location.pathname)
        ? 'WEEK_REPORT_COMMON_TEMPLATE'
        : 'WEEK_REPORT_MANAGE_TEMPLATE'; // 模板类型（普通和主管）
      this.props.dispatch({
        type: 'weekReportForManageEdit/submitPage',
        payload: { workReportId, subTypeEnum }
      });
    }
  }

  render() {
    return (
      <BasicLayout>
        <Separate size={1} />
        <Header />
        <div className="week-report-content">
          <CurrentWeek ref={ref => this.currentWeekRef = ref} />
          <NextWeek ref={ref => this.nextWeekRef = ref} />
        </div>
        <Footer submit={this.submitPage} />
      </BasicLayout>
    );
  }
}

export default connect(({ weekReportForManageEdit, loading }) => ({ ...weekReportForManageEdit, loading }))(WeekReportForManageEdit);


