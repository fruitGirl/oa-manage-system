/*
 * @Description: 系统-操作日志查询
 * @Author: qianqian
 * @Date: 2019-02-18 15:55:12
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-03-05 13:48:43
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import 'styles/user/operationLogQuery.less';
const { Form, Input, Select, DatePicker, Button, Table, Modal, LocaleProvider, zh_CN } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
// mock数据
// import Mock from 'mockjs';
// var Random = Mock.Random;
// var data = Mock.mock({
//   'list|5-30': [
//     {
//       'id|+1': 1,
//       msgId: Random.integer(100, 5000),
//       operatorId: Random.integer(100, 5000),
//       operator: Random.cword(4, 8),
//       actionType: Random.cword(4, 8),
//       operateObjectType: Random.cword(4, 8),
//       operateObjectId: Random.integer(100, 5000),
//       gmtCreate: Random.date('yyyy-mm-dd'),
//       unfoldContent: Random.cword(8, 100)
//     }
//   ]
// });
// 输出结果
// window.queryList = data;
const tableHeader = [
  {
    title: 'id',
    dataIndex: 'id',
    width: '11%',
    className: 'table-center'
  },
  {
    title: '操作人id',
    dataIndex: 'operatorId',
    width: '11%',
    className: 'table-center'
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    width: '11%',
    className: 'table-center'
  },
  {
    title: '动作类型',
    dataIndex: 'actionType',
    width: '15%',
    className: 'table-center'
  },
  {
    title: '操作对象类型',
    dataIndex: 'operateObjectType',
    width: '15%',
    className: 'table-center'
  },
  {
    title: '操作对象id',
    dataIndex: 'operateObjectId',
    width: '11%',
    className: 'table-center'
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
    width: '11%',
    className: 'table-center'
  },
  {
    title: '内容',
    dataIndex: 'content',
    width: '10%',
    className: 'table-center',
    render: () => <Button type="default">查看日志内容</Button>
  }
];
class OperationLogQuery extends React.Component {
  constructor() {
    super();
    this.state = {
      showTableData: false,
      queryList: []
    };
  }
  getOptionHTML(id) {
    // const actionTypeOptionsHtml = document.getElementById(id).innerHTML;
    // return actionTypeOptionsHtml
    //   .split('\n')
    //   .filter((item) => {
    //     item = item.replace(/\s/, '');
    //     return !!item;
    //   })
    //   .map((item, index) => {
    //     item.match(/<option value="([\w\W]+)">([\w\W]+)<\/option>/);
    //     return (
    //       <Option value={RegExp.$1} key={Date.now()}>
    //         {RegExp.$2}
    //       </Option>
    //     );
    //   });

    const list = CONFIG[id];
    return list.map((item, index) => {
      return (
        <Option value={item.id} key={item.id}>
          {item.value}
        </Option>
      );
    });
  }
  showQueryResult(e, currentPage = 1) {
    if (e) {
      e.preventDefault();
    }
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.setState({
        loading: true
      });
      const gmtCreate = fieldsValue['gmtCreate'] || '';
      let params = {
        operatorId: fieldsValue['operatorId'] || 0,
        operator: fieldsValue['operator'] || '',
        content: fieldsValue['content'] || '',
        actionType: fieldsValue['actionType'] || '',
        operateObjectId: fieldsValue['operateObjectId'] || '',
        operateObjectType: fieldsValue['operateObjectType'] || '',
        minGmtCreate: gmtCreate.length ? gmtCreate[0].format('YYYY-MM-DD HH:mm:ss') : '',
        maxGmtCreate: gmtCreate.length ? gmtCreate[1].format('YYYY-MM-DD HH:mm:ss') : '',
        currentPage
      };
      T.get(this.props.url || '/user/operationLogQuery.json', params).then((data) => {
        if (data.success) {
          let finalList = [];
          let resultList = data.pageList.list;
          resultList.forEach((item) => {
            finalList.push({
              id: item.id,
              operatorId: item.operatorId,
              operator: item.operator || '',
              actionType: (item.actionType && item.actionType.message) || '',
              operateObjectType: (item.operateObjectType && item.operateObjectType.message) || '',
              operateObjectId: item.operateObjectId,
              gmtCreate: item.gmtCreate,
              content: item.content
            });
          });
          this.setState({
            queryList: finalList,
            showTableData: true
          });
          this.querySuccess(data);
        } else {
          Modal.error({
            title: '提示',
            content: T.getError(data)
          });
        }
      });
    });
  }
  querySuccess(data) {
    const result = data['pageList'];
    const paginator = result['paginator'];
    this.setState({
      loading: false,
      pagination: {
        ...this.state.pagination,
        total: paginator['items'],
        current: paginator['page'],
        pageSize: paginator['itemsPerPage']
      }
    });
  }
  handlePageSubmit = (pagination) => {
    this.showQueryResult(null, pagination.current);
  };
  render() {
    // 动作类型
    const actionTypeOptionsHtml = this.getOptionHTML('actionTypeOptions');
    // 操作对象类型
    const operateObjectTypeHtml = this.getOptionHTML('operateObjectType');
    // 表格表头
    const columns = tableHeader;
    const { getFieldDecorator } = this.props.form;
    const { pagination, loading, queryList } = this.state;
    return (
      <div>
        <Form layout="inline" className="form-inline antd_form_horizontal main-content" style={{ top: '72px' }}>
          <div className="form-row">
            <FormItem label="操作人ID" colon={false} key="operatorId">
              {getFieldDecorator('operatorId')(<Input />)}
            </FormItem>
            <FormItem label="操作人" colon={false} key="operator">
              {getFieldDecorator('operator')(<Input />)}
            </FormItem>
            <FormItem label="内容" colon={false} key="content">
              {getFieldDecorator('content')(<Input />)}
            </FormItem>
            <FormItem label="动作类型" colon={false} key="actionType">
              {getFieldDecorator('actionType')(
                <Select className="input_width">
                  <Option value="">全部</Option>
                  {actionTypeOptionsHtml}
                </Select>
              )}
            </FormItem>
            <FormItem label="操作对象ID" colon={false} key="operateObjectId">
              {getFieldDecorator('operateObjectId')(<Input />)}
            </FormItem>
            <FormItem label="操作对象类型" colon={false} key="operateObjectType">
              {getFieldDecorator('operateObjectType')(
                <Select className="input_width">
                  <Option value="">全部</Option>
                  {operateObjectTypeHtml}
                </Select>
              )}
            </FormItem>
            <FormItem label="创建时间" key="gmtCreate" colon={false}>
              {getFieldDecorator('gmtCreate')(<RangePicker {...T.rangerTimeConfig} />)}
            </FormItem>
          </div>
          <div className="form-btn-group">
            <Button type="primary" className="oa-btn" onClick={this.showQueryResult.bind(this)} loading={loading}>
              查询
            </Button>
          </div>
        </Form>
        {this.state.showTableData ? (
          <div className="bg-white" style={{ top: '160px' }}>
            <Table
              columns={columns}
              dataSource={queryList}
              rowKey="id"
              expandedRowRender={(record) => <p style={{ margin: 0 }}>{record.content}</p>}
              expandRowByClick={true}
              loading={loading}
              pagination={{
                ...pagination,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`
              }}
              onChange={this.handlePageSubmit}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
const OperationLogQueryForm = Form.create()(OperationLogQuery);
ReactDOM.render(
  <LocaleProvider locale={zh_CN}>
    <BasicLayout>
      <OperationLogQueryForm />
    </BasicLayout>
  </LocaleProvider>,
  document.getElementById('root')
);
