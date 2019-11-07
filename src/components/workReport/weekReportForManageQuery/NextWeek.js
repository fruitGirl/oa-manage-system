/*
 * @Description: 周报主管模板详情-下周工作计划
 * @Author: danding
 * @Date: 2019-05-16 09:37:30
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-21 18:17:04
 */

import React from 'react';
import { connect } from 'dva';
import Separate from 'components/common/Separate';
import PreviewImg from 'components/common/PreviewImg';

const { Form, Table } = window.antd;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 15 },
};
const columns = [
  {
    dataIndex: 'content',
    title: '执行要点',
    render: (r) => {
      return <div dangerouslySetInnerHTML={{ __html: r }}></div>;
    }
  },
  {
    dataIndex: 'userNames',
    title: '执行人员',
  }
];

class NextWeek extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      activePreviewIndex: 0,
    };
  }

  hideImgModal = () => {
    this.setState({
      previewVisible: false
    });
  }

  previewImg = (idx) => {
    this.setState({
      previewVisible: true,
      activePreviewIndex: idx
    });
  }

  render() {
    const { nextWeekList, projectPlan, fileList, } = this.props;
    const { previewVisible, activePreviewIndex } = this.state;
    return (
      <div>
        <p className="week-title">下周工作计划</p>
        <Separate size={20} />
        <Form>
          <FormItem
            { ...formItemLayout }
            label="执行要点"
            colon={false}
          >
            <Table
              bordered
              rowKey={r => r.id}
              columns={columns}
              dataSource={nextWeekList}
              pagination={false}
            />
          </FormItem>
          <FormItem
            { ...formItemLayout }
            label="项目计划"
            colon={false}
          >
            <div  dangerouslySetInnerHTML={{ __html: projectPlan.content || '-' }}></div>
          </FormItem>
          <FormItem
            { ...formItemLayout }
            label="上传图片"
            colon={false}
            >
              <ul className="clearfix">
                {
                  fileList.map((i, index) => {
                    return (
                      <li
                        style={{
                          margin: '0 15px 15px 0',
                          border: '1px solid #e8e8e8'
                        }}
                        onClick={() => this.previewImg(index)} className="pull-left"
                      >
                        <img
                          style={{width: '100px', height: '100px'}}
                          src={i}
                          alt="图片"
                        />
                      </li>
                    );
                  })
                }
              </ul>
          </FormItem>
        </Form>
        <PreviewImg
          previewVisible={previewVisible}
          hideModal={this.hideImgModal}
          fileList={fileList}
          activeIndex={activePreviewIndex}
        />
      </div>
    );
  }
}

export default connect(({ weekReportForManageQuery, loading }) => ({ ...weekReportForManageQuery, loading }))(NextWeek);
