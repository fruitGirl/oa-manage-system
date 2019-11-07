/*
 * @Description: 周报主管模板-下周工作计划
 * @Author: danding
 * @Date: 2019-05-16 09:37:30
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 17:52:28
 */

import React from 'react';
import { connect } from 'dva';
import 'styles/components/workReport/weekReportForManageEdit/nextWeek.less';
import EditableTable from 'components/common/editableTable';
import { createColumns } from 'constants/components/workReport/weekReportForManageEdit';
import UploadImg from 'components/workReport/weekReportForManageEdit/UploadImg';
import Separate from 'components/common/Separate';

const { Form, Input } = window.antd;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 15 },
};

class NextWeek extends React.PureComponent {
  componentDidMount() {
    const { workReportId } = T.tool.getSearchParams();
    this.workReportId = workReportId;
  }

  handleSave = (row) => {
    const { workReportId } = this;
    this.props.dispatch({
      type: 'weekReportForManageEdit/saveNextItem',
      payload: {
        ...row,
        moduleCode: 'EXECUTE_POINT',
        workReportId
      }
    });
  }

  deleteRow = (row) => {
    const { id, key } = row;
    this.props.dispatch({
      type: 'weekReportForManageEdit/deleteNextItem',
      payload: {
        contentId: id,
        time: 'NEXT', // 当前周的标志参数
        key
      }
    });
  }

  handleAdd = () => {
    this.props.dispatch({
      type: 'weekReportForManageEdit/addNextItem'
    });
  }

  savePlan = (e) => {
    const { workReportId } = this;
    const { projectPlan } = this.props;
    const content = e.target.value;
    if (projectPlan.content !== content) {
      const payload = {
        ...projectPlan,
        moduleCode: 'PROJECT_PLAN', // 项目计划标识
        workReportId,
        content,
      };
      this.props.dispatch({
        type: 'weekReportForManageEdit/savePlan',
        payload
      });
    }
  }

  isPassValid() {
    return this.tableRef.isPassValid();
  }

  handleDeleteImg = (file, index) => {
    this.props.dispatch({
      type: 'weekReportForManageEdit/deleteImg',
      payload: { file, index }
    });
  }

  handleChangeImg = (fileList) => {
    this.props.dispatch({
      type: 'weekReportForManageEdit/updateFileList',
      payload: fileList
    });
  }

  render() {
    const { nextWeekList, projectPlan, fileList } = this.props;
    const { workReportId } = this;

    return (
      <div>
        <p className="next-week-title">下周工作计划</p>
        <Separate size={20} />
        <Form>
          <FormItem
            { ...formItemLayout }
            label="执行要点"
            colon={false}
          >
            <EditableTable
              rowId="key"
              recordId="id"
              customColumns={createColumns({
                handleDelete: this.deleteRow
              })}
              ref={(ref) => { this.tableRef = ref;} }
              dataSource={nextWeekList}
              handleAdd={this.handleAdd}
              handleSave={this.handleSave}
              bordered={true}
            />
          </FormItem>
          <FormItem
            { ...formItemLayout }
            label="项目计划"
            colon={false}
          >
            <TextArea
              defaultValue={projectPlan.content}
              onBlur={this.savePlan}
              maxLength={1000}
              placeholder="可输入下周项目计划或在下方上传计划图"
              rows={5}
            />
          </FormItem>
          <FormItem
            { ...formItemLayout }
            label="上传图片"
            colon={false}
            >
            <UploadImg
              onDelete={this.handleDeleteImg}
              onChange={this.handleChangeImg}
              defaultValue={fileList}
              action="/workReport/workReportImageUpload.json"
              maxCount={9}
              name="imageContent"
              data={{
                workReportId,
                typeEnum: 'WEEK_REPORT_MANAGE_NEXT_CONTENT'
              }}
            />
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default connect(({ weekReportForManageEdit, loading }) => ({ ...weekReportForManageEdit, loading }), null, null, {withRef: true})(NextWeek);
