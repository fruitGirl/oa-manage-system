/*
 * @Description: 审批流程的配置
 * @Author: danding
 * @Date: 2019-09-18 15:55:49
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-27 20:10:13
 */

import React from 'react';
import { connect } from 'dva';
import cloneDeep from 'lodash.clonedeep';
import CustomUserModal from 'components/process/processConfigEdit/CustomUserModal';
import CustomGroupModal from 'components/process/processConfigEdit/CustomGroupModal';
import * as processConst from 'constants/process/processConfigEdit';
import ApproveLaunchUserModal from 'components/process/processConfigEdit/ApproveLaunchUserModal';
import { updateProcessConfig, getSelectedUserEnum, getSelectedGroupOrDeptEnum } from 'constants/components/process/processConfigEdit';
import Tag from 'components/process/processConfigEdit/Tag';

const { Form, Input, Radio, Row, Col, Button, } = window.antd;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const titleLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};
const btnStyle = { color: '#FF7A36', width: '73.42px' };

class ApproveConfig extends React.PureComponent {
  constructor(props) {
    super(props);
    const { selectedKey, startNodeConfig } = props;
    const selectedConfig = this.findProcessData(selectedKey, startNodeConfig);
    const state = this.setConfigData(selectedConfig);
    this.state = {
      ...state,
      showCustomUsersModal: false, // 显示指定人员弹窗
      showCustomGroupModal: false, // 显示指定分类
      showSelfSelectModal: false, // 显示发起人自选弹窗
      showForwradUsersModal: false, // 显示转发人员弹窗
      showForwardGroupModal: false, // 显示转发分类弹窗
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // 赋值
    if (this.props.configData !== nextProps.configData) {
      const state = this.setConfigData(nextProps.configData);
      this.setState(state);
    }
  }

  // 查找当前修改的流程数据
  findProcessData = (compareKey, config) => {
    for (let i = 0; i < config.length; i++) {
      const { childNodes = [], key } = config[i];

      // 匹配到当前的选中项
      if (key === compareKey) {
        return config[i];
      } else if (childNodes && childNodes.length) {
        const findData = this.findProcessData(compareKey, childNodes);
        if (findData) return findData;
      }
    }
  }

  // 设置初始state
  setConfigData = (data = {}) => {
    const { name, processApproveNodePropertiesConfig = {} } = data;
    return {
      name,
      processApproveNodePropertiesConfig
    };
  }

  // 修改名称
  changeName = (e) => {
    const { value } = e.target;
    const { selectedKey } = this.props;
    this.setState({
      name: value
    });
    const payload = {
      name: value,
      key: selectedKey
    };
    this.updateConfig(payload);
  }

  // 标题输入框失焦
  nameInputBlur = (e) => {
    const { value } = e.target;
    if (!value) {
      this.changeName({ target: { value: '审批' }});
    }
  }

  // 更新配置
  updateConfig = (payload) => {
    const { startNodeConfig } = this.props;
    const cloneConfig = cloneDeep(startNodeConfig);
    updateProcessConfig(payload, cloneConfig);
    this.props.dispatch({
      type: 'processConfigEdit/updateProcessLine',
      payload: cloneConfig
    });
  }

  // 控制人员弹窗的显隐
  displayUserModal = (visible) => {
    this.setState({
      showCustomUsersModal: visible
    });
  }

  // 修改审批人选择
  onChangeApproveUser = (e) => {
    const { selectedKey } = this.props;
    const approverObjectType = e.target.value;
    const { processApproveNodePropertiesConfig } = this.state;

    // 选择发起人自选
    const selectedSelfSelect = approverObjectType === processConst.APPROVE_USER_SELF_SELECT;

    const payload = {
      processApproveNodePropertiesConfig: {
        ...processApproveNodePropertiesConfig,
        approverObjectType,
        approverObjectIds: [],
        selfSelectedNumber: selectedSelfSelect ? 1 : 0, // 自选人数
        selfSelectedRangeType: processConst.VISIBLE_RANGE_ALL_USER, // 自选类型
        selfSelectedRangeIds: [], // 自选ids
      },
      key: selectedKey
    };
    this.setState(payload);
    this.updateConfig(payload);
  }

  // 控制分类弹窗的显隐
  displayGroupModal = (visible) => {
    this.setState({
      showCustomGroupModal: visible
    });
  }

  // 修改转交类型
  onChangeForward = (e) => {
    const { selectedKey } = this.props;
    const autoForwardObjectType = e.target.value;
    const autoPass = autoForwardObjectType === true; // 是否自动转发
    const { processApproveNodePropertiesConfig } = this.state;
    const payload = {
      processApproveNodePropertiesConfig: {
        ...processApproveNodePropertiesConfig,
        autoForwardObjectType,
        autoPass,
        autoForwardObjectId: ''
      },
      key: selectedKey
    };
    this.setState(payload);
    this.updateConfig(payload);
  }

  // 审批方式
  onChangeWay = (e) => {
    const { selectedKey } = this.props;
    const approveWay = e.target.value;
    const { processApproveNodePropertiesConfig } = this.state;
    const payload = {
      processApproveNodePropertiesConfig: {
        ...processApproveNodePropertiesConfig,
        approveWay,
      },
      key: selectedKey
    };
    this.setState(payload);
    this.updateConfig(payload);
  }

  // 控制自选弹窗显隐
  displaySelfSelectModal = (visible) => {
    this.setState({
      showSelfSelectModal: visible
    });
  }

  // 选择审批人
  selectApprIds = (ids) => {
    const { processApproveNodePropertiesConfig } = this.state;
    const { selectedKey } = this.props;
    const payload = {
      processApproveNodePropertiesConfig: {
        ...processApproveNodePropertiesConfig,
        approverObjectIds: ids,
      },
      key: selectedKey
    };
    this.setState(payload);
    this.updateConfig(payload);
  }

  /** 渲染用户标签
   * @param {Number} selectedId 删除的id
   * @param {Array} allUsers 所有用户数据
   * @param {String} paramName 需要更新的参数名
   * @param {Boolean} idIsArray 参数是否是数组类型
   */
  renderUserTags = (selectedId, allUsers, paramName, idIsArray = true) => {
    const configs = getSelectedUserEnum(selectedId, allUsers);
    return configs.map(i => {
      if (!i) return null;
      const { label, value } = i;
      return (
        <Tag
          label={label}
          value={value}
          onRemove={() => this.remove(value, paramName, idIsArray)}
        />
      );
    });
  }

  /** 渲染分类标签
   * @param {Number} selectedId 删除的id
   * @param {Array} allUsers 所有用户数据
   * @param {String} paramName 需要更新的参数名
   * @param {Boolean} idIsArray 参数是否是数组类型
   */
  renderGroupTags = (selectedId, allGroups, paramName, idIsArray) => {
    const configs = getSelectedGroupOrDeptEnum(selectedId, allGroups);
    return configs.map(i => {
      if (!i) return null;
      const { label, value } = i;
      return (
        <Tag
          label={label}
          value={value}
          onRemove={() => this.remove(value, paramName, idIsArray)}
        />
      );
    });
  }

  // 删除审批人标签
  remove = (id, paramName, idIsArray = true) => {
    const { selectedKey } = this.props;
    const { processApproveNodePropertiesConfig } = this.state;
    const removeIds = processApproveNodePropertiesConfig[paramName];
    let selectedIds;

    // 当前的标签是否是多选的
    if (idIsArray) {
      selectedIds = [ ...removeIds ];
      const matchIdx = selectedIds.findIndex(i => i === id);
      selectedIds.splice(matchIdx, 1);
    }
    const payload = {
      processApproveNodePropertiesConfig: {
        ...processApproveNodePropertiesConfig,
        [paramName]: selectedIds, // 当前修改的字段
      },
      key: selectedKey
    };
    this.setState(payload);
    this.updateConfig(payload);
  }

  // 显示转交人员弹窗
  displayForwradUsersModal = (visible) => {
    this.setState({
      showForwradUsersModal: visible
    });
  }

  // 显示转交分类弹窗
  displayForwradGroupModal = (visible) => {
    this.setState({
      showForwardGroupModal: visible
    });
  }

  // 选择转交的对象
  selectForwardId = (id) => {
    const { processApproveNodePropertiesConfig } = this.state;
    const { selectedKey } = this.props;
    const payload = {
      processApproveNodePropertiesConfig: {
        ...processApproveNodePropertiesConfig,
        autoForwardObjectId: id,
      },
      key: selectedKey
    };
    this.setState(payload);
    this.updateConfig(payload);
  }

  // 提交自选
  submitSelfSelect = (vals) => {
    this.displaySelfSelectModal(false);
    const { processApproveNodePropertiesConfig } = this.state;
    const { selectedKey } = this.props;
    const payload = {
      processApproveNodePropertiesConfig: {
        ...processApproveNodePropertiesConfig,
        ...vals
      },
      key: selectedKey
    };
    this.setState(payload);
    this.updateConfig(payload);
  }

  render() {
    const { showCustomUsersModal, showCustomGroupModal, name, showSelfSelectModal, processApproveNodePropertiesConfig = {}, showForwradUsersModal, showForwardGroupModal } = this.state;

    const { allUsers, allGroups, allDepts } = this.props;
    const { approveWay, approverObjectType, autoForwardObjectType, approverObjectIds, autoForwardObjectId } = processApproveNodePropertiesConfig || {};

    // 是否选择了审批人的类型
    const isSelectedApprGroup = approverObjectType === processConst.APPROVE_USER_GROUP;
    const isSelectedApprUser = approverObjectType === processConst.APPROVE_USER_USER;
    const isSelctedApprSelf = approverObjectType === processConst.APPROVE_USER_SELF_SELECT;

    // 是否选择了审批转交的类型
    const isSelectedForwUser = autoForwardObjectType === processConst.APPROVE_FORWARD_USER;
    const isSelectedForwGroup = autoForwardObjectType === processConst.APPROVE_FORWARD_GROUP;

    return (
      <div>
        <h3 className="process-title">设置审批</h3>
        <Form
          colon={false}
          { ...layout }
        >
          <FormItem { ...titleLayout } required label="标题">
            <Input
              value={name}
              onChange={this.changeName}
              onBlur={this.nameInputBlur}
              placeholder="审批"
              maxLength={30}
            />
          </FormItem>
          <FormItem label="审批人">
            <RadioGroup
              className="range-select-comp"
              onChange={this.onChangeApproveUser}
              value={approverObjectType}
            >
              <Row gutter={16} type="flex">
                <Col>
                  <Radio value={processConst.APPROVE_USER_MANAGEER}>
                    部门负责人 (找不到部门负责人时，由上一级部门负责人代为审批)
                  </Radio>
                </Col>
              </Row>
              <Row className="flex-nowrap" gutter={16} type="flex">
                <Col style={{paddingRight: '21px'}}>
                  <Radio value={processConst.APPROVE_USER_USER}>
                    指定人员
                  </Radio>
                </Col>
                <Col>
                  <Button
                    disabled={!isSelectedApprUser}
                    onClick={() => this.displayUserModal(true)}
                    type="dashed"
                    style={btnStyle}
                  >+ 添加</Button>
                </Col>
                <Col>
                  { isSelectedApprUser && this.renderUserTags(approverObjectIds, allUsers, 'approverObjectIds') }
                </Col>
              </Row>
              <Row className="flex-nowrap" gutter={16} type="flex">
                <Col style={{paddingRight: '21px'}}>
                  <Radio value={processConst.APPROVE_USER_GROUP}>
                    指定分类
                  </Radio>
                </Col>
                <Col>
                  <Button
                    disabled={!isSelectedApprGroup}
                    onClick={() => this.displayGroupModal(true)}
                    type="dashed"
                    style={btnStyle}
                  >+ 添加</Button>
                </Col>
                <Col>
                  { isSelectedApprGroup && this.renderGroupTags(approverObjectIds, allGroups, 'approverObjectIds') }
                </Col>
              </Row>
              <Row className="flex-nowrap" gutter={16} type="flex">
                <Col>
                  <Radio value={processConst.APPROVE_USER_SELF_SELECT}>
                    发起人自选
                  </Radio>
                </Col>
                <Col>
                  <Button
                    disabled={!isSelctedApprSelf}
                    onClick={() => this.displaySelfSelectModal(true)}
                    type="dashed"
                    style={btnStyle}
                  >设置</Button>
                </Col>
              </Row>
            </RadioGroup>
          </FormItem>
          <FormItem label="审批方式">
            <RadioGroup
              className="range-select-comp"
              onChange={this.onChangeWay}
              value={approveWay}
            >
              {
                processConst.APPROVE_WAYS.map(i => (
                  <div>
                    <Radio value={i.value}>
                      { i.label }
                    </Radio>
                  </div>
                ))
              }
            </RadioGroup>
          </FormItem>
          <FormItem label="审批人为空时">
            <RadioGroup
              className="range-select-comp"
              onChange={this.onChangeForward}
              value={autoForwardObjectType || processConst.APPROVE_FORWARD_AUTO_PASS}
            >
              <Row gutter={16} type="flex">
                <Col>
                  <Radio value={processConst.APPROVE_FORWARD_AUTO_PASS}>
                    自动通过
                  </Radio>
                </Col>
              </Row>
              <Row gutter={16} type="flex">
                <Col>
                  <Radio value={processConst.APPROVE_FORWARD_USER}>
                    转交给指定人员审批
                  </Radio>
                </Col>
                <Col>
                  <Button
                    disabled={!isSelectedForwUser}
                    onClick={() => this.displayForwradUsersModal(true)}
                    type="dashed"
                    style={btnStyle}
                  >+ 添加</Button>
                </Col>
                <Col>
                  { isSelectedForwUser && this.renderUserTags(autoForwardObjectId
                      ? [autoForwardObjectId]
                      : [],
                    allUsers,
                    'autoForwardObjectId',
                    false
                    )
                  }
                </Col>
              </Row>
              <Row gutter={16} type="flex">
                <Col>
                  <Radio value={processConst.APPROVE_FORWARD_GROUP}>
                    转交给指定分类审批
                  </Radio>
                </Col>
                <Col>
                  <Button
                    disabled={!isSelectedForwGroup}
                    onClick={() => this.displayForwradGroupModal(true)}
                    type="dashed"
                    style={btnStyle}
                  >+ 添加</Button>
                </Col>
                <Col>
                  { isSelectedForwGroup && this.renderGroupTags(autoForwardObjectId
                      ? [autoForwardObjectId]
                      : [],
                    allGroups,
                    'autoForwardObjectId',
                    false
                  ) }
                </Col>
              </Row>
            </RadioGroup>
          </FormItem>
        </Form>
        { isSelectedApprUser && <CustomUserModal
          dataProvider={allUsers}
          visible={showCustomUsersModal}
          value={approverObjectIds}
          hideModal={() => this.displayUserModal(false)}
          onSubmit={this.selectApprIds}
        /> }
        { isSelectedApprGroup && <CustomGroupModal
          dataProvider={allGroups}
          visible={showCustomGroupModal}
          value={approverObjectIds}
          onSubmit={this.selectApprIds}
          hideModal={() => this.displayGroupModal(false)}
        /> }
        { isSelectedForwUser && <CustomUserModal
          isMultiple={false}
          dataProvider={allUsers}
          visible={showForwradUsersModal}
          value={autoForwardObjectId}
          hideModal={() => this.displayForwradUsersModal(false)}
          onSubmit={this.selectForwardId}
        /> }
        { isSelectedForwGroup && <CustomGroupModal
          isMultiple={false}
          dataProvider={allGroups}
          visible={showForwardGroupModal}
          value={autoForwardObjectId}
          onSubmit={this.selectForwardId}
          hideModal={() => this.displayForwradGroupModal(false)}
        /> }
        <ApproveLaunchUserModal
          visible={showSelfSelectModal}
          hideModal={() => this.displaySelfSelectModal(false)}
          allUsers={allUsers}
          allDepts={allDepts}
          allGroups={allGroups}
          onSubmit={this.submitSelfSelect}
          dataProvider={processApproveNodePropertiesConfig}
        />
      </div>
    );
  }
}

export default connect(({ processConfigEdit, loading }) => ({ ...processConfigEdit, loading }))(ApproveConfig);

