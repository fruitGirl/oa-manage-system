/*
 * @Description:
 * @Author: qianqian
 * @Date: 2019-02-15 19:22:54
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 17:11:49
 */
import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import ReportTypeMaintainModal from 'components/businessCommon/ReportTypeMaintainModal';
const { Modal, Form, Select, Input, Button, Icon, Table, message, LocaleProvider, zh_CN } = window.antd;

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const StateManageModal = Form.create()((props) => {
  const { currentItem, modalVisible, handleModalCancel, handleModalOk, form, title, okText } = props;
  const { getFieldDecorator } = form;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 }
    }
  };

  const idIndex = CONFIG.jobPositionId.indexOf(currentItem.id); //修改的id对应职位上级的索引

  //去除修改中id有的上级职位下拉框中的内容
  let jobPositionId;
  if (idIndex !== -1) {
    jobPositionId = [...CONFIG.jobPositionId];
    jobPositionId.splice(idIndex, 1);
  }

  return (
    <Modal
      visible={modalVisible}
      title={title}
      okText={okText}
      onCancel={handleModalCancel}
      onOk={handleModalOk}
      width={410}
    >
      <Form className="antd_form_horizontal creat_from_modify">
        <FormItem {...formItemLayout} label="职位类型" key="jobPositionTypeId" className="formLable" colon={false}>
          {getFieldDecorator('jobPositionTypeId', {
            initialValue: currentItem.jobPositionType ? currentItem.jobPositionTypeId : '',
            rules: [{ required: true, message: '请填写职位类型' }]
          })(
            <Select style={{ width: '202px' }}>
              {CONFIG.jobPositionTypeId.map((item) => {
                return (
                  <Option value={item} key={item}>
                    {CONFIG.jobPositionTypeName[item]}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="上级职位" key="parentPositionId" className="formLable" colon={false}>
          {getFieldDecorator('parentPositionId', {
            initialValue: currentItem.parentPositionName ? currentItem.parentPositionId : ''
          })(
            <Select style={{ width: '202px' }}>
              <Option value="" style={{ height: 30 }}>
                {' '}
              </Option>
              {idIndex !== -1
                ? jobPositionId.map((item) => {
                    return (
                      <Option value={item} key={item}>
                        {CONFIG.jobPositionName[item]}
                      </Option>
                    );
                  })
                : CONFIG.jobPositionId.map((item) => {
                    return (
                      <Option value={item} key={item}>
                        {CONFIG.jobPositionName[item]}
                      </Option>
                    );
                  })}
              {/* {
                  CONFIG.jobPositionId.map((item) => {
                    return (<Option value={item} key={item}>{CONFIG.jobPositionName[item]}</Option>);
                  })
                } */}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="职位名称" key="positionName" className="formLable" colon={false}>
          {getFieldDecorator('positionName', {
            initialValue: currentItem.jobPositionName,
            rules: [
              { required: true, message: '请输入职位名称' }
              // { max: 100, message: '最多只能输入30个字' },
            ]
          })(<Input type="text" className="modal_input" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="职位代码" key="positionCode" className="formLable" colon={false}>
          {getFieldDecorator('positionCode', {
            initialValue: currentItem.jobPositionCode,
            rules: [{ required: true, message: '请填写职位代码' }]
          })(<Input type="text" className="modal_input" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="职位描述" key="message" className="formLable" colon={false}>
          {getFieldDecorator('message', {
            initialValue: currentItem.message,
            rules: [
              // { required: true, message: '请填写职位描述' },
            ]
          })(<TextArea className="modal_input" autosize={{ minRows: 2, maxRows: 6 }} maxLength={500} />)}
        </FormItem>
        {okText === '修改' ? (
          <FormItem {...formItemLayout} label="是否有效" key="enbled" className="formLable" colon={false}>
            {getFieldDecorator('enbled', {
              initialValue: currentItem.enabled === '是' ? 'true' : 'false',
              rules: [{ required: true, message: '请选择是否有效' }]
            })(
              <Select style={{ width: '202px' }}>
                <Option value="true">是</Option>
                <Option value="false">否</Option>
              </Select>
            )}
          </FormItem>
        ) : (
          ''
        )}
      </Form>
    </Modal>
  );
});

class PositionQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      reportModalVisible: false, //职位类型维护模态框的显示
      modalType: 'create',
      tableDataLists: [],
      currentItem: {}, //当前编辑的项,
      pagination: {
        current: 1,
        total: null,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`
      },
      showTable: false,
      isEnbleChange: false, //控制的是是否有效下拉框的改变
      parentPosChange: false,
      parentselectVal: '', //上级职位的val
      loading: false, // 表格是否加载数据,
      modifyId: '', //修改的id
      reportModalType: 'positionQuery',
      jobPositionTypeIdReport: CONFIG.jobPositionTypeId
    };
  }

  parentPositionHandleChange = (value) => {
    this.setState({
      jobselectVal: value,
      parentPosChange: true
    });
  };
  // 取消
  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
      reportModalVisible: false
    });
  };
  //职位类型维护
  showReportTpeyMaint = () => {
    this.reportModalForm.resetFields();
    this.setState({
      reportModalVisible: true
    });
  };
  //职位种类维护的模态框点确定的时候
  handleReportModalOk = () => {
    const reportModalForm = this.reportModalForm;
    reportModalForm.validateFields((err, values) => {
      if (err) {
        return;
      }

      const keysArr = values['keys'];
      if (keysArr.length === 0) {
        return;
      }
      reportModalForm.resetFields();
      this.setState({ reportModalVisible: false });
      let nameArr = [];
      keysArr.forEach((key) => {
        nameArr.push(values[`names_${key}`]);
      });
      // keysArr.map((key) => {
      // 	nameArr.push(values[`names_${key}`]);
      // })
      const name = nameArr.join(',');
      const url = `${T['userPath']}/jobPositionTypeCreate.json`;
      const params = {
        name
      };
      T.post(url, params)
        .then(() => {
          message.success('添加成功');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch((err) => {
          T.showError(err);
        });
    });
  };

  //删除input
  deleteInput = (id) => {
    const params = { id };
    const url = `${T['userPath']}/jobPositionTypeSetDisabled.json`;

    let list = this.state.jobPositionTypeIdReport;
    list.forEach((item, index) => {
      if (item === id) {
        list.splice(index, 1);
      }
      this.setState({
        jobPositionTypeIdReport: list,
        reportModalVisible: false
      });
    });
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗',
      onOk: () => {
        T.post(url, params)
          .then(() => {
            let list = this.state.jobPositionTypeIdReport;
            list.forEach((item, index) => {
              if (item === id) {
                list.splice(index, 1);
              }
              this.setState({
                jobPositionTypeIdReport: list,
                reportModalVisible: false
              });
            });
            message.success('删除成功');
          })
          .catch((err) => {
            T.showError(err);
          });
      }
    });
  };

  // 创建报表模态框
  showStateManage = () => {
    this.modalForm.resetFields();
    this.setState({
      modalVisible: true,
      modalType: 'create',
      currentItem: {}
    });
  };
  // 修改模态框
  showModifyModal = (record, index, id) => {
    this.modalForm.resetFields();
    // const currentNum = this.state.pagination.current;
    this.setState({
      modalType: 'modify',
      modalVisible: true,
      currentItem: record,
      modifyId: id
    });
  };
  //删除
  handleReoove = (record, index, id) => {
    const url = `${T['userPath']}/positionSetDisabled.json`;

    const params = {
      id
    };
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗',
      onOk: () => {
        T.post(url, params)
          .then((data) => {
            message.success('删除成功');
            setTimeout(() => {
              const currentPage = this.state.pagination.current;
              this.handleSubmit(null, currentPage);
            }, 1000);
          })
          .catch((err) => {
            T.showError(err);
          });
      }
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
      const positionName = values['positionName']; //职位名称
      const positionCode = values['positionCode']; //职位代码
      const message = values['message']; //职位描述
      const jobPositionTypeId = values['jobPositionTypeId']; //职位类型
      const parentPositionId = values['parentPositionId']; //上级职位

      let params = {
        jobPositionTypeId,
        parentPositionId,
        positionName,
        positionCode,
        message
      };
      if (modalType === 'create') {
        this.getModifyOrCreaterData(params, true);
      } else {
        const { modifyId } = this.state;
        const enabled = values['enbled'];
        params = {
          ...params,
          enabled,
          id: modifyId
        };
        this.getModifyOrCreaterData(params, false);
      }
    });
  };

  //修改、创建弹框的接口请求
  getModifyOrCreaterData = (params, isCreate) => {
    const url = isCreate ? `${T['userPath']}/positionCreate.json` : `${T['userPath']}/positionModify.json`;
    const text = isCreate ? '创建成功' : '修改成功';

    T.post(url, params)
      .then((data) => {
        message.success(text);
        setTimeout(() => {
          const currentPage = isCreate ? null : this.state.pagination.current;
          this.handleSubmit(null, currentPage);
        }, 1000);
      })
      .catch((err) => {
        T.showError(err);
      });
  };
  // 把创建报表的模态框中的form传出来
  saveModalFormRef = (form) => {
    this.modalForm = form;
  };
  //把职位类型维护中的form传出来
  saveReportModalFormRef = (form) => {
    this.reportModalForm = form.props.form;
  };

  handlePageSubmit = (pagination, filters, sorter) => {
    this.handleSubmit(null, pagination.current);
  };

  //表单提交(请求的是查询接口)
  handleSubmit = (e, currentPage = 1) => {
    if (e) {
      e.preventDefault();
    }

    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }

      const url = `${T['userPath']}/positionQuery.json`;
      const positionName = values['positionName'] ? values['positionName'] : ''; //职位名称
      const parentPositionId = values['parentPositionId'] ? values['parentPositionId'] : ''; //职位上级
      const enabled = values['enabled'];

      const jobPositionTypeId = values['jobPositionTypeId'] ? values['jobPositionTypeId'] : ''; //职位类型

      const params = {
        positionName,
        parentPositionId,
        enabled,
        jobPositionTypeId,
        currentPage
      };

      this.setState({
        loading: true,
        showTable: true
      });
      //请求查询接口
      T.get(url, params)
        .then((data) => {
          const result = data['result'];
          const list = result['list'];
          const positionTypeIdAndNameMap = data['positionTypeIdAndNameMap'];

          //组装table的数据
          const itemList =
            list.length > 0 &&
            list.map((item, index) => {
              const enabled = item.enabled === true ? '是' : '否';
              const jobPositionType = positionTypeIdAndNameMap[item.jobPositionTypeId]; //职位种类
              const parentPositionName = CONFIG.jobPositionName[item.parentPositionId]; //上级职位
              const listData = {
                key: `${index}`,
                id: item.id,
                jobPositionType: jobPositionType,
                jobPositionName: item.positionName,
                jobPositionCode: item.positionCode,
                parentPositionName: parentPositionName,
                  parentPositionId: item.parentPositionId, //上级职位id
                jobPositionTypeId: item.jobPositionTypeId, //职位种类id
                enabled: enabled,
                message: item.message
              };
              return listData;
            });
          const paginator = result['paginator'];

          this.setState({
            tableDataLists: itemList || [],
            loading: false,
            pagination: {
              ...this.state.pagination,
              total: paginator['items'],
              current: paginator['page'],
              pageSize: paginator['itemsPerPage']
            }
          });
        })
        .catch((err) => {
          this.setState({ loading: false });
          T.showError(err);
        });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const positionQuery = this.props.positionQuery;
    const dispatch = this.props.dispatch;
    const form = this.props.form;
    const {
      modalVisible,
      modalType,
      tableDataLists,
      currentItem,
      showTable,
      loading,
      reportModalVisible,
      reportModalType
    } = this.state;

    const modalMap = {
      create: {
        title: '职位创建',
        okText: '创建',
        isCreate: true
      },
      modify: {
        title: '职位修改',
        okText: '修改',
        isCreate: false
      }
    };
    //模态框的属性
    const modalConfig = {
      handleModalOk: this.handleModalOk,
      handleModalCancel: this.handleModalCancel,
      title: modalMap[modalType]['title'],
      okText: modalMap[modalType]['okText'],
      modalVisible,
      isCreate: modalMap[modalType]['isCreate'],
      currentItem,
      parentPositionHandleChange: this.parentPositionHandleChange
    };
    //职位类型维护模态框的属性
    const reportModalConfig = {
      handleReportModalOk: this.handleReportModalOk,
      handleModalCancel: this.handleModalCancel,
      reportModalVisible,
      deleteInput: this.deleteInput,
      positionQuery,
      dispatch,
      form,
      reportModalType
    };

    const columns = [
      {
        title: '职位种类',
        dataIndex: 'jobPositionType',
        className: 'table-center'
        // width: '25%'
      },
      {
        title: '职位名称',
        dataIndex: 'jobPositionName',
        className: 'table-center'
        // width: '25%'
      },
      {
        title: '上级职位',
        dataIndex: 'parentPositionName',
        className: 'table-center'
        // width: '25%'
      },
      {
        title: '职位代码',
        dataIndex: 'jobPositionCode',
        className: 'table-center'
        // width: '25%'
        },
      {
        title: CONFIG.hasAuthorityOperate ? '操作' : '',
        dataIndex: 'operate',
        // width: '25%',
        render: (text, record, index) => {
          const modifyId = tableDataLists[index]['id'];
          return (
            <div>
              {CONFIG.hasAuthorityOperate ? (
                <span>
                  <span
                    className="i_block modify-span"
                    style={{ marginRight: '15px' }}
                    onClick={() => this.showModifyModal(record, index, modifyId)}
                  >
                    修改
                  </span>
                  <span className="i_block modify-span" onClick={() => this.handleReoove(record, index, modifyId)}>
                    删除
                  </span>
                </span>
              ) : (
                ''
              )}
            </div>
          );
        },
        className: 'table-center'
      }
    ];

    return (
      <LocaleProvider locale={zh_CN}>
        <BasicLayout>
          <StateManageModal {...modalConfig} ref={this.saveModalFormRef} />
          <ReportTypeMaintainModal {...reportModalConfig} ref={this.saveReportModalFormRef} />
          <Form
            layout="inline"
            onSubmit={this.handleSubmit}
            className="antd_form_horizontal main-content-tranche form-inline"
            id="process_form"
          >
            <div>
              <FormItem label="职位名称" key="positionName" colon={false}>
                {getFieldDecorator('positionName', {
                  initialValue: ''
                })(<Input className="input_width" type="text" />)}
              </FormItem>
              <FormItem label="上级职位" key="parentPositionId" colon={false}>
                {getFieldDecorator('parentPositionId', {
                  initialValue: '',
                  rules: [{ max: 30, message: '最多只能输入30个字' }]
                })(
                  <Select className="input_width">
                    <Option value="">全部</Option>
                    {/* {parentPositionOption} */}
                    {CONFIG.jobPositionId.map((item) => {
                      return (
                        <Option value={item} key={item}>
                          {CONFIG.jobPositionName[item]}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem label="是否有效" key="enabled" colon={false}>
                {getFieldDecorator('enabled', {
                  initialValue: 'true'
                })(
                  <Select className="input_width">
                    <Option value="true">是</Option>
                    <Option value="false">否</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="职位类型" key="jobPositionTypeId" colon={false}>
                {getFieldDecorator('jobPositionTypeId', {
                  initialValue: ''
                })(
                  <Select className="input_width">
                    <Option value="">全部</Option>
                    {/* {jobPositionTypOption} */}
                    {CONFIG.jobPositionTypeId.map((item) => {
                      return (
                        <Option value={item} key={item}>
                          {CONFIG.jobPositionTypeName[item]}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
            </div>
            <div className="form-btn-group">
              <Button type="primary" className="oa-btn" htmlType="submit" loading={loading}>
                查询
              </Button>
              {CONFIG.hasAuthorityCreate ? (
                <Button type="primary" className="oa-btn" onClick={this.showStateManage}>
                  <Icon type="plus" />
                  创建职位
                </Button>
              ) : (
                ''
              )}

              {CONFIG.hasAuthorityManType ? (
                <Button type="primary" className="oa-btn" onClick={this.showReportTpeyMaint} style={{ width: 120 }}>
                  职位种类维护
                </Button>
              ) : (
                ''
              )}
            </div>
          </Form>
          {showTable ? (
            <div className="ant-table-wrapper bg-white">
              <Table
                columns={columns}
                dataSource={tableDataLists}
                loading={loading}
                pagination={this.state.pagination}
                onChange={this.handlePageSubmit}
              />
            </div>
          ) : (
            ''
          )}
        </BasicLayout>
      </LocaleProvider>
    );
  }
}

export default connect(({ positionQuery }) => ({ positionQuery }))(Form.create()(PositionQuery));
