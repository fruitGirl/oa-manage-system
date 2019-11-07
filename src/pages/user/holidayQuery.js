/*
 * @Description: 人事管理-假期管理页面
 * @Author: qianqian
 * @Date: 2019-02-11 17:47:53
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 17:55:01
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import 'styles/user/holidayQuery.less';

const { Form, Input, DatePicker, Button, Table, Select, message, Modal, LocaleProvider, zh_CN } = window.antd;

const FormItem = Form.Item;
const Option = Select.Option;

const HolidayModifyModal = Form.create()((props) => {
  const { currentItem, modalVisible, handleModalCancel, handleModalOk, form, title, okText } = props;
  const availableTimeOffHour = currentItem.availableTimeOffHour;
  const day = Math.floor(availableTimeOffHour / 8);
  const hour = availableTimeOffHour - day * 8;
  const { getFieldDecorator } = form;
  return (
    <Modal
      visible={modalVisible}
      title={title}
      okText={okText}
      onCancel={handleModalCancel}
      onOk={handleModalOk}
      width={400}
    >
      <Form className="form-inline" layout="inline" style={{ padding: 0, marginBottom: 0 }}>
        {getFieldDecorator('id', {
          initialValue: currentItem.id
        })(<input type="hidden" />)}
        <div className="text-center form-row">
          剩余调休时长
          <FormItem className="v_middle" style={{ margin: 0 }} key="day">
            {getFieldDecorator('day', {
              initialValue: day,
              rules: [
                {
                  pattern: new RegExp(/^[0-9]*$/),
                  message: '只能输入非负自然数'
                }
              ]
            })(<Input style={{ width: '50px', margin: '0 10px' }} />)}
          </FormItem>
          天
          <FormItem className="v_middle" style={{ margin: 0 }} key="hour">
            {getFieldDecorator('hour', {
              initialValue: hour,
              rules: [
                {
                  pattern: new RegExp(/^[0-8]?$/),
                  message: '只能输入0到8的整数'
                }
              ]
            })(<Input style={{ width: '50px', margin: '0 10px' }} />)}
          </FormItem>
          时
        </div>
      </Form>
    </Modal>
  );
});

class HolidayForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false, // 表格是否加载数据
      modalVisible: false, // 控制模态框的显示
      tableDataLists: [], // 表格数据
      currentItem: {}, //当前编辑的项,
      pagination: {
        current: 1,
        total: null,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`
      }, // 分页
      isShowTableData: false
    };
  }

  // 取消
  handleModalCancel = () => {
    this.setState({
      modalVisible: false
    });
  };

  // 创建，修改
  handleModalOk = () => {
    const modalForm = this.modalForm;
    modalForm.validateFields((err, values) => {
      if (err) {
        return;
      }

      modalForm.resetFields();
      this.setState({
        modalVisible: false,
        loading: true
      });
      this.modifyHoliday(values);
    });
  };

  // 请求修改接口
  modifyHoliday = (values) => {
    const url = `${T['userPath']}/userTimeOffModifyAvailableTimeOffById.json`;
    const params = {
      id: values['id'],
      day: values['day'] ? values['day'] : 0,
      hour: values['hour'] ? values['hour'] : 0
    };
    T.post(url, params)
      .then((data) => {
        if (data['success']) {
          message.success('修改成功');
          setTimeout(() => {
            this.handleSubmit(null);
          }, 1000);
        } else {
          T.showError(data);
        }
      })
      .catch(function(err) {
        T.showError(err);
      });
    this.setState({ loading: false });
  };

  // 表单提交
  handleSubmit = (e, currentPage = 1) => {
    if (e) {
      e.preventDefault();
    }
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const url = `${T['userPath']}/userTimeOffPageQueryByDateAndUserIds.json`;
      const nickName = fieldsValue['nickName'] ? fieldsValue['nickName'] : '';
      const departmentId = fieldsValue['departmentId'] ? fieldsValue['departmentId'] : '';
      const date = fieldsValue['date'] ? fieldsValue['date'].format('YYYY-MM-DD HH:mm:ss') : '';

      const params = {
        nickName: nickName,
        departmentId,
        date,
        currentPage
      };

      this.setState({
        loading: true,
        isShowTableData: true
      });

      // 查询
      T.get(url, params)
        .then((data) => {
          this.querySuccess(data);
        })
        .catch((data) => {
          this.setState({ loading: false });
          T.showError(data);
        });
    });
  };

  hourToDay = (hour) => {
    let day = Math.floor(hour / 8);
    let remainHour = hour - day * 8;
    return `${day}天${remainHour}时`;
  };

  // 查询成功后的操作, 更新分页数据，表格数据
  querySuccess = (data) => {
    const pageList = data['pageList'];
    const list = pageList['list'];
    const l = list.length;
    const userIdAndUserMap = data['userIdAndUserMap'];
    const deptIdAndDeptNameMap = data['deptIdAndDeptNameMap'];

    if (l > 0) {
      let dataArr = [];
      for (let i = 0; i < l; i++) {
        let item = list[i];
        let alreadyTimeOffHour = item['alreadyTimeOff'];
        let alreadyTimeOff = alreadyTimeOffHour < 8 ? `${alreadyTimeOffHour}时` : this.hourToDay(alreadyTimeOffHour);
        let availableTimeOffHour = item['availableTimeOff'];
        let availableTimeOff =
          availableTimeOffHour < 8 ? `${availableTimeOffHour}时` : this.hourToDay(availableTimeOffHour);
        let totalOvertime = item['totalOvertimeHours'];
        let totalOvertimeHours = totalOvertime < 8 ? `${totalOvertime}时` : this.hourToDay(totalOvertime);
        let totalVacation = item['totalVacationHours'];
        let totalVacationHours = totalVacation < 8 ? `${totalVacation}时` : this.hourToDay(totalVacation);
        let userInfo = userIdAndUserMap[item['userId']];
        let departmentId = userInfo ? userInfo['departmentId'] : '';
        let nickName = userInfo ? userInfo['nickName'] : '-';
        dataArr.push({
          key: i,
          id: item['id'],
          nickName: nickName,
          alreadyTimeOff,
          availableTimeOff,
          availableTimeOffHour,
          totalOvertimeHours,
          totalVacationHours,
          gmtModified: item['gmtModified'],
          departmentName: deptIdAndDeptNameMap[departmentId] || '-'
        });
      }
      const paginator = pageList['paginator'];
      this.setState({
        tableDataLists: dataArr,
        pagination: {
          ...this.state.pagination,
          total: paginator['items'],
          current: paginator['page'],
          pageSize: paginator['itemsPerPage']
        }
      });
    } else {
      const paginator = pageList['paginator'];
      this.setState({
        tableDataLists: [],
        pagination: {
          ...this.state.pagination,
          total: paginator['items'],
          current: paginator['page'],
          pageSize: paginator['itemsPerPage']
        }
      });
    }
    this.setState({ loading: false });
  };

  showModifyModal = (record, index) => {
    this.modifyIndex = index;
    this.setState({
      modalVisible: true,
      currentItem: record
    });
  };

  //把弹框中的form传出来
  saveModalFormRef = (form) => {
    this.modalForm = form;
  };

  handlePageSubmit = (pagination, filters, sorter) => {
    this.handleSubmit(null, pagination.current);
  };

  render() {
    const { modalVisible, tableDataLists, currentItem, loading, isShowTableData } = this.state;

    const modalConfig = {
      handleModalOk: this.handleModalOk,
      handleModalCancel: this.handleModalCancel,
      title: '修改',
      okText: '修改',
      modalVisible,
      currentItem
    };

    const { getFieldDecorator } = this.props.form;
    const handleClickModify = (record, index, e) => {
      e.preventDefault();
      this.showModifyModal(record, index);
    };
    const columns = [
      {
        title: '员工',
        dataIndex: 'nickName',
        key: 'nickName',
        width: '15%',
        className: 'text-center'
      },
      {
        title: '部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
        width: '10%',
        className: 'text-center'
      },
      {
        title: '总请假时长',
        dataIndex: 'totalVacationHours',
        key: 'totalVacationHours',
        width: '10%',
        className: 'text-center'
      },
      {
        title: '已调休时长',
        dataIndex: 'alreadyTimeOff',
        key: 'alreadyTimeOff',
        width: '10%',
        className: 'text-center'
      },
      {
        title: '总加班时长',
        dataIndex: 'totalOvertimeHours',
        key: 'totalOvertimeHours',
        width: '15%',
        className: 'text-center'
      },
      {
        title: '剩余调休时长',
        dataIndex: 'availableTimeOff',
        key: 'availableTimeOff',
        width: '10%',
        className: 'text-center'
      },
      {
        title: '修改时间',
        dataIndex: 'gmtModified',
        key: 'gmtModified',
        width: '20%',
        className: 'text-center'
      },
      {
        title: CONFIG.hasAuthority ? '操作' : '',
        dataIndex: 'operation',
        key: 'operation',
        width: '15%',
        className: 'text-center',
        render: (text, record, index) => {
          return (
            <div>
              {CONFIG.hasAuthority ? (
                <a href="javascript:;" onClick={(e) => handleClickModify(record, index, e)}>
                  修改
                </a>
              ) : (
                ''
              )}
            </div>
          );
        }
      }
    ];

    // 得到部门select下的option
    const getDepartmentOption = () => {
      return CONFIG.departmentArr.map((item, index) => {
        return (
          <Option key={index} value={item.id}>
            {item.departmentName}
          </Option>
        );
      });
    };

    return (
      <div>
        <Form className="form-inline" layout="inline" onSubmit={this.handleSubmit}>
          <div className="form-row">
            <FormItem label="修改时间" colon={false} key="date">
              {getFieldDecorator('date')(<DatePicker {...T.timeConfig} style={{ width: '220px' }} />)}
            </FormItem>
            <FormItem label="部门" colon={false} key="departmentId">
              {getFieldDecorator('departmentId')(
                <Select style={{ width: '180px' }}>
                  <Option value="">全部</Option>
                  {getDepartmentOption()}
                </Select>
              )}
            </FormItem>
            <FormItem label="员工" colon={false} key="nickName">
              {getFieldDecorator('nickName')(<Input />)}
            </FormItem>
          </div>

          <div className="form-btn-group">
            <Button className="oa-btn" type="primary" htmlType="submit" loading={loading}>
              查询
            </Button>
          </div>
        </Form>

        {modalVisible && (
          <HolidayModifyModal
            {...modalConfig}
            ref={this.saveModalFormRef}
            // currentItem
          />
        )}
        {isShowTableData ? (
          <Table
            className="bg-white"
            columns={columns}
            dataSource={tableDataLists}
            loading={loading}
            pagination={this.state.pagination}
            onChange={this.handlePageSubmit}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

const WrappedHolidayForm = Form.create()(HolidayForm);
const mountNode = document.getElementById('root');

ReactDOM.render(
  <LocaleProvider locale={zh_CN}>
    <BasicLayout>
      <WrappedHolidayForm />
    </BasicLayout>
  </LocaleProvider>,
  mountNode
);
