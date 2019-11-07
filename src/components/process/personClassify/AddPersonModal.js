/*
 * @Description: 添加人员
 * @Author: moran 
 * @Date: 2019-09-11 15:59:59 
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-12 16:05:41
 */

import React from 'react';
import { connect } from 'dva';
import 'styles/components/process/personClassify/addPersonModal.less';
const { Modal, Cascader, Form, Transfer, Spin, message, Tooltip } = window.antd;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

class AddPersonModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetKeys: [], // 已选key
      selectIds: [] // 标签默认id
    };
  }

  componentDidUpdate(prevProps) {
    // 设置默认标签id
    if (this.props.addPersonConfig.groupId !== prevProps.addPersonConfig.groupId) {
      const { groupId } = this.props.addPersonConfig;
      this.setState({
        selectIds: groupId
      });
    }

    // 设置默认已选择人员
    if (this.props.addPersonConfig.userList !== prevProps.addPersonConfig.userList) {
      const { userList } = this.props.addPersonConfig;
      const targetKeys = userList.map(i => {
        return i.userId;
      });
      this.setState({
        targetKeys
      });
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'userGroupManage/getDepartMentTrees',
      payload: '',
    });
  }

  // 添加人员
  handleAddPerson = () => {
    const { targetKeys, selectIds } = this.state;
    const groupId = selectIds[selectIds.length - 1];
    if(!targetKeys.length) { // 没有人员
      message.error('请选择人员');
    } else if (targetKeys.length && targetKeys.length > 200) { // 大于200提示
      message.error('组内人员数量200');
    } else {
      this.props.addPerson({ userIds: targetKeys, groupId });
    }
  }

  // 选择标签
  handleChangeLabel = (e) => {
    const groupInfoId = e[e.length - 1];
    this.setState({
      selectIds: e
    });
    this.props.dispatch({
      type: 'userGroupManage/getUserGroupInfoLink',
      payload: { groupInfoId }
    });
  }

  // 过滤人员
  filterOption = (inputValue, option) => option.nickName.indexOf(inputValue) > -1;

  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };


  render() {
    const {visible, hide, groupInfoList, personLists, loading } = this.props;
    const { selectIds, targetKeys } = this.state;

    // 穿梭框数据加载loading
    const userLoading = loading.effects['userGroupManage/getAllEnabledUserBaseInfo'] || loading.effects['userGroupManage/getUserGroupInfoLink'];

    // 自定义 options 中 label name children 的字段
    const fieldNames = {
      label: 'name',
      value: 'id',
      children: 'groupInfoList'
    };

    // 穿梭框单位
    const locale = {
      itemUnit: '项',
      itemsUnit: '项'
    };

    const selectPerson = (
      <Tooltip
        placement="topLeft"
        title='最多选取200人'>
          选择人员
      </Tooltip>
    );

    return (
      <Modal
          title="添加人员"
          width="650px"
          visible={visible}
          onOk={this.handleAddPerson}
          onCancel={hide}
          okText="确认"
          cancelText="取消"
        >
          <Form {...formItemLayout}>
            <FormItem label="选择标签" colon={true} {...formItemLayout}>
              <Cascader
                options={groupInfoList}
                fieldNames={fieldNames}
                changeOnSelect
                onChange={this.handleChangeLabel}
                placeholder='请选择标签'
                value={selectIds}
                allowClear={false}
              />
            </FormItem>
            <FormItem label={selectPerson} colon={true} {...formItemLayout}>
              {/* 选择人员： */}
              <Spin spinning={userLoading}>
                <Transfer
                  listStyle={{
                    width: 200,
                    height: 300,
                  }}
                  dataSource={personLists}
                  locale={locale}
                  titles={['全部人员', '已选']}
                  showSearch
                  filterOption={this.filterOption}
                  targetKeys={targetKeys}
                  onChange={this.handleChange}
                  render={item => item.nickName}
                  rowKey={record => record.userId}
                />
              </Spin>
            </FormItem>
            
        </Form>
      </Modal>
    );
  }
}

AddPersonModal.propTypes = {
  addPersonConfig: PropTypes.object // 数据源 { groupId, userList }
};

AddPersonModal.defaultProps = {
  addPersonConfig: {}
};

export default connect (({ userGroupManage, loading }) => ({ ...userGroupManage, loading }))(AddPersonModal);