/*
 * @Description: 绩效管理页面
 * @Author: moran
 * @Date: 2019-08-06 14:45:08
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-13 15:39:07
 */
import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import EditPerformanceModal from 'components/performance/performanceManage/EditPerformanceModal';
import 'styles/performance/performanceManage.less';
import { columns } from 'constants/performance/performanceManage';
const { Button, Table, Modal } = window.antd;

class PerformanceManage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: false, // 考核年度、考核类型禁用
      isEdit: false // 考核名称禁用
    };
  }

  componentDidMount() {
    this.getList();
  }

  getList = (currentPage) => {
    this.props.dispatch({
      type: 'performanceManage/getPerformancePlanLists',
      payload: { currentPage: currentPage || 1, }
    });
  }

  // 分页跳转
  changePage = ({ current }) => {
    this.getList(current);
  }

  // 开启绩效
  handleOpenPerformance = () => {
    this.setState({
      isDisabled: false,
      isEdit: false
    });
    this.props.dispatch({
      type: 'performanceManage/displayModal',
      payload: true
    });
  }

  // 编辑
  editPerformance = (payload) => {
    this.setState({
      isDisabled: true,
      isEdit: false
    });
    this.props.dispatch({
      type: 'performanceManage/getPerformancePlanInfos',
      payload: payload
    });
  }

  // 创建绩效/编辑绩效
  handleSumbit = (values, id) => {
    this.props.dispatch({
      type: 'performanceManage/savePerformancePlan',
      payload: { ...values, id }
    });
  }

  // 开启
  handleOpen = (id) => {
    Modal.confirm({
      title: '确认开启绩效？',
      content: '',
      cancelButtonProps: {
        size: 'small'
      },
      okButtonProps: {
        size: 'small'
      },
      onOk: () => {
        this.props.dispatch({
          type: 'performanceManage/openPerformancePlan',
          payload: id
        });
      }
    });
  }

  // 考核范围点击 显示开启绩效弹框
  handleShowPerformance = (payload) => {
    this.setState({
      isDisabled: true,
      isEdit: true
    });
    this.props.dispatch({
      type: 'performanceManage/getPerformancePlanInfos',
      payload: payload
    });
  }

  render() {
    const {
      performancePlanLists, // 绩效管理列表数据
      paginator,
      performancePlanInfos, // 回填绩效数据
      loading
    } = this.props;
    const { isDisabled, isEdit } = this.state;
    const { itemsPerPage = 0, items = 0, page = 1 } = paginator;
    const pagination = {
      current: page,
      total: items,
      pageSize: itemsPerPage,
      showQuickJumper: true,
      showTotal: () => `共 ${items} 条`
    };

    const tableLoading = loading.effects['performanceManage/getPerformancePlanLists'] || false;

    return (
      <BasicLayout>
        <div>
          <Button type="primary" onClick={this.handleOpenPerformance} className="open-performance-btn">开启绩效</Button>
          <Table
            loading={tableLoading}
            dataSource={performancePlanLists}
            rowKey={(r) => r.id}
            columns={columns({
              editPerformance: this.editPerformance,
              open: this.handleOpen,
              showPerformance: this.handleShowPerformance
            })}
            onChange={this.changePage}
            pagination={pagination}>
          </Table>
          <EditPerformanceModal
            submit={this.handleSumbit}
            disabled={isDisabled}
            isEdit={isEdit}
            editInfos={performancePlanInfos}
           />
        </div>
      </BasicLayout>
    );
  }
}

export default connect(({ performanceManage, loading }) => ({ ...performanceManage, loading }))(PerformanceManage);
