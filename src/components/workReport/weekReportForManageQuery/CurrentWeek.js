/*
 * @Description: 主管周报模板详情-本周计划
 * @Author: danding
 * @Date: 2019-05-16 09:37:58
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-21 18:16:04
 */

import React from 'react';
import { connect } from 'dva';
import Separate from 'components/common/Separate';

const { Form } = window.antd;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 15 },
};

class CurrentWeek extends React.PureComponent {
  render() {
    const { projectAnalyse, teamThinking, } = this.props;

    return (
      <div>
        <p className="week-title">本周工作内容</p>
        <Separate size={20} />
        <Form hideRequiredMark>
          <FormItem
            { ...formItemLayout }
            label="项目复盘"
            colon={false}
          >
            <div dangerouslySetInnerHTML={{ __html: projectAnalyse.content || '-' }}></div>
          </FormItem>
          <FormItem
            { ...formItemLayout }
            label="团队思考"
            colon={false}
          >
            <div  dangerouslySetInnerHTML={{ __html: teamThinking.content || '-' }}></div>
          </FormItem>
        </Form>
        <Separate size={20} />
      </div>
    );
  }
}

export default connect(({ weekReportForManageQuery, loading }) => ({ ...weekReportForManageQuery, loading }))(CurrentWeek);
