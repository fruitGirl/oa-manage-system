/*
 * @Description: 流程-可见范围
 * @Author: danding
 * @Date: 2019-09-12 16:34:01
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-27 20:10:45
 */

import React from 'react';
import PropTypes, { oneOf } from 'prop-types';
import CustomUserModal from 'components/process/processConfigEdit/CustomUserModal';
import CustomGroupModal from 'components/process/processConfigEdit/CustomGroupModal';
import CustomDepartModal from 'components/process/processConfigEdit/CustomDepartModal';
import { VISIBLE_RANGE_ALL_USER, VISIBLE_RANGE_CUSTOM_USER, VISIBLE_RANGE_CUSTOM_DEPART, VISIBLE_RANGE_CUSTOM_GROUP } from 'constants/process/processConfigEdit';
import Tag from 'components/process/processConfigEdit/Tag';

const { Radio, Button, Col, Row, } = window.antd;
const btnStyle = { color: '#FF7A36' };
const tagsStyle = { flexWrap: 'nowrap' };

class RoleRange extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCustomUsersModal: false, // 显示指定人员弹窗
      showCustomDepartModal: false, // 显示指定部门
      showCustomGroupModal: false, // 显示指定分类
    };
  }

  // 隐藏指定人员弹窗
  hideCustomUserModal = () => {
    this.setState({
      showCustomUsersModal: false
    });
  }

  // 修改类型
  onChange = (e) => {
    const type = e.target.value;
    this.props.onChangeVisibleType(type);
  }

  // 隐藏指定人员分类弹窗
  hideCustomGroupModal = () => {
    this.setState({
      showCustomGroupModal: false
    });
  }

  // 隐藏部门弹窗
  hideCustomDepartModal = () => {
    this.setState({
      showCustomDepartModal: false,
    });
  }

  // 添加标签
  selectIds = (ids) => {
    this.props.onChangeVisibleIds(ids);
  }

  // 删除标签
  remove = (id) => {
    let selectedIds = [...this.props.selectedIds];
    const matchIdx = selectedIds.findIndex(i => i === id);
    selectedIds.splice(matchIdx, 1);
    this.props.onChangeVisibleIds(selectedIds);
  }

  // 渲染用户标签
  renderUserTags = () => {
    const { selectedIds, allUsers } = this.props;
    const configs = selectedIds.map(i => {
      return allUsers.find(j => j.value === i);
    });
    return configs.map(i => {
      if (!i) return null;
      const { label, value } = i;
      return (
        <Tag label={label} value={value} onRemove={this.remove} />
      );
    });
  }

  // 渲染树标签
  renderTreeTags = (dataProvider) => {
    const configs = this.getSelectedTrees(dataProvider);
    return configs.map(i => {
      if (!i) return null;
      const { title, value, companyName } = i;
      return (
        <Tag
          label={companyName ? `${companyName}-${title}` : title}
          value={value}
          onRemove={this.remove}
        />
      );
    });
  }

  // 匹配出树下的某一节点
  filterTreeKey = (config, compareVal) => {
    for (let i = 0; i < config.length; i++) {
      if (config[i].value === compareVal) {
        return config[i];
      }
      if (config[i].children) {
        const matchItem =  this.filterTreeKey(config[i].children, compareVal);
        if (matchItem) return matchItem;
      }
    }
  }

  // 获取选择的树节点对象
  getSelectedTrees = (dataProvider) => {
    const { selectedIds } = this.props;
    let configs = selectedIds.map(i => {
      const matchItem = this.filterTreeKey(dataProvider, i);
      return matchItem;
    });
    configs = configs.filter(Boolean);
    return configs;
  }

  render() {
    const { showCustomUsersModal, showCustomGroupModal, showCustomDepartModal } = this.state;
    const { allUsers, allDepts, allGroups, selectedType, selectedIds, enableSelectCompany } = this.props;

    return (
      <div className="range-select-comp">
        <Radio.Group onChange={this.onChange} value={selectedType}>
          <Row gutter={16} type="flex" >
            <Col>
              <Radio value={VISIBLE_RANGE_ALL_USER}>
                全部人员
              </Radio>
            </Col>
          </Row>
          <Row
            className="flex-nowrap"
            gutter={16}
            type="flex"
            style={tagsStyle}
          >
            <Col>
              <Radio value={VISIBLE_RANGE_CUSTOM_USER}>
                指定人员
              </Radio>
            </Col>
            <Col>
              <Button
                disabled={selectedType !== VISIBLE_RANGE_CUSTOM_USER}
                onClick={() => this.setState({ showCustomUsersModal: true })}
                type="dashed"
                style={btnStyle}
              >+ 添加</Button>
            </Col>
            <Col>
              {
                selectedType === VISIBLE_RANGE_CUSTOM_USER
                  ? this.renderUserTags()
                  : null
               }
            </Col>
          </Row>
          <Row gutter={16} type="flex" className="flex-nowrap">
            <Col>
              <Radio value={VISIBLE_RANGE_CUSTOM_DEPART}>
                指定部门
              </Radio>
            </Col>
            <Col>
              <Button
                disabled={selectedType !== VISIBLE_RANGE_CUSTOM_DEPART}
                onClick={() => this.setState({ showCustomDepartModal: true })}
                type="dashed"
                style={btnStyle}
              >+ 添加</Button>
            </Col>
            <Col>
              {
                selectedType === VISIBLE_RANGE_CUSTOM_DEPART
                  ? this.renderTreeTags(allDepts)
                  : null
              }
            </Col>
          </Row>
          <Row gutter={16} type="flex" className="flex-nowrap">
            <Col>
              <Radio value={VISIBLE_RANGE_CUSTOM_GROUP}>
                指定分类
              </Radio>
            </Col>
            <Col>
              <Button
                disabled={selectedType !== VISIBLE_RANGE_CUSTOM_GROUP}
                onClick={() => this.setState({ showCustomGroupModal: true })}
                type="dashed"
                style={btnStyle}
              >+ 添加</Button>
            </Col>
            <Col>
              {
                selectedType === VISIBLE_RANGE_CUSTOM_GROUP
                  ? this.renderTreeTags(allGroups)
                  : null
              }
            </Col>
          </Row>
        </Radio.Group>
        { (selectedType === VISIBLE_RANGE_CUSTOM_USER) && <CustomUserModal
          dataProvider={allUsers}
          visible={showCustomUsersModal}
          value={selectedIds}
          hideModal={this.hideCustomUserModal}
          onSubmit={this.selectIds}
        /> }
        { (selectedType === VISIBLE_RANGE_CUSTOM_GROUP) && <CustomGroupModal
          dataProvider={allGroups}
          visible={showCustomGroupModal}
          value={selectedIds}
          hideModal={this.hideCustomGroupModal}
          onSubmit={this.selectIds}
        /> }
        { (selectedType === VISIBLE_RANGE_CUSTOM_DEPART) && <CustomDepartModal
          dataProvider={allDepts}
          enableSelectCompany={enableSelectCompany}
          visible={showCustomDepartModal}
          value={this.getSelectedTrees(allDepts)}
          hideModal={this.hideCustomDepartModal}
          onSubmit={this.selectIds}
        /> }
      </div>
    );
  }
}

RoleRange.propTypes = {
  allUsers: PropTypes.array,
  allDepts: PropTypes.array,
  allGroups: PropTypes.array,
  selectedType: oneOf([PropTypes.string, PropTypes.number]),
  selectedIds: PropTypes.array
};

RoleRange.defaultProps = {
  allUsers: [],
  allDepts: [],
  allGroups: [],
  selectedType: '',
  selectedIds: []
};

export default RoleRange;
