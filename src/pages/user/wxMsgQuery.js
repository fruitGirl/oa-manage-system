/*
 * @Description: 系统-微信审批
 * @Author: qianqian
 * @Date: 2019-02-18 16:06:29
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-03-01 14:38:14
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import 'styles/user/wxMsgQuery.less';
const { Form, Input, Select, DatePicker, Button, Table, LocaleProvider, zh_CN } = window.antd;
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
//       actionType: Random.cword(4, 8),
//       wxPlatId: Random.integer(100, 5000),
//       userId: Random.integer(100, 5000),
//       msgType: Random.cword(4, 8),
//       eventType: Random.cword(4, 8),
//       createTime: Random.date('yyyy-mm-dd'),
//       modifyTime: Random.date('yyyy-mm-dd'),
//       msgCreateTime: Random.date('yyyy-mm-dd'),
//       textContent: Random.cword(8, 20),
//       maincontent: Random.cword(8, 20),
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
    width: '5%',
    className: 'table-center'
  },
  {
    title: '动作类型',
    dataIndex: 'action',
    width: '7%',
    className: 'table-center'
  },
  {
    title: '微信平台ID',
    dataIndex: 'appConfigId',
    width: '7%',
    className: 'table-center'
  },
  {
    title: '用户ID',
    dataIndex: 'userOpenId',
    width: '10%',
    className: 'table-center'
  },
  {
    title: '消息类型',
    dataIndex: 'messageType',
    width: '7%',
    className: 'table-center'
  },
  {
    title: '事件类型',
    dataIndex: 'eventType',
    width: '10%',
    className: 'table-center'
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
    width: '12%',
    className: 'table-center'
  },
  {
    title: '修改时间',
    dataIndex: 'gmtModified',
    width: '12%',
    className: 'table-center'
  },
  {
    title: '消息创建时间',
    dataIndex: 'gmtMessageCreate',
    width: '12%',
    className: 'table-center'
  },
  {
    title: '文本内容',
    dataIndex: 'content',
    width: '11%',
    className: 'table-center'
  },
  {
    title: '内容',
    dataIndex: 'payloadText',
    width: '6%',
    className: 'table-center',
    render: () => <Button type="default">查看内容</Button>
  }
];
class WxMsgQuery extends React.Component {
  constructor() {
    super();
    this.state = {
      showTableData: false,
      queryList: []
    };
  }
  getOptionHTML(id) {
    const actionTypeOptionsHtml = document.getElementById(id).innerHTML;
    return actionTypeOptionsHtml
      .split('\n')
      .filter((item) => {
        item = item.replace(/\s/, '');
        return !!item;
      })
      .map((item, index) => {
        item.match(/<option value="([\w\W]+)">([\w\W]+)<\/option>/);
        return (
          <Option value={RegExp.$1} key={index}>
            {RegExp.$2}
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
        id: fieldsValue['id'] || '',
        appConfigId: fieldsValue['appConfigId'] || 0,
        messageType: fieldsValue['messageType'] || '',
        action: fieldsValue['action'] || '',
        minGmtCreate: gmtCreate.length ? gmtCreate[0].format('YYYY-MM-DD HH:mm:ss') : '',
        maxGmtCreate: gmtCreate.length ? gmtCreate[1].format('YYYY-MM-DD HH:mm:ss') : '',
        currentPage
      };
      T.get(this.props.url || '/user/wxMsgQuery.json', params)
        .then((data) => {
          let finalList = [];
          let resultList = data.baseMessageQueryResult.list;
          let contentMap = data.textMsgMap;
          resultList.forEach((item) => {
            finalList.push({
              id: item.id,
              action: item.action.message,
              appConfigId: item.appConfigId,
              userOpenId: item.userOpenId,
              messageType: item.messageType.message,
              eventType: '',
              gmtCreate: item.gmtCreate,
              gmtModified: item.gmtModified,
              gmtMessageCreate: item.gmtMessageCreate,
              payloadText: item.payloadText,
              content: contentMap[item.id] ? contentMap[item.id].content : ''
            });
          });
          this.setState({
            queryList: finalList,
            showTableData: true
          });
          this.querySuccess(data);
        })
        .catch((err) => {
          T.showError(err);
        });
    });
  }
  querySuccess(data) {
    const result = data['baseMessageQueryResult'];
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
    // 消息类型
    const msgTypeOptionsHtml = this.getOptionHTML('msgTypeOptions');
    // 动作类型
    const actionTypeOptionsHtml = this.getOptionHTML('actionTypeOptions');
    // 表格表头
    const columns = tableHeader;
    const { getFieldDecorator } = this.props.form;
    const { pagination, loading } = this.state;

    return (
      <LocaleProvider locale={zh_CN}>
        <BasicLayout>
          <Form layout="inline" className="form-inline antd_form_horizontal main-content" style={{ top: '72px' }}>
            <div className="form-row">
              <FormItem label="消息ID" colon={false} key="msgId">
                {getFieldDecorator('id')(<Input />)}
              </FormItem>
              <FormItem label="应用配置ID" colon={false} key="appConfigId">
                {getFieldDecorator('appConfigId')(<Input />)}
              </FormItem>
              <FormItem label="消息类型" colon={false} key="messageType">
                {getFieldDecorator('messageType')(
                  <Select className="input_width">
                    <Option value="">全部</Option>
                    {msgTypeOptionsHtml}
                  </Select>
                )}
              </FormItem>
              <FormItem label="动作类型" colon={false} key="action">
                {getFieldDecorator('action')(
                  <Select className="input_width">
                    <Option value="">全部</Option>
                    {actionTypeOptionsHtml}
                  </Select>
                )}
              </FormItem>
            </div>
            <div className="form-row">
              <FormItem label="创建时间" key="gmtCreate" colon={false}>
                {getFieldDecorator('gmtCreate')(<RangePicker {...T.rangerTimeConfig} />)}
              </FormItem>
            </div>
            <div className="form-btn-group">
              <Button
                type="primary"
                className="oa-btn"
                htmlType="submit"
                loading={loading}
                onClick={this.showQueryResult.bind(this)}
              >
                查询
              </Button>
            </div>
          </Form>
          {this.state.showTableData && (
            <div className="bg-white" style={{ top: '160px' }}>
              <Table
                columns={columns}
                dataSource={this.state.queryList}
                rowKey="id"
                expandedRowRender={(record) => <p style={{ margin: 0 }}>{record.payloadText}</p>}
                expandRowByClick={true}
                loading={loading}
                pagination={pagination}
                onChange={this.handlePageSubmit}
              />
            </div>
          )}
        </BasicLayout>
      </LocaleProvider>
    );
  }
}
const WxMsgQueryForm = Form.create()(WxMsgQuery);
ReactDOM.render(<WxMsgQueryForm />, document.getElementById('root'));
// define('page/user/wxMsgQuery', ['tools', 'datepicker', 'paginator'], function(
//   require,
//   exports,
//   module
// ) {
//   require('datepicker');
//   require('paginator');
//   var Tools = require('tools');
//   var Klass = {
//     init: function(options) {
//       $(document).ready(function() {
//         //日期插件
//         Klass.initDataTimePicker($('#minGmtCreate'), $('#maxGmtCreate'));

//         //点击出来微信内容信息
//         Klass.showWxMsgQuery();
//         Klass.initForm(); //判断消息ID不能为空且只能为整数
//         if (options.hasPages) {
//           Klass.initPager(options); //分页
//         }

//         Klass.tableBackground(); //奇数行让表格不同的颜色
//       });

//     },
//     initForm: function() {
//       var form = $('#wxMsgQuery_form');
//       form.on('submit', function(e) {
//         var msgId = $.trim(form.find('input[name="id"]').val()),
//           appConfigId = $.trim(form.find('input[name="appConfigId"]').val());

//         if (!msgId) {
//           e.preventDefault();

//           Tools.util.alertErrorMsg('消息ID不能为空');
//           return;
//         }
//         if (!appConfigId) {
//           e.preventDefault();

//           Tools.util.alertErrorMsg('应用配置ID不能为空');
//           return;
//         }

//         if (!/^[0-9]*$/.test(msgId)) {
//           e.preventDefault();
//           Tools.util.alertErrorMsg('请输入整数');
//         }
//         if (!/^[0-9]*$/.test(appConfigId)) {
//           e.preventDefault();
//           Tools.util.alertErrorMsg('请输入整数');
//         }
//       });
//     },
//     //点击查看微信显示日志信息
//     showWxMsgQuery: function() {
//       $('#wxMsgQuery_table').on(
//         'click',
//         'button[data-role="showContent"]',
//         function() {
//           var _this = $(this),
//             _trPeration = _this.closest('tr').next('tr[data-show="weiXinMsg"]');

//           if (_trPeration.hasClass('hide')) {
//             _trPeration
//               .removeClass('hide')
//               .siblings('tr[data-show="weiXinMsg"]')
//               .addClass('hide');
//           } else {
//             _trPeration.addClass('hide');
//           }
//         }
//       );
//     },
//     //日期插件
//     initDataTimePicker: function(startDate, endDate) {
//       startDate
//         .datetimepicker({
//           format: 'yyyy-mm-dd hh:ii:ss',
//           // minView: 4,
//           minuteStep: 1,
//           autoclose: true,
//           endDate: new Date(new Date() - CONFIG['timeDiff'])
//         })
//         .on('changeDate', function(ev) {
//           endDate.datetimepicker('setStartDate', this.value);
//         });
//       // .on('focus', function() {
//       // 	startDate.datetimepicker('setEndDate', new Date((new Date()) - CONFIG['timeDiff']));
//       // });

//       endDate
//         .datetimepicker({
//           format: 'yyyy-mm-dd hh:ii:ss',
//           // minView: 4,
//           minuteStep: 1,
//           autoclose: true,
//           endDate: new Date(new Date() - CONFIG['timeDiff'])
//         })
//         .on('changeDate', function(ev) {
//           startDate.datetimepicker('setEndDate', this.value);
//         })
//         .on('focus', function() {
//           endDate.datetimepicker(
//             'setEndDate',
//             new Date(new Date() - CONFIG['timeDiff'])
//           );
//         });
//     },
//     //分页
//     initPager: function(options) {
//       $('#page_nav').bootstrapPaginator({
//         currentPage: options.page,
//         totalPages: options.pages,
//         onPageClicked: function(event, originalEvent, type, page) {
//           var form = $('#wxMsgQuery_form');

//           if (page === options.page) {
//             return;
//           }

//           if (form.find('input[name="currentPage"]').size() === 0) {
//             form.append('<input name="currentPage" type="hidden">');
//           }

//           form.find('input[name="currentPage"]').val(page);

//           form[0].submit();
//         }
//       });
//     },
//     //给表格添加颜色
//     tableBackground: function() {
//       var _table = $('#wxMsgQuery_table'),
//         _tr = _table.find('tbody tr');
//       for (var i = 0; i < _tr.length; i++) {
//         if (i % 4 === 2) {
//           _tr.eq(i).css('background', '#f3f3f3');
//         }
//       }
//     }
//   };

//   module.exports = Klass;
// });
