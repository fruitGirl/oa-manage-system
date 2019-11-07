/*
 * @Description: 新闻表单
 * @Author: danding
 * @Date: 2019-04-23 09:42:11
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 17:58:33
 */

import React from 'react';
import { connect } from 'dva';
import 'styles/components/system/infoCreate/normalForm.less';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import Separate from 'components/common/Separate';
import { formItemLayout, EDITOR_CONTROLS, requireRule, fileLayout, posIntRule, editorUpload } from 'constants/components/system/infoNormalForm';
import UploadImg from 'components/common/UploadImg';
import UploadFile from 'components/common/UploadFile';

const { Form, Input, Select, Icon, Tooltip, Button } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;

class NormalForm extends React.PureComponent {

  componentDidMount() {
    this.getColumnTree();
    this.initialModifyValue();
  }

  // 查看新闻，设置表单数据
  initialModifyValue() {
    const { id } = T.tool.getSearchParams();
    this.id = id;
    if (id) {
      let { content = '', title, summary, channelId, orderValue, } = CONFIG.formData;
      orderValue = orderValue ? parseInt(orderValue, 10) : null;
      let smallFileData = [];
      let fileData = [];

      // 附件
      let addAttachmentFileNames = CONFIG.attachments;
      addAttachmentFileNames = addAttachmentFileNames.map(i => {
        const { id, resourceId, fileName } = i;
        return {
          id,
          uid: id,
          name: fileName,
          url: `/system/infoFile.resource?resourceId=${resourceId}&fileName=${fileName}
          `,
        };
      });

      // 图片
      CONFIG.imgs.forEach(i => {
        const { ownerId, imageId, fileName } = i;
        const data = [
          {
            url: `/system/infoImage.resource?resourceId=${imageId}&imageName=${fileName}
            `,
            ownerId,
          }
        ];
        if (i.ownerType === 'INFO_SMALL_IMAGE') {
          smallFileData = data;
        } else if (i.ownerType === 'INFO') {
          fileData = data;
        }
      });

      this.props.form.setFieldsValue({
        title,
        summary,
        channelId,
        orderValue,
        fileData,
        smallFileData,
        addAttachmentFileNames,
        content: BraftEditor.createEditorState(T.escape2Html(content)),
      });
    }
    this.nickName = document.querySelector('.J-nickname').innerText;
  }

  // 栏目数据源
  getColumnTree() {
    this.props.dispatch({
      type: 'infoCreate/getColumnTree'
    });
  }

  onBack = () => {
    window.history.back();
  }

  onPreview = () => {
    const { form } = this.props;
    form.validateFields((err) => {
      let attachmentFileNames = form.getFieldValue('addAttachmentFileNames');
      attachmentFileNames = attachmentFileNames.map(i => ({
        fileName: i.name
      }));
      !err && this.props.dispatch({
        type: 'infoCreate/showPreview',
        payload: {
          ...this.getValues(),
          nickName: this.nickName,
          attachmentFileNames
        }
      });
    });
  }

  getValues() {
    const content = this.props.form.getFieldValue('content');
    const smallFileData = this.props.form.getFieldValue('smallFileData');
    const fileData = this.props.form.getFieldValue('fileData');
    let addAttachmentFileNames = this.props.form.getFieldValue('addAttachmentFileNames');

    // 筛选出新增或修改的文件
    addAttachmentFileNames = addAttachmentFileNames.filter(i => {
      return i.response && i.response.fileName;
    });
    addAttachmentFileNames = addAttachmentFileNames.map(i => i.response.fileName);
    return {
      ...this.props.form.getFieldsValue(),
      content: content.toHTML(),
      fileData: fileData[0] && fileData[0].imageName,
      smallFileData: smallFileData[0] && smallFileData[0].imageName,
      addAttachmentFileNames: addAttachmentFileNames
    };
  }

