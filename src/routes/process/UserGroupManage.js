/*
 * @Description: 人员分类页面
 * @Author: moran
 * @Date: 2019-09-09 10:38:14
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-15 17:27:27
 */
import React from 'react';
import PersonClassifyTree from 'components/process/personClassify/PersonClassifyTree';
import PersonList from 'components/process/personClassify/PersonList';
import BasicLayout from 'layouts/BasicLayout';
import 'styles/process/personClassify.less';
import { connect } from 'dva';

class PersonClassify extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchObj: { // 查询条件
        currentPage: 1
      },
      isRemove: false, // 是否可以批量移除
      groupIdArr: []
    };
  }
  getLists = (payload) => {
    this.props.dispatch({
      type: 'userGroupManage/getUserGroupInfoList',
      payload
    });
  }

  // 人员分类树搜索
  handleSearch = (val, groupIdArr) => {
    const { groupId, isRemove } = val;
    this.setState({
      searchObj: { ...this.state.searchObj, groupInfoId: groupId[0] },
      isRemove,
      groupIdArr
    }, ()=> {
      this.getLists({ ...this.state.searchObj, currentPage: 1 });
    });
  }

  // 查询
  handleSearchQuery = (values) => {
    this.setState({
      searchObj: { ...this.state.searchObj, ...values }
    }, ()=> {
      this.getLists(this.state.searchObj);
    });
  }

  // 批量移除
  handleBatchRemovePerson = (userIds) => {
    const { searchObj } = this.state;
    const { groupInfoId } = searchObj;
    this.props.dispatch({
      type: 'userGroupManage/removeUserGroup',
      payload: {
        userIds,
        groupId: groupInfoId,
        searchObj
      }
    });
  }

  handleAddPerson = (info) => {
    const { searchObj } = this.state;
    this.props.dispatch({
      type: 'userGroupManage/addUserInfo',
      payload: { ...info, searchObj }
    });
  }

  render() {
    const { userGroupInfoList, paginator } = this.props;
    const { isRemove, groupIdArr, searchObj } = this.state;
    const { groupInfoId } = searchObj;
    return (
      <BasicLayout>
        <div className="person-classify-container">
          <div className="person-classify-left">
            <PersonClassifyTree
              select={this.handleSearch}
              treeConfigs={{groupInfoId}}/>
          </div>
          <div className="person-classify-right">
            <PersonList
              add={this.handleAddPerson}
              search={this.handleSearchQuery}
              remove={this.handleBatchRemovePerson}
              personConfig={{ userGroupInfoList, paginator, isRemove, groupIdArr }}/>
          </div>
        </div>
      </BasicLayout>
    );
  }
}

export default connect(({ userGroupManage }) => ({ ...userGroupManage }))(PersonClassify);
