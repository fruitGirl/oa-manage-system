/*
 * @Description: 周报-普通模板-当前周内容
 * @Author: danding
 * @Date: 2019-05-15 19:25:32
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 17:53:18
 */

import React from 'react';
import { connect } from 'dva';
import EditableTable from 'components/common/editableTable';
import { createColumns } from 'constants/components/workReport/weekReportForCommonEdit';

class CurrentWeek extends React.PureComponent {
  componentDidMount() {
    this.moduleCode = 'WORK_CONTENT'; // 普通周报
    const { workReportId } = T.tool.getSearchParams();
    this.workReportId = workReportId;
  }

  deleteRow = (row) => {
    const { id, key } = row;
    this.props.dispatch({
      type: 'weekReportForCommonEdit/deleteCurrentItem',
      payload: {
        contentId: id,
        time: 'NOW', // 当前周的标志参数
        key
      }
    });
  }

  handleAdd = () => {
    this.props.dispatch({
      type: 'weekReportForCommonEdit/addCurrentItem'
    });
  }

  handleSave = (row) => {
    const { moduleCode, workReportId } = this;
    this.props.dispatch({
      type: 'weekReportForCommonEdit/saveCurrentItem',
      payload: { ...row, moduleCode, workReportId }
    });
  }

  isPassValid() {
    return this.tableRef.isPassValid();
  }

  render() {
    const { currentWeekList } = this.props;
    return (
      <div>
        <EditableTable
          rowId="key"
          recordId="id"
          title="本周工作内容"
          ref={(ref) => { this.tableRef = ref;} }
          customColumns={createColumns({
            handleDelete: this.deleteRow,
          })}
          dataSource={currentWeekList}
          handleAdd={this.handleAdd}
          handleSave={this.handleSave}
        />
      </div>
    );
  }
}

export default connect(({ weekReportForCommonEdit, loading }) => ({ ...weekReportForCommonEdit, loading }), null, null, {withRef: true})(CurrentWeek);