  removeImg = (file) => {
    const { ownerType, ownerId } = file;
    ownerId && this.props.dispatch({
      type: 'infoCreate/removeImg',
      payload: { ownerId, ownerType }
    });
  }

  removeFile = (file) => {
    const { id } = file;
    id && this.props.dispatch({
      type: 'infoCreate/removeFile',
      payload: { id }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { id } = this;
    this.props.form.validateFields((err) => {
      !err && this.props.dispatch({
        type: 'infoCreate/submit',
        payload: { id, ...this.getValues() }
      });
    });
  }

  render() {
    const { form, columnData, } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSubmit} className="form-wrapper">
        <FormItem
          label="标题"
          colon={false}
          { ...formItemLayout }
        >
          {getFieldDecorator('title', { rules: requireRule })(
            <Input maxLength={30} placeholder="请输入标题，最多30字" />
          )}
        </FormItem>
        <FormItem
          label="文章摘要"
          colon={false}
          { ...formItemLayout }
        >
          {getFieldDecorator('summary')(
            <Input.TextArea
              rows={3}
              maxLength={100}
              placeholder="请输入内容，最多100字"
            />
          )}
        </FormItem>
        <FormItem
          label="缩略图"
          colon={false}
          { ...formItemLayout }
        >
          {getFieldDecorator('smallFileData', {
            initialValue: []
          })(
            <UploadImg
              action="/system/infoImageUpload.json"
              name="smallFileData"
              resFileName="imageName"
              remove={(data) => this.removeImg({
                  ...data[0],
                  ownerType: 'INFO_SMALL_IMAGE'
              })}
            />
          )}
        </FormItem>
        <FormItem
          label="轮播图"
          colon={false}
          { ...formItemLayout }
        >
          {getFieldDecorator('fileData', {
            initialValue: []
          })(
            <UploadImg
              action="/system/infoImageUpload.json"
              name="fileData"
              resFileName="imageName"
              remove={(data) => this.removeImg({
                ...data[0],
                ownerType: 'INFO'
              })}
            />
          )}
        </FormItem>
        <FormItem
          label="栏目"
          colon={false}
          { ...formItemLayout }
        >
          {getFieldDecorator('channelId', { rules: requireRule })(
            <Select placeholder="请选择" style={{width: 200 }}>
              {
                columnData.map(i => (
                  <Option value={i.value}>{i.label}</Option>
                ))
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          label={
            <span>
              排序值&nbsp;
              <Tooltip title="排序值决定文章的顺序。不填写数值时，文章置顶显示；输入的数值越大，顺序越靠前">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
          colon={false}
          { ...formItemLayout }
        >
          {getFieldDecorator('orderValue', { rules: posIntRule })(
            <Input placeholder="请输入" style={{width: 200 }} />
          )}
        </FormItem>
        <FormItem colon={false} label="文章内容" { ...formItemLayout }>
          {getFieldDecorator('content')(
            <BraftEditor
              controls={EDITOR_CONTROLS}
              className="editor"
              contentStyle={{height: 500}}
              media={{uploadFn: editorUpload}}
            />
          )}
        </FormItem>
        <Form.Item
          label="附件"
          colon={false}
          { ...fileLayout }
        >
          {getFieldDecorator('addAttachmentFileNames', {
            valuePropName: 'fileList',
            initialValue: []
          })(
            <UploadFile
              name="file"
              count={5}
              size={100}
              resFileName="fileName"
              action="/system/infoFileUpload.json"
              onRemove={this.removeFile}
            />
          )}
        </Form.Item>
        <div className="footer-btns">
          <div className="content">
            <Button htmlType="submit" type="primary">保存</Button>
            <Separate isVertical={false} />
            <Button onClick={this.onPreview}>预览</Button>
            <Separate isVertical={false} />
            <Button onClick={this.onBack}>取消</Button>
          </div>
        </div>
      </Form>
    );
  }
}

export default connect(({ infoCreate }) => ({ ...infoCreate }))(Form.create()(NormalForm));


