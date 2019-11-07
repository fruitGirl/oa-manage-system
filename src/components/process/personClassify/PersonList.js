/*
 * @Description: 人员分类查询页面
 * @Author: moran 
 * @Date: 2019-09-09 10:38:32 
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-12 10:33:29
 */
import { connect } from 'dva';
import React from 'react';
import AddPersonModal from 'components/process/personClassify/AddPersonModal';
import SearchBar from './SearchBar';
import { PERSON_COLOUMN } from 'constants/process/personList';
import 'styles/components/process/personClassify/personList.less';
const { Table, Button, Modal } = window.antd;

class PersonList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [], // 选中的数据key值
      dataValues: {} // 查询数据
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.personConfig !== prevProps.personConfig) {
      // 点击分类渲染清空选中的key
      this.setState({
        selectedRowKeys: []
      });
    }
  }
  
  // 选择人员
  handleSelectChange = (selectedRowKeys ) => {
    this.setState({ selectedRowKeys });
  }

  // 按钮点击添加人员
  handleAddPerson = () => {
    const { groupIdArr } = this.props.personConfig;
    const groupInfoId = groupIdArr[groupIdArr.length - 1];
    this.props.dispatch({
      type: 'userGroupManage/displayAddPersonModal',
      payload: true
    });
    this.props.dispatch({
      type: 'userGroupManage/getAllEnabledUserBaseInfo',
      payload: ''
    });
    this.props.dispatch({
      type: 'userGroupManage/getUserGroupInfoLink',
      payload: { groupInfoId }
    });
  }
  
  // 关闭添加人员弹框
  handleHide = () => {
    this.props.dispatch({
      type: 'userGroupManage/displayAddPersonModal',
      payload: false
    });
  }

  // 查询
  handleSearch = (values) => {
    this.setState({
      dataValues: { ...this.state.dataValues, ...values }
    });
    this.props.search({ ...values, currentPage: 1 });
  }

   // 分页跳转
  changePage = ({ current }) => {
    const { dataValues } = this.state;
    this.setState({
      dataValues: { ...dataValues, currentPage: current || 1 }
    }, () => {
      this.props.search(this.state.dataValues);
    });
  }

  // 批量移除
  handleBatchRemove = () => {
    const self = this;
    Modal.confirm({
      title: '提示',
      content: '确定移除人员？',
      onOk() {
        // 调取批量移除接口
        self.props.remove(self.state.selectedRowKeys);
      },
    });
  }

  // 添加人员确定
  handleAddLabelPerson = (info) => {
    this.props.add(info);
  }

  render() {
    const {
      personConfig,
      showAddPersonModal,
      userList
    } = this.props;
    const {
      userGroupInfoList,
      paginator,
      isRemove,
      groupIdArr
    } = personConfig;
    const {
      items,
      itemsPerPage,
      page
    } = paginator;
    const { selectedRowKeys } = this.state;
    
    // 选择属性 默认层级没有勾选
    const rowSelection = isRemove ? {
      selectedRowKeys,
      onChange: this.handleSelectChange,
    } : null;
    
    // 是否选择人员
    const hasSelected = selectedRowKeys.length > 0;
    const pagination = {
      current: page,
      total: items,
      pageSize: itemsPerPage,
      showQuickJumper: true,
      showTotal: () => `共 ${items} 条`
    };

    return (
      <div className="person-list-box">
        <div className="search-box">
          <SearchBar onSearch={this.handleSearch}/>
        </div>
        <div className="main-box">
          <div className="btn-box">
            <Button
              type="primary"
              onClick={this.handleAddPerson}
              disabled={!isRemove}>
              +添加人员
            </Button>
            <Button
              className="btn-distance"
              disabled={!(hasSelected && isRemove)}
              onClick={this.handleBatchRemove}>
              批量移除
            </Button>
          </div>
        
          <Table
            rowSelection={rowSelection}
            columns={PERSON_COLOUMN}
            dataSource={userGroupInfoList}
            rowKey="userId"
            pagination={pagination}
            onChange={this.changePage}
          />
        </div>
        <AddPersonModal
          visible={showAddPersonModal}
          hide={this.handleHide}
          addPersonConfig={{ groupId: groupIdArr, userList }}
          addPerson={this.handleAddLabelPerson}/>
      </div>
    );
  }
}

PersonList.propTypes = {
  // 人员查询数据源 { userGroupInfoList(table list), paginator, isRemove(是否允许批量移除), groupIdArr（人员树id） }
  personConfig: PropTypes.object 
};

PersonList.defaultProps = {
  personConfig: {}
};

export default connect(({ userGroupManage }) => ({ ...userGroupManage }))(PersonList);
