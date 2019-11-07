/*
 * @Description: 主管周报模板-本周计划
 * @Author: danding
 * @Date: 2019-05-16 09:37:58
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 17:52:47
 */

import React from 'react';
import { connect } from 'dva';
import Separate from 'components/common/Separate';
import 'styles/components/workReport/weekReportForManageEdit/currentWeek.less';

const { Form, Input } = window.antd;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 15 },
};

class CurrentWeek extends React.PureComponent {
  componentDidMount() {
    const { workReportId } = T.tool.getSearchParams();
    this.workReportId = workReportId;
  }

  save = (moduleCode) => {
    const { projectAnalyse, teamThinking } = this.props;
    const { workReportId } = this;
    const content = this.props.form.getFieldValue(moduleCode);
    let prevContent;
    let rest;
    if (moduleCode === 'PROJECT_ANALYSE') { // 项目复盘
      prevContent = projectAnalyse.content;
      rest = projectAnalyse;
    } else if (moduleCode === 'TEAM_THINKING') { // 团队思考
      prevContent = teamThinking.content;
      rest = teamThinking;
    }

    // 有修改，则保存
    if (prevContent !== content) {
      this.props.dispatch({
        type: 'weekReportForManageEdit/saveCurrentItem',
        payload: { ...rest, moduleCode, workReportId, content, }
      });
    }
  }

  isPassValid() {
    let isPass = true;
    this.props.form.validateFields((err, values) => {
      if (err) {
        isPass = false;
      }
    });
    return isPass;
  }

  render() {
    const { form, projectAnalyse, teamThinking } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div>
        <p className="current-week-title">本周工作内容</p>
        <Separate size={20} />
        <Form hideRequiredMark>
          <FormItem
            { ...formItemLayout }
            label="项目复盘"
            colon={false}
          >
            {getFieldDecorator('PROJECT_ANALYSE', {
              initialValue: projectAnalyse.content,
              validateTrigger: 'falsy',
              rules: [{
                required: true,
                message: '请填写',
                whitespace: true
              }]
            })(
              <TextArea
                onBlur={() => this.save('PROJECT_ANALYSE')}
                rows={5}
                maxLength={1000}
                placeholder={`可填： 1.一周团队完成哪些模块开发、测试，项目进度
            2.团队成员亮点`}
              />
            )}
          </FormItem>
          <FormItem
            { ...formItemLayout }
            label="团队思考"
            colon={false}
          >
            {getFieldDecorator('TEAM_THINKING', {
              initialValue: teamThinking.content,
              validateTrigger: 'falsy',
              rules: [{
                required: true,
                message: '请填写',
                whitespace: true
              }]
            })(
              <TextArea
                onBlur={() => this.save('TEAM_THINKING')}
                rows={5}
                maxLength={1000}
                placeholder={`可填：1.问题梳理（项目进行中，遇到的问题以及团队人员发展、项目管理中遇到问题）
           2.解决方案（针对团队问题提出解决方案以及针对方便团队管理，可建立的制度体系）
           3.成效反思（问题解决程度以及针对该问题站在主管角度反思）`}
              />
            )}
          </FormItem>
        </Form>
        <Separate size={20} />
      </div>
    );
  }
}

export default connect(({ weekReportForManageEdit, loading }) => ({ ...weekReportForManageEdit, loading }),  null, null, {withRef: true})(Form.create()(CurrentWeek));
