/*
 * @Description: 周报-普通模板-下周内容
 * @Author: danding
 * @Date: 2019-05-15 19:25:32
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 17:53:04
 */

import React from 'react';
import { connect } from 'dva';
import EditableTable from 'components/common/editableTable';
import { createColumns } from 'constants/components/workReport/weekReportForCommonEdit';

class NextWeek extends React.PureComponent {
  componentDidMount() {
    this.moduleCode = 'WORK_CONTENT'; // 普通模板
    const { workReportId } = T.tool.getSearchParams();
    this.workReportId = workReportId;
  }

  deleteRow = (row) => {
    const { id, key } = row;
    this.props.dispatch({
      type: 'weekReportForCommonEdit/deleteNextItem',
      payload: {
        contentId: id,
        time: 'NEXT', // 下周的标志参数
        key
      }
    });
  }

  handleAdd = () => {
    this.props.dispatch({
      type: 'weekReportForCommonEdit/addNextItem'
    });
  }

  handleSave = (row) => {
    const { moduleCode, workReportId } = this;
    this.props.dispatch({
      type: 'weekReportForCommonEdit/saveNextItem',
      payload: { ...row, moduleCode, workReportId }
    });
  }

  isPassValid() {
    return this.tableRef.isPassValid();
  }

  render() {
    const { nextWeekList } = this.props;
    return (
      <div>
        <EditableTable
          rowId="key"
          recordId="id"
          title="下周工作计划"
          ref={(ref) => { this.tableRef = ref;} }
          customColumns={createColumns({
            handleDelete: this.deleteRow,
            hideActPercent: true, // 隐藏实际百分比
          })}
          dataSource={nextWeekList}
          handleAdd={this.handleAdd}
          handleSave={this.handleSave}
        />
      </div>
    );
  }
}

export default connect(({ weekReportForCommonEdit, loading }) => ({ ...weekReportForCommonEdit, loading }), null, null, {withRef: true})(NextWeek);
