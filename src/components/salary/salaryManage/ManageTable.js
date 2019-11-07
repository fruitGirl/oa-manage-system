import { PureComponent } from 'react';
import { connect } from 'dva';
import Separate from 'components/common/Separate';
import { createColumns } from 'constants/salary/salaryManage';
import qs from 'qs';

const { Button, Table } = window.antd;

class ManageTable extends PureComponent {
  constructor(props) {
    super(props);
    const { title, salaryBaseInfoId } = qs.parse(
      window.location.search,
      { ignoreQueryPrefix: true }
    );
    this.title = decodeURIComponent(window.atob(title));
    this.salaryBaseInfoId = salaryBaseInfoId;
    this.state = {
      hoverIdx: '', // 鼠标移动行索引值
    };
  }

  componentDidMount() {
    this.queryList(this.salaryBaseInfoId);
  }

  queryList(id, currentPage = 1) {
    id && this.props.dispatch({
      type: 'salaryManage/queryList',
      payload: {
        salaryBaseInfoId: id,
        currentPage,
      }
    });
  }

  // 发放工资
  sendSalary = (payload) => {
    this.props.dispatch({
      type: 'salaryManage/sendSalary',
      payload: { ids: payload }
    });
  }

  // 发送全部
  sendAll = () => {
    const { salaryBaseInfoId } = this;
    salaryBaseInfoId && this.props.dispatch({
      type: 'salaryManage/sendAllSalary',
      payload: { salaryBaseInfoId }
    });
  }

  // 撤回
  withdrawSalary = (payload) => {
    this.props.dispatch({
      type: 'salaryManage/withdrawSalary',
      payload: { id: payload }
    });
  }

  // 请求用户工资
  queryUserSalary = (payload) => {
    this.props.dispatch({
      type: 'salaryManage/queryUserSalary',
      payload: { id: payload }
    });
  }

  changePage = (pagination) => {
    this.queryList(this.salaryBaseInfoId, pagination.current);
  }

  render() {
    const { sendSalary, withdrawSalary, queryUserSalary, title } = this;
    const { list, loading, paginator } = this.props;
    const { hoverIdx } = this.state;
    const tableLoading = loading.effects['salaryManage/queryList']
      || loading.effects['salaryManage/sendSalary']
      || loading.effects['salaryManage/withdrawSalary']
      || loading.effects['salaryManage/sendAllSalary'];
    const { itemsPerPage = 0, items = 0, page = 1 } = paginator;
    const pagination = {
      current: page,
      total: items,
      pageSize: itemsPerPage,
      showQuickJumper: true,
      showTotal: () => `共 ${items} 条`
    };

    return (
      <div>
        <h5 className="title">工资条发放</h5>
        <Separate />
        <div className="clearfix">
          <h6 className="pull-left">{title}</h6>
          <Button
            className="pull-right"
            type="primary"
            disabled={!list.length}
            onClick={this.sendAll}
          >全部发送</Button>
        </div>
        <Separate size={15}/>
        <Table
          columns={createColumns({
            sendSalary,
            withdrawSalary,
            queryUserSalary,
            hoverIdx
          })}
          dataSource={list}
          pagination={pagination}
          rowKey={r => r.userId}
          loading={tableLoading}
          onChange={this.changePage}
          onRow={(record, index) => {
            return {
              onMouseEnter: (event) => {
                this.setState({
                  hoverIdx: index
                });
              },  // 鼠标移入行
              onMouseLeave: () => {
                this.setState({
                  hoverIdx: ''
                });
              }
            };
          }}
        />
      </div>
    );
  }
}

export default connect(({ salaryManage, loading, }) => ({ ...salaryManage, loading }))(ManageTable);
