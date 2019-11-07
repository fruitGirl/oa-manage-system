import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import 'styles/user/userTimeOffQuery.less';
const {
  Form,
  Input,
  DatePicker,
  Button,
  Table,
  Icon,
  message,
  Modal,
  InputNumber,
  LocaleProvider,
  zh_CN
} = window.antd;

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

let modifyId;
let userIdGol;

const UserOffConfigModal = Form.create()((props) => {
  const { currentItem, modalVisible, handleModalCancel, handleModalOk, form, title, okText, isCreate } = props;

  const { getFieldDecorator } = form;

  return (
    <Modal
      visible={modalVisible}
      title={title}
      okText={okText}
      onCancel={handleModalCancel}
      onOk={handleModalOk}
      width={404}
    >
      <Form className="form-flex" hideRequiredMark={true}>
        <FormItem label="员工" colon={false} key="nickName">
          {getFieldDecorator('nickName', {
            initialValue: currentItem.userId,
            rules: [
              { required: true, message: '请填写员工名' }
              // { max: 30, message: '最多只能输入30个字' },
            ]
          })(<Input disabled={isCreate ? false : true} />)}
        </FormItem>
        <FormItem label="总请假时长" colon={false} key="totalVacationHours">
          {getFieldDecorator('totalVacationHours', {
            initialValue: currentItem.totalVacationHours,
            rules: [
              { required: true, message: '请填写总请假时长' }
              // { max: 30, message: '最多只能输入30个字' },
            ]
          })(<InputNumber min={0} style={{ width: 210 }} />)}
        </FormItem>
        <FormItem label="总加班时长" colon={false} key="totalOvertimeHours">
          {getFieldDecorator('totalOvertimeHours', {
            initialValue: currentItem.totalOvertimeHours,
            rules: [
              { required: true, message: '请填写总加班时长' }
              // { max: 30, message: '最多只能输入30个字' },
            ]
          })(<InputNumber min={0} style={{ width: 210 }} />)}
        </FormItem>
        <FormItem label="已调休时长" colon={false} key="alreadyTimeOff">
          {getFieldDecorator('alreadyTimeOff', {
            initialValue: currentItem.alreadyTimeOff,
            rules: [
              { required: true, message: '请填写已调休时长' }
              // { max: 30, message: '最多只能输入30个字' },
            ]
          })(<InputNumber min={0} style={{ width: 210 }} />)}
        </FormItem>
        <FormItem label="可用调休时长" colon={false} key="availableTimeOff">
          {getFieldDecorator('availableTimeOff', {
            initialValue: currentItem.availableTimeOff,
            rules: [
              { required: true, message: '请填写可用调休时长' }
              // { max: 30, message: '最多只能输入30个字' },
            ]
          })(<InputNumber min={0} style={{ width: 210 }} />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

class offTimeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showTable: false,
      modalVisible: false,
      modalType: 'create',
      tableDataLists: [],
      currentItem: {}, //当前编辑的项,
      pagination: {
        current: 1,
        total: null,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`
      },
      loading: false //表格是否加载数据
    };
  }
  // 取消
  handleModalCancel = () => {
    this.setState({
      modalVisible: false
    });
  };

  handleModalOk = () => {
    const { modalType } = this.state;
    const modalForm = this.modalForm;
    modalForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      modalForm.resetFields();
      this.setState({ modalVisible: false });

      if (modalType === 'create') {
        this.createUserOffConfig(values);
      } else {
        const totalVacationHours = values['totalVacationHours'];
        const totalOvertimeHours = values['totalOvertimeHours'];
        const alreadyTimeOff = values['alreadyTimeOff'];
        const availableTimeOff = values['availableTimeOff'];
        const id = modifyId;
        const userId = userIdGol;
        const params = {
          id,
          totalVacationHours,
          totalOvertimeHours,
          alreadyTimeOff,
          availableTimeOff,
          userId
        };
        this.modifyUserOff(params);
      }
    });
  };

  createUserOffConfig = (values) => {
    const url = `${T['userPath']}/userTimeOffCreate.json`;

    T.post(url, values)
      .then((data) => {
        message.success('创建成功');
        setTimeout(() => {
          this.handleSubmit(null);
        }, 1000);
      })
      .catch((err) => {
        T.showError(err);
      });
  };

  modifyUserOff = (values) => {
    const url = `${T['userPath']}/userTimeOffModifyById.json`;

    T.post(url, values)
      .then((data) => {
        message.success('修改成功');
        setTimeout(() => {
          const currentPage = this.state.pagination.current;
          this.handleSubmit(null, currentPage);
        }, 1000);
      })
      .catch((err) => {
        T.showError(err);
      });
  };

  // 表单提交
  handleSubmit = (e, currentPage = 1) => {
    if (e) {
      e.preventDefault();
    }

    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const url = `${T['userPath']}/userTimeOffPageQuery.json`;
      //总请假时长
      const minTotalVacationHours = values['minTotalVacationHours'] ? values['minTotalVacationHours'] : '';
      const maxTotalVacationHours = values['maxTotalVacationHours'] ? values['maxTotalVacationHours'] : '';
      //员工
      const nickName = values['nickName'] ? values['nickName'] : '';
      //时间
      const gmtModified = values['gmtModified'] ? values['gmtModified'] : '';
      const minGmtModified = gmtModified.length !== 0 ? gmtModified[0].format('YYYY-MM-DD HH:mm:ss') : '';
      const maxGmtModified = gmtModified.length !== 0 ? gmtModified[1].format('YYYY-MM-DD HH:mm:ss') : '';
      //总加班时长
      const maxTotalOvertimeHours = values['maxTotalOvertimeHours'] ? values['maxTotalOvertimeHours'] : '';
      const minTotalOvertimeHours = values['minTotalOvertimeHours'] ? values['minTotalOvertimeHours'] : '';
      //已调休时长
      const maxAlreadyTimeOff = values['maxAlreadyTimeOff'] ? values['maxAlreadyTimeOff'] : '';
      const minAlreadyTimeOff = values['minAlreadyTimeOff'] ? values['minAlreadyTimeOff'] : '';
      //可用调休时长
      const maxAvailableTimeOff = values['maxAvailableTimeOff'] ? values['maxAvailableTimeOff'] : '';
      const minAvailableTimeOff = values['minAvailableTimeOff'] ? values['minAvailableTimeOff'] : '';

      const params = {
        nickName,
        minTotalVacationHours,
        maxTotalVacationHours,
        minTotalOvertimeHours,
        maxTotalOvertimeHours,
        minAlreadyTimeOff,
        maxAlreadyTimeOff,
        minAvailableTimeOff,
        maxAvailableTimeOff,
        minGmtModified,
        maxGmtModified,
        currentPage
      };
      this.setState({
        loading: true
      });
      // 查询
      // axios.get(url, { params })
      T.get(url, params)
        .then((data) => {
          const pageList = data['pageList'];
          const list = pageList['list'];
          const userIdAndNickNameMap = data['userIdAndNickNameMap'];

          let itemList = [];

          for (let i = 0; i < list.length; i++) {
            let item = list[i];
            itemList.push({
              key: i,
              alreadyTimeOff: item.alreadyTimeOff,
              availableTimeOff: item.availableTimeOff,
              gmtCreate: item.gmtCreate,
              gmtModified: item.gmtModified,
              totalOvertimeHours: item.totalOvertimeHours,
              totalVacationHours: item.totalVacationHours,
              nickName: userIdAndNickNameMap[item.userId],
              userId: item.userId,
              id: item.id
            });
          }
          const paginator = pageList['paginator'];
          this.setState({
            showTable: true,
            pagination: {
              ...this.state.pagination,
              total: paginator['items'],
              current: paginator['page'],
              pageSize: paginator['itemsPerPage']
            }
          });
          if (list.length > 0) {
            this.setState({ tableDataLists: itemList });
          } else {
            this.setState({ tableDataLists: [] });
          }
          this.setState({
            loading: false
          });
        })
        .catch((err) => {
          this.setState({
            loading: false
          });
          T.showError(err);
        });
    });
  };
  // 创建流程模态框
  showCreateFlowModal = () => {
    this.modalForm.resetFields();
    this.setState({
      modalVisible: true,
      modalType: 'create',
      currentItem: {}
    });
  };

  // 修改模态框
  showModifyModal = (record, index, id, userId) => {
    this.modalForm.resetFields();
    this.modifyIndex = index;
    this.setState({
      modalType: 'modify',
      modalVisible: true,
      currentItem: record
    });
    modifyId = id;
    userIdGol = userId;
  };

  saveModalFormRef = (form) => {
    this.modalForm = form;
  };

  handlePageSubmit = (pagination) => {
    this.handleSubmit(null, pagination.current);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible, modalType, tableDataLists, currentItem, loading } = this.state;

    const modalMap = {
      create: {
        title: '创建流程',
        okText: '创建',
        isCreate: true
      },
      modify: {
        title: '修改流程',
        okText: '修改',
        isCreate: false
      }
    };
    const modalConfig = {
      handleModalOk: this.handleModalOk,
      handleModalCancel: this.handleModalCancel,
      title: modalMap[modalType]['title'],
      okText: modalMap[modalType]['okText'],
      modalVisible,
      isCreate: modalMap[modalType]['isCreate'],
      currentItem
    };

    const columns = [
      {
        title: '员工',
        dataIndex: 'nickName',
        width: '15%',
        className: 'text-center'
      },
      {
        title: '总请假时长',
        dataIndex: 'totalVacationHours',
        width: '15%',
        className: 'text-center'
      },
      {
        title: '总加班时长',
        dataIndex: 'totalOvertimeHours',
        width: '15%',
        className: 'text-center'
      },
      {
        title: '已调休时长',
        dataIndex: 'alreadyTimeOff',
        width: '15%',
        className: 'text-center'
      },
      {
        title: '可用调休时长',
        dataIndex: 'availableTimeOff',
        width: '15%',
        className: 'text-center'
      },
      {
        title: '修改时间',
        dataIndex: 'gmtModified',
        width: '15%',
        className: 'text-center'
      },
      {
        title: CONFIG.hasAuthority ? '操作' : '',
        dataIndex: 'operation',
        width: '10%',
        className: 'text-center',
        render: (text, record, index) => {
          const id = tableDataLists[index]['id'];
          const userId = tableDataLists[index]['userId'];
          return (
            <div>
              {CONFIG.hasAuthority ? (
                <a href="javascript:;" onClick={() => this.showModifyModal(record, index, id, userId)}>
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

    return (
      <div>
        <Form id="offTimeForm" className="form-inline" layout="inline" onSubmit={this.handleSubmit}>
          <div className="form-row">
            <FormItem label="员工" colon={false} key="nickName">
              {getFieldDecorator('nickName')(<Input />)}
            </FormItem>
            <FormItem label="时间" colon={false} key="gmtModified">
              {getFieldDecorator('gmtModified')(<RangePicker {...T.rangerTimeConfig} />)}
            </FormItem>

            <FormItem label="总请假时长" colon={false} key="minTotalVacationHours">
              {getFieldDecorator('minTotalVacationHours')(<InputNumber min={0} className="number_input" />)}
            </FormItem>
            <span className="day_span">时 - </span>
            <FormItem colon={false} key="maxTotalVacationHours">
              {getFieldDecorator('maxTotalVacationHours')(<InputNumber min={0} className="number_input" />)}
            </FormItem>
            <span className="day_span">时</span>
          </div>

          <div className="form-row">
            <FormItem label="总加班时长" colon={false} key="minTotalOvertimeHours">
              {getFieldDecorator('minTotalOvertimeHours')(<InputNumber min={0} className="number_input" />)}
            </FormItem>
            <span className="day_span">时 - </span>
            <FormItem colon={false} key="maxTotalOvertimeHours">
              {getFieldDecorator('maxTotalOvertimeHours')(<InputNumber min={0} className="number_input" />)}
            </FormItem>
            <span className="day_span">时</span>

            <FormItem label="已调休时长" colon={false} key="minAlreadyTimeOff">
              {getFieldDecorator('minAlreadyTimeOff')(<InputNumber min={0} className="number_input" />)}
            </FormItem>
            <span className="day_span">时 - </span>
            <FormItem colon={false} key="maxAlreadyTimeOff">
              {getFieldDecorator('maxAlreadyTimeOff')(<InputNumber min={0} className="number_input" />)}
            </FormItem>
            <span className="day_span">时</span>

            <FormItem label="可用调休时长" colon={false} key="minAvailableTimeOff">
              {getFieldDecorator('minAvailableTimeOff')(<InputNumber min={0} className="number_input" />)}
            </FormItem>
            <span className="day_span">时 - </span>
            <FormItem colon={false} key="maxAvailableTimeOff">
              {getFieldDecorator('maxAvailableTimeOff')(<InputNumber min={0} className="number_input" />)}
            </FormItem>
            <span className="day_span">时</span>
          </div>
          <div className="form-btn-group">
            <Button className="oa-btn" type="primary" htmlType="submit" loading={loading}>
              查询
            </Button>
            {CONFIG.hasAuthority ? (
              <Button type="primary" onClick={this.showCreateFlowModal}>
                <Icon type="plus" />
                创建
              </Button>
            ) : (
              ''
            )}
          </div>
        </Form>

        <UserOffConfigModal {...modalConfig} ref={this.saveModalFormRef} />

        <Table
          columns={columns}
          dataSource={tableDataLists}
          loading={loading}
          pagination={this.state.pagination}
          onChange={this.handlePageSubmit}
          className={this.state.showTable ? '' : 'hide'}
        />
      </div>
    );
  }
}

const WrappedoffTimeForm = Form.create()(offTimeForm);
const mountNode = document.getElementById('root');

ReactDOM.render(
  <LocaleProvider locale={zh_CN}>
    <BasicLayout>
      <WrappedoffTimeForm />
    </BasicLayout>
  </LocaleProvider>,
  mountNode
);
