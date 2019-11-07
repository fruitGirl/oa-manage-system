/*
 * @Description: 工具-工资发放-上传工资文件
 * @Author: danding
 * @Date: 2019-03-22 19:46:05
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 15:17:36
 */

import { PureComponent } from 'react';
import 'styles/components/salary/salarySend/UploadFile.less';
import { connect } from 'dva';

const { Form, Input, DatePicker, Radio, Upload, Button, message } = window.antd;
const { MonthPicker } = DatePicker;
const RadioGroup = Radio.Group;
const monthFormat = 'YYYY-MM';
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 }
};
const fileType = "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

class UploadFile extends PureComponent {
  changeUploadField = (type, val) => { // 修改表单值
    this.props.dispatch({
      type: 'salarySend/changeUploadField',
      payload: {
        [type]: val
      }
    });
  }

  changeUploadFile = (e) => { // 修改文件
    const typeReg = new RegExp(e.file.type);
    const isLegalType =  typeReg.test(fileType);
    if (!isLegalType) {
      message.warn('请上传xls、xlsx格式的文件');
      return;
    }
    this.props.dispatch({
      type: 'salarySend/uploadFile',
      payload: e.file
    });
  }

  render() {
    const { gmtUpload, title, uploadWay, loading, } = this.props;
    const uploadBtnLoading = loading.effects['salarySend/uploadFile'];

    return (
      <div className="form-wrapper">
        <Form>
          <Form.Item
            label="时间"
            {...formLayout}
          >
            <MonthPicker
              allowClear={false}
              format={monthFormat}
              value={gmtUpload}
              onChange={(e) => { this.changeUploadField('gmtUpload', e); }}
            />
          </Form.Item>
          <Form.Item
            label="标题"
            {...formLayout}
          >
            <Input
              value={title}
              onChange={(e) => { this.changeUploadField('title', e.target.value); }}
            />
          </Form.Item>
          <Form.Item
            label="导入匹配方式"
            {...formLayout}
          >
            <RadioGroup
              value={uploadWay}
              onChange={(e) => { this.changeUploadField('uploadWay', e.target.value); }}
            >
              <Radio value="BY_NICK_NAME">通过花名进行匹配</Radio>
              <Radio value="BY_JOB_NUMBER">通过工号进行匹配</Radio>
            </RadioGroup>
          </Form.Item>
          <Form.Item
            label=" "
            colon={false}
            {...formLayout}
            extra={<a href="/salary/salaryExcelTemplateDownload.resource">下载格式模板</a>}
          >
            <Upload
              beforeUpload={() => false}
              accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={this.changeUploadFile}
              fileList={[]}
            >
              <Button
                icon="upload"
                disabled={uploadBtnLoading}
                loading={uploadBtnLoading}
                type="primary"
              >
                选择文件
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default connect(({ salarySend, loading, }) => ({ ...salarySend.uploadFields, loading }))(UploadFile);

