/*
 * @Description: 抄送人流程配置
 * @Author: danding
 * @Date: 2019-09-19 14:46:11
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-19 15:18:03
 */

import React from 'react';
import { connect } from 'dva';
import cloneDeep from 'lodash.clonedeep';
import CustomUserModal from 'components/process/processConfigEdit/CustomUserModal';
import CustomGroupModal from 'components/process/processConfigEdit/CustomGroupModal';
import * as processConst from 'constants/process/processConfigEdit';
import { updateProcessConfig, getSelectedUserEnum, getSelectedGroupOrDeptEnum } from 'constants/components/process/processConfigEdit';
import Tag from 'components/process/processConfigEdit/Tag';

const { Form, Input, Radio, Row, Col, Button } = window.antd;
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
const btnStyle = { color: '#FF7A36' };

class NoticeConfig extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCustomUsersModal: false, // 显示指定人员弹窗
      showCustomGroupModal: false, // 显示指定分类
    };
  }

  // 控制人员弹窗的显隐
  displayUserModal = (visible) => {
    this.setState({
      showCustomUsersModal: visible
    });
  }

  // 控制分类弹窗的显隐
  displayGroupModal = (visible) => {
    this.setState({
      showCustomGroupModal: visible
    });
  }

  // 修改抄送人类型
  onChangeNoticeUser = (e) => {
    const { value } = e.target;
    const { selectedKey } = this.props;
    const payload = {
      key: selectedKey,
      processNoticeNodePropertiesConfig: {
        noticeObjectType: value,
        noticeObjectIds: []
      }
    };
    this.updateConfig(payload);
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

  // 修改名称
  changeName = (e) => {
    const { selectedKey } = this.props;
    const { value } = e.target;
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
      this.changeName({ target: { value: '抄送' }});
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

  // 选择抄送对象
  selectIds = (ids) => {
    const { selectedKey, startNodeConfig } = this.props;
    const { processNoticeNodePropertiesConfig: { noticeObjectType } } = this.findProcessData(selectedKey, startNodeConfig);
    const payload = {
      processNoticeNodePropertiesConfig: {
        noticeObjectIds: ids,
        noticeObjectType
      },
      key: selectedKey
    };
    this.updateConfig(payload);
  }

  // 渲染用户标签
  renderUserTags = (noticeObjectId, allUsers) => {
    const configs = getSelectedUserEnum(noticeObjectId, allUsers);
    return configs.map(i => {
      if (!i) return null;
      const { label, value } = i;
      return (
        <Tag
          label={label}
          value={value}
          onRemove={this.remove}
        />
      );
    });
  }

  // 渲染分类标签
  renderGroupTags = (noticeObjectId, allGroups) => {
    const configs = getSelectedGroupOrDeptEnum(noticeObjectId, allGroups);

    return configs.map(i => {
      if (!i) return null;
      const { label, value } = i;
      return (
        <Tag
          label={label}
          value={value}
          onRemove={() => this.remove(value)}
        />
      );
    });
  }

  // 删除标签
  remove = (id) => {
    const { startNodeConfig, selectedKey } = this.props;
    const {
      processNoticeNodePropertiesConfig: {
        noticeObjectType,
        noticeObjectIds = []
      }
    } = this.findProcessData(selectedKey, startNodeConfig);
    let selectedIds = [ ...noticeObjectIds ];
    const matchIdx = selectedIds.findIndex(i => i === id);
    selectedIds.splice(matchIdx, 1);
    const payload = {
      processNoticeNodePropertiesConfig: {
        noticeObjectIds: selectedIds,
        noticeObjectType,
      },
      key: selectedKey
    };
    this.updateConfig(payload);
  }

  render() {
    const { showCustomUsersModal, showCustomGroupModal } = this.state;
    const { startNodeConfig, selectedKey, allUsers, allGroups, } = this.props;
    const {
      name,
      processNoticeNodePropertiesConfig = {}
    } = this.findProcessData(selectedKey, startNodeConfig) || {};
    const { noticeObjectType, noticeObjectIds = [] } = processNoticeNodePropertiesConfig || {};
    const isSelectedUser = (noticeObjectType === processConst.NOTICE_TO_USER);
    const isSelectedGroup = (noticeObjectType === processConst.NOTICE_TO_GROUP);

    return (
      <div>
        <h3 className="process-title">设置抄送</h3>
        <Form
          colon={false}
          { ...layout }
        >
          <FormItem {...titleLayout} required label="标题">
            <Input
              value={name}
              onChange={this.changeName}
              onBlur={this.nameInputBlur}
              placeholder="抄送"
              maxLength={30}
            />
          </FormItem>
          <FormItem label="抄送人">
            <RadioGroup
              className="range-select-comp"
              onChange={this.onChangeNoticeUser}
              value={noticeObjectType}
            >
              <Row className="flex-nowrap" gutter={16} type="flex">
                <Col style={{paddingRight: '21px'}}>
                  <Radio value={processConst.NOTICE_TO_GROUP}>
                    指定分类
                  </Radio>
                </Col>
                <Col>
                  <Button
                    disabled={!isSelectedGroup}
                    onClick={() => this.displayGroupModal(true)}
                    type="dashed"
                    style={btnStyle}
                  >+ 添加</Button>
                </Col>
                <Col>
                  { isSelectedGroup && this.renderGroupTags(noticeObjectIds, allGroups) }
                </Col>
              </Row>
              <Row className="flex-nowrap" gutter={16} type="flex">
                <Col style={{paddingRight: '21px'}}>
                  <Radio value={processConst.NOTICE_TO_USER}>
                    指定人员
                  </Radio>
                </Col>
                <Col>
                  <Button
                    disabled={!isSelectedUser}
                    onClick={() => this.displayUserModal(true)}
                    type="dashed"
                    style={btnStyle}
                  >+ 添加</Button>
                </Col>
                <Col>
                  { isSelectedUser && this.renderUserTags(noticeObjectIds, allUsers) }
                </Col>
              </Row>
            </RadioGroup>
          </FormItem>
        </Form>
        { isSelectedUser && <CustomUserModal
          dataProvider={allUsers}
          visible={showCustomUsersModal}
          value={noticeObjectIds}
          hideModal={() => this.displayUserModal(false)}
          onSubmit={this.selectIds}
        /> }
        { isSelectedGroup && <CustomGroupModal
          dataProvider={allGroups}
          visible={showCustomGroupModal}
          value={noticeObjectIds}
          hideModal={() => this.displayGroupModal(false)}
          onSubmit={this.selectIds}
        /> }
      </div>
    );
  }
}

export default connect(({ processConfigEdit, loading }) => ({ ...processConfigEdit, loading }))(NoticeConfig);

