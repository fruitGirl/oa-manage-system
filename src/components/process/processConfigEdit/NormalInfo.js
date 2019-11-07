/*
 * @Description: 流程-基本信息
 * @Author: danding
 * @Date: 2019-09-12 16:29:14
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-27 19:11:23
 */

import React from 'react';
import { connect } from 'dva';
import 'styles/components/process/processConfigEdit/normalInfo.less';
import IconTemplate from 'components/process/processConfigEdit/IconTemplate';
import RoleRange from 'components/process/processConfigEdit/RoleRange';
import ClassificationEditModal from 'components/process/processConfigQuery/ClassificationEditModal';

const { Form, Select, Button, Row, Col, Input } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const normalFormLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};

class NormalInfo extends React.PureComponent {
  componentDidMount() {
    this.props.form.setFieldsValue(this.props.normalInfo);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // 查看编辑模式下，赋值
    if (this.props.normalInfo !== nextProps.normalInfo) {
      this.props.form.setFieldsValue(nextProps.normalInfo);
    }
  }

  // 显示新增审批分类弹窗
  showAddClassifiModal = () => {
    this.props.dispatch({
      type: 'processConfigEdit/displayClassifMsgModal',
      payload: true,
    });
  }

  hideClassifMsgModal = () => {
    this.props.dispatch({
      type: 'processConfigEdit/displayClassifMsgModal',
      payload: false,
    });
  }

  // 保存审批分类
  saveClassifMsg = (payload) => {
    this.props.dispatch({
      type: 'processConfigEdit/saveClassifMsg',
      payload,
    });
  }

  // 修改基本信息
  changeNormaInfo = (payload) => {
    this.props.dispatch({
      type: 'processConfigEdit/changeNormaInfo',
      payload
    });
  }

  // 修改可见性范围
  changeVisibleType = (payload) => {
    this.props.dispatch({
      type: 'processConfigEdit/changeVisibleType',
      payload
    });
  }

  // 修改可见性的选中值
  changeVisibleIds = (payload) => {
    this.props.dispatch({
      type: 'processConfigEdit/changeVisibleIds',
      payload
    });
  }

  render() {
    const { showClassifMsgModal, loading, form, classifiList, allUsers, allDepts, allGroups, processVisibleConfig: { visibleObjectType, visibleObjectIds } } = this.props;
    const { getFieldDecorator } = form;
    const isSavingClassifMsg = loading.effects['processConfigEdit/saveClassifMsg'];

    return (
      <div className="normal-info-wrapper">
        <Form className="info-form-wrapper">
          <FormItem
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 13 }}
            label="审批分类"
          >
            <Row gutter={16}>
              <Col span={14}>
                {
                  getFieldDecorator('typeId', {
                    rules: [{ required: true, message: '请输入' }]
                  })(
                    <Select
                      dropdownMatchSelectWidth={false}
                      onChange={(val) => this.changeNormaInfo({ typeId: val })}
                      placeholder="请选择"
                    >
                      {
                        classifiList.map(i => {
                          const { label, value } = i;
                          return (
                            <Option key={value}>{label}</Option>
                          );
                        })
                      }
                    </Select>
                  )
                }
              </Col>
              <Col span={8}>
                <Button type="primary" onClick={this.showAddClassifiModal}>新增分类</Button>
              </Col>
            </Row>
          </FormItem>

          <FormItem
            { ...normalFormLayout }
            label="审批名称"
          >
            {
              getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入' }]
              })(<Input
                  onChange={(e) => this.changeNormaInfo({ name: e.target.value })}
                  placeholder="请输入审批名称,最多30字"
                  maxLength={30}
                />)
            }
          </FormItem>

          <FormItem
            { ...normalFormLayout }
            label="可见范围"
          >
            {
              getFieldDecorator('processVisibleConfigStr', {
                rules: [{ required: true, message: '请输入' }]
              })(<RoleRange
                  selectedType={visibleObjectType}
                  selectedIds={visibleObjectIds}
                  onChangeVisibleType={this.changeVisibleType}
                  onChangeVisibleIds={this.changeVisibleIds}
                  allUsers={allUsers}
                  allDepts={allDepts}
                  allGroups={allGroups}
                  enableSelectCompany={true}
                />
              )
            }
          </FormItem>

          <FormItem
            { ...normalFormLayout }
            label="审批简介"
          >
            {
              getFieldDecorator('description')(<TextArea
                onChange={(e) => this.changeNormaInfo({ description: e.target.value })}
                placeholder="请输入审批简介，最多100字"
                autosize={{ minRows: 3 }}
                maxLength={100}
              />)
            }
          </FormItem>

          <FormItem
            { ...normalFormLayout }
            label="模板图标"
          >
            {
              getFieldDecorator('logo')(<IconTemplate onChange={(val) => this.changeNormaInfo({ logo: val })} />)
            }
          </FormItem>
        </Form>
        <ClassificationEditModal
          destroyOnClose={true}
          visible={showClassifMsgModal}
          hideModal={this.hideClassifMsgModal}
          onSubmit={this.saveClassifMsg}
          loading={isSavingClassifMsg}
        />
      </div>
    );
  }
}

const NormalInfoForm = Form.create()(NormalInfo);

export default connect(({ loading, processConfigEdit }) => ({ ...processConfigEdit, loading }))(NormalInfoForm);
