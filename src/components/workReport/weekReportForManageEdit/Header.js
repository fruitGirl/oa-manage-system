/*
 * @Description: 周报-主管模板-头部
 * @Author: danding
 * @Date: 2019-05-15 19:25:32
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-15 19:26:20
 */

import 'styles/components/workReport/weekReportForManageEdit/header.less';

import Separate from 'components/common/Separate';
import moment from 'moment';

const { Select } = window.antd;
const Option = Select.Option;

// 切换模板
const changeTemplate = (val) => {
  let url;
  const { workReportId } = T.tool.getSearchParams();
  switch (val) {
    case 'common':
      url = `/workReport/weekReportForCommonEdit.htm?workReportId=${workReportId}`;
      break;
    case 'manage':
      url = `/workReport/weekReportForManageEdit.htm?workReportId=${workReportId}`;
      break;
    default:
      break;
  }
  T.tool.redirectTo(url);
};

const Header = () => {
  let { startTime, endTime } = CONFIG;
  const week = moment(new Date(startTime)).week();
  startTime = startTime.slice(0, 10);
  endTime = endTime.slice(0, 10);

  return (
    <div className="clearfix header">
      <div className="pull-left">
        <span className="heavy-tit">第{week}周</span>
        <Separate isVertical={false} />
        <span className="supplement-tit">
          {startTime} / {endTime}
        </span>
      </div>
      <div className="pull-right">
        <Select
          onChange={changeTemplate}
          size="small"
          defaultValue="manage"
        >
          <Option value="common">普通模板</Option>
          <Option value="manage">主管模板</Option>
        </Select>
      </div>
    </div>
  );
};

export default Header;

