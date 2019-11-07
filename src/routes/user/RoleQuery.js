/*
 * @Description: 系统-角色管理
 * @Author: qianqian
 * @Date: 2019-02-18 11:39:13
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 17:45:06
 */
import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import ReportTypeMaintainModal from 'components/businessCommon/ReportTypeMaintainModal';
import GrantRoleAuthorityModal from 'components/businessCommon/GrantRoleAuthorityModal';
const { Form, Select, Input, Button, Icon, Table, Modal, message, LocaleProvider, zh_CN } = window.antd;

const FormItem = Form.Item;
const Option = Select.Option;
const AddRoleModal = Form.create()((props) => {
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

  //角色类型
  // const roleTypeOption = CONFIG.jobPositionId.map((item) => {
  //   return (<Option value={item} key={item}>{CONFIG.jobPositionName[item]}</Option>);
  // });
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
        <FormItem {...formItemLayout} label="角色类型" key="roleTypeName" className="formLable" colon={false}>
          {getFieldDecorator('roleTypeName', {
            initialValue: currentItem.roleTypeName ? currentItem.roleTypeId : '',
            rules: [{ required: true, message: '请填写角色类型' }]
          })(
            <Select style={{ width: '202px' }}>
              {/* {roleTypeOption} */}
              {CONFIG.jobPositionId &&
                CONFIG.jobPositionId.map((item) => {
                  return (
                    <Option value={item} key={item}>
                      {CONFIG.jobPositionName[item]}
                    </Option>
                  );
                })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="角色名称" key="roleName" className="formLable" colon={false}>
          {getFieldDecorator('roleName', {
            initialValue: currentItem.roleName,
            rules: [
              { required: true, message: '请填写角色名称' }
              // { max: 30, message: '最多只能输入30个字' },
            ]
          })(<Input className="modal_input" type="text" />)}
        </FormItem>
        {okText === '修改' ? (
          <FormItem {...formItemLayout} label="是否有效" key="enabled" className="formLable" colon={false}>
            {getFieldDecorator('enabled', {
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

class RoleQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      reportModalVisible: false, //角色类型维护模态框的显示
      authorityVisible: false, //设置权限模态框的显示
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
      loading: false, // 表格是否加载数据,
      tableNumData: null, //使用员工数
      noBtn: false, //用来控制是点击使用员工数弹出框的还是按钮弹出框
      modifyId: '', //修改时的id
      authorityData: '', //权限设置弹框的数据
      reportModalType: 'roleQuery',
      domainVal: '',
      checkedList: [], //角色管理回填
      grantAuthorityModalLoading: false, //角色权限提交loading
      jobPositionTypeIdReport: CONFIG.jobPositionId,
      value: null //部门树的value
      // checkedList: [],
      // indeterminate: false,
      // checkAll: false,
    };
  }

  // 取消
  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
      reportModalVisible: false,
      authorityVisible: false
    });
  };
  //角色类型维护模态框的显示
  showReportTpeyMaint = () => {
    this.reportModalForm.resetFields();
    this.setState({
      reportModalVisible: true,
      tableNumData: null,
      noBtn: false
    });
  };
  //角色类型的模态框点确定的时候
  handleReportModalOk = (key) => {
    const reportModalForm = this.reportModalForm;
    reportModalForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      let nameArr = [];
      key.forEach((item) => {
        nameArr.push(values[`names_${item}`]);
      });
      // key.map((item) => {
      // 	nameArr.push(values[`names_${item}`]);
      // })
      if (!nameArr) {
        return;
      }
      reportModalForm.resetFields();
      this.setState({ reportModalVisible: false });

      const name = nameArr.join(',');
      const url = `${T['userPath']}/roleTypeCreate.json`;
      const params = {
        name
      };
      T.post(url, params)
        .then(() => {
          message.success('添加成功');
        })
        .catch((err) => {
          T.showError(err);
        });
    });
  };
  //删除input
  deleteInput = (id) => {
    if (this.state.noBtn) {
      //使用员工数
      const url = `${T['userPath']}/userRoleSetDisabled.json`;
      const params = {
        roleId: this.modifyId,
        userId: id
      };
      Modal.confirm({
        title: '提示',
        content: '确定要删除吗',
        onOk: () => {
          T.post(url, params)
            .then(() => {
              let list = this.state.tableNumData;
              list.forEach((item, index) => {
                if (item.userId === id) {
                  list.splice(index, 1);
                }
              });
              // list.map((item,index) => {
              // 	if(item.userId === id) {
              // 		list.splice(index,1);
              // 	}
              // })
              this.setState({
                tableNumData: list,
                reportModalVisible: false
              });
              message.success('删除成功');
            })
            .catch((err) => {
              T.getError(err);
            });
        }
      });
    } else {
      const url = `${T['userPath']}/roleTypeSetDisabled.json`;
      const params = {
        id
      };
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
              // list.map((item,index) => {
              // 	if(item === id) {
              // 		list.splice(index,1);
              // 	}
              // 	this.setState({
              // 		jobPositionTypeIdReport: list,
              // 		reportModalVisible: false
              // 	})
              // })
              message.success('删除成功');
            })
            .catch((err) => {
              T.showError(err);
            });
        }
      });
    }
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
  showModifyModal = (record) => {
    this.modalForm.resetFields();
    this.setState({
      modalType: 'modify',
      modalVisible: true,
      currentItem: record,
      modifyId: record.id
    });
  };
  //查看使用员工数
  showUsedStaffNum = (record) => {
    this.setState({
      noBtn: true,
      reportModalVisible: true,
      reportModalType: 'staff'
    });
    const url = `${T['userPath']}/userRoleQuery.json`;
    const params = {
      roleId: record.id
    };
    this.modifyId = record.id;

    T.get(url, params)
      .then((data) => {
        const userList = data['userList'];
        this.setState({ tableNumData: userList });
      })
      .catch((err) => {
        T.showError(err);
      });
  };
  //设置权限弹出模态框
  setAuthority = (record) => {
    let form = this.grantRoleAuthorityForm;
    form.resetFields();
    this.setState({ domainVal: '' }); //隐藏两个下拉列表

    this.props.dispatch({
      type: 'roleQuery/save',
      payload: {
        departmentId: ''
      }
    });
    const url = `${T['userPath']}/grantRoleAuthorityInit.json`;

    T.get(url)
      .then((data) => {
        // let plainOptions = {};
        // const authorityTypeCodeAndNameMap = data['authorityTypeCodeAndNameMap'];//权限对应的一级菜单
        // const authorityTypeCodeAndAuthoritysMap = data['authorityTypeCodeAndAuthoritysMap'];//权
        // for(var key in authorityTypeCodeAndNameMap){
        // 	arrKey.push(key);
        // }
        // arrKey.map((item,index) => {
        //
        // 	let plainOption = [];
        //
        // 	if(authorityTypeCodeAndAuthoritysMap[item]) {
        // 		//循环二级的权限菜单
        // 		authorityTypeCodeAndAuthoritysMap[item].map((item) => {
        // 			plainOption.push({ label: item.authorityName, value: item.id});
        // 		});
        // 	}
        //
        // 	plainOptions[item] = plainOption;
        //
        // 	// this.setState({
        // 	// 	// [`checkedList_${item}`]: [],
        // 	// 	[`indeterminate_${item}`]: false,
        // 	// 	[`checkAll_${item}`]: false,
        // 	// });
        // });
        this.setState({
          currentItem: record,
          authorityData: data
        });

        let roleId = form.getFieldValue('roleId');
        let domain = form.getFieldValue('domain');
        let departmentId = this.props.roleQuery.departmentId;
        let isIncludeChildDept = form.getFieldValue('isIncludeChildDept');
        // 请求回填数据
        this.getCheckedList({
          roleId,
          domain,
          departmentId,
          isIncludeChildDept
        });
      })
      .catch((err) => {
        T.showError(err);
      });
    this.setState({ authorityVisible: true });
  };

  //创建修改的模态框的确定按钮
  handleModalOk = () => {
    const { modalType } = this.state;
    const modalForm = this.modalForm;
    modalForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      modalForm.resetFields();
      this.setState({ modalVisible: false });
      const roleName = values['roleName'];
      const roleTypeId = values['roleTypeName'];
      let params = {
        roleTypeId,
        roleName
      };

      if (modalType === 'create') {
        // const params = {
        // 	roleTypeId,
        // 	roleName,
        // };
        // this.createProcess(params);
        this.getCreateOrModifyData(params, true);
      } else {
        const enabled = values['enabled'];
        // const params = {
        // 	id: this.state.modifyId,
        // 	roleTypeId,
        //   roleName,
        //   enabled
        // };
        params = {
          ...params,
          enabled,
          id: this.state.modifyId
        };
        // this.modifyProcess(params);
        this.getCreateOrModifyData(params, false);
      }
    });
  };
  //权限设置模态框点击确定按钮的函数
  handldGrantAuthorityModalOk = () => {
    let values = this.grantRoleAuthorityForm.getFieldsValue();

    let array = [];
    let rightValue = ['roleId', 'domain', 'departmentId', 'isIncludeChildDept'];
    for (let i in values) {
      // if(i === 'roleId'|| i === 'domain' || i === 'departmentId' || i==='isIncludeChildDept') continue;

      if (rightValue.includes(i)) continue;
      array = [...array, ...values[i]];
    }
    array = Array.from([...new Set(array)]);
    // this.setState({ authorityVisible: false });
    let params = {
      roleId: values['roleId'],
      domain: values['domain'],
      departmentId: this.props.roleQuery.departmentId || '',
      isIncludeChildDept: values['isIncludeChildDept'] || false,
      authorityIds: array.join(',')
    };
    this.setState({
      grantAuthorityModalLoading: true,
      checkedList: array
    });

    T.post(`${T['userPath']}/grantRoleAuthority.json`, params)
      .then((data) => {
        message.success('创建权限成功');
        this.setState({
          grantAuthorityModalLoading: false,
        });
      })
      .catch((data) => {
        T.showError(data);
        this.setState({
          grantAuthorityModalLoading: false
        });
      });
  };
  // //创建接口请求
  // createProcess = (params) => {
  // 	const url = `${T['userPath']}/roleCreate.json`;
  // 	axios(url,{
  // 		method: 'POST',
  // 		params,
  // 	})
  // 	.then((response) => {
  // 		const data = response.data;
  // 		//请求成功
  // 		if(data.success) {
  // 			message.success('创建成功');
  // 			setTimeout(() => {
  // 				this.handleSubmit(null);
  // 			}, 1000);
  // 		}else {
  // 			T.showError(data);
  // 		}
  // 	})
  // 	.catch((err) => {
  // 		T.showError('系统报错');
  // 		throw err;
  // 	});
  // }
  // //修改弹框的接口请求
  // modifyProcess = (params) => {
  // 	const url = `${T['userPath']}/roleModify.json`;

  // 	axios(url,{
  // 		method: 'POST',
  // 		params,
  // 	})
  // 	.then((response) => {
  // 		const data = response.data;
  // 		//请求成功
  // 		if(data.success) {
  // 			message.success('修改成功');
  // 			setTimeout(() => {
  // 				const currentPage = this.state.pagination.current;
  // 				this.handleSubmit(null,currentPage);
  // 			}, 1000);
  // 		}else {
  // 			T.showError(data);
  // 		}
  // 	})
  // 	.catch((err) => {
  // 		T.showError('系统报错');
  // 		throw err;
  // 	});
  // }
  //创建、修改弹框的接口
  getCreateOrModifyData = (params, isCreate) => {
    const url = isCreate ? `${T['userPath']}/roleCreate.json` : `${T['userPath']}/roleModify.json`;
    const text = isCreate ? '创建成功' : '修改成功';

    T.get(url, params)
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
  //把角色类型维护中的form传出来
  saveReportModalFormRef = (form) => {
    this.reportModalForm = form.props.form;
  };
  //把设置权限模态框中的form传出来
  saveModalGrantRoleAuthoritFormRef = (form) => {
    this.grantRoleAuthorityForm = form;
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

      const url = `${T['userPath']}/roleQuery.json`;
      const id = values['id'] ? values['id'] : ''; //主键id
      const roleName = values['roleName'] ? values['roleName'] : ''; //角色名称
      const enabled = values['enabled'];

      const roleTypeId = values['roleTypeId'] ? values['roleTypeId'] : ''; //角色类型

      const params = {
        id,
        roleName,
        roleTypeId,
        enabled,
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

          //组装table的数据
          const itemList =
            list.length > 0 &&
            list.map((item, index) => {
              const enabled = item.enabled === true ? '是' : '否';
              const roleTypeName = CONFIG.jobPositionName[item.roleTypeId];
              const roleIdAndCountMap = data['roleIdAndCountMap'];
              const listData = {
                key: `${index}`,
                id: item.id,
                roleName: item.roleName,
                roleTypeName: roleTypeName,
                number: roleIdAndCountMap[item.id] ? roleIdAndCountMap[item.id] : 0,
                enabled: enabled,
                roleTypeId: item.roleTypeId
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

          // if (list.length > 0) {
          // 	this.setState({
          // 		tableDataLists: itemList,
          // 		loading: false,
          //     pagination: {
          //       ...this.state.pagination,
          //       total: paginator['items'],
          //       current: paginator['page'],
          //       pageSize: paginator['itemsPerPage'],
          // 		},
          // 	});
          // }else {
          // 	this.setState({
          // 		tableDataLists: [],
          // 		loading: false,
          //     pagination: {
          //       ...this.state.pagination,
          //       total: paginator['items'],
          //       current: paginator['page'],
          //       pageSize: paginator['itemsPerPage'],
          // 		},
          // 	});
          // }
        })
        .catch((err) => {
          this.setState({ loading: false });
          T.showError(err);
        });
    });
  };
  //角色管理弹框中下拉列表绑定的change函数
  backFillSelectChange = (value, type) => {
    let form = this.grantRoleAuthorityForm;
    let roleId = type === 'roleId' ? value : form.getFieldValue('roleId');
    let domain = type === 'domain' ? value : form.getFieldValue('domain');
    let departmentId = type === 'departmentId' ? value : form.getFieldValue('departmentId');
    let isIncludeChildDept = type === 'isIncludeChildDept' ? value : form.getFieldValue('isIncludeChildDept');

    this.getCheckedList({
      roleId,
      domain,
      departmentId,
      isIncludeChildDept
    });
    if (departmentId) {
      this.setState({ value });
    }
  };
  //请求回填数据
  getCheckedList = (params) => {
    T.get(CONFIG.frontPath + '/user/queryByRoleIdAndDomainAndDepartmentInfo.json', params)
      .then((data) => {
        let list = data.authoritySimpleList;
        let result = [];
        list.forEach((item) => {
          result.push(item.id);
        });
        this.setState({
          checkedList: result
        });
      })
      .catch((err) => {
        T.showError(err);
      });
  };
  handleDomainChange = (value) => {
    this.setState({ domainVal: value });

    this.backFillSelectChange(value, 'domain');
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const roleQuery = this.props.roleQuery;
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
      tableNumData,
      noBtn,
      authorityVisible,
      authorityData,
      grantAuthorityModalLoading,
      checkedList,
      domainVal,
      reportModalType
    } = this.state;
    // 时间参数
    const modalMap = {
      create: {
        title: '创建角色',
        okText: '创建',
        isCreate: true
      },
      modify: {
        title: '修改角色',
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
      currentItem
    };
    //角色类型维护模态框的属性
    const reportModalConfig = {
      handleReportModalOk: this.handleReportModalOk,
      handleModalCancel: this.handleModalCancel,
      reportModalVisible,
      deleteInput: this.deleteInput,
      roleQuery,
      dispatch,
      form,
      tableNumData,
      noBtn,
      reportModalType
    };
    //权限设置模态框的属性
    const grantRoleAuthorityModalConfig = {
      handldGrantAuthorityModalOk: this.handldGrantAuthorityModalOk,
      btnLoading: grantAuthorityModalLoading,
      handleModalCancel: this.handleModalCancel,
      handleDomainChange: this.handleDomainChange,
      authorityVisible,
      currentItem,
      authorityData,
      backFillSelectChange: this.backFillSelectChange,
      checkedList,
      domainVal,
      roleQuery,
      dispatch
    };

    //角色类型
    // const roleTypeOption = CONFIG.jobPositionId.map((item) => {
    //   return (<Option value={item} key={item}>{CONFIG.jobPositionName[item]}</Option>);
    // });

    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        className: 'table-center'
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
        className: 'table-center'
      },
      {
        title: '角色类型',
        dataIndex: 'roleTypeName',
        className: 'table-center'
      },
      {
        title: '使用员工数',
        dataIndex: 'number',
        className: 'table-center text-number',
        render: (text, record) => {
          return (
            <div>
              {record.number === 0 ? (
                <span className="modify-span" style={{ color: '#999' }}>
                  {text}
                </span>
              ) : (
                <span className="modify-span" onClick={() => this.showUsedStaffNum(record)}>
                  {text}
                </span>
              )}
            </div>
          );
        }
      },
      {
        title: '是否有效',
        dataIndex: 'enabled',
        className: 'table-center'
      },
      {
        title: CONFIG.hasAuthorityOperate ? '操作' : '',
        dataIndex: 'operate',
        render: (text, record, index) => {
          return (
            <div>
              {CONFIG.hasAuthorityOperate ? (
                <span>
                  <span
                    className="i_block modify-span"
                    style={{ marginRight: '15px' }}
                    onClick={() => this.showModifyModal(record, index)}
                  >
                    修改
                  </span>
                  {record.enabled === '是' ? (
                    <span className="i_block modify-span" onClick={() => this.setAuthority(record, index)}>
                      设置权限
                    </span>
                  ) : null}
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
          <AddRoleModal {...modalConfig} ref={this.saveModalFormRef} />
          <ReportTypeMaintainModal {...reportModalConfig} ref={this.saveReportModalFormRef} />
          <GrantRoleAuthorityModal {...grantRoleAuthorityModalConfig} ref={this.saveModalGrantRoleAuthoritFormRef} />
          <Form
            layout="inline"
            onSubmit={this.handleSubmit}
            className="antd_form_horizontal main-content-tranche form-inline"
            id="process_form"
          >
            <div>
              <FormItem label="主键id" key="id" colon={false}>
                {getFieldDecorator('id', {
                  initialValue: ''
                })(<Input className="input_width" type="text" />)}
              </FormItem>
              <FormItem label="角色名称" key="roleName" colon={false}>
                {getFieldDecorator('roleName', {
                  initialValue: '',
                  rules: [{ max: 30, message: '最多只能输入30个字' }]
                })(<Input className="input_width" type="text" />)}
              </FormItem>
              <FormItem label="是否有效" key="enabled" colon={false}>
                {getFieldDecorator('enabled', {
                  initialValue: 'true'
                })(
                  <Select className="input_width">
                    <Option value="" key="">
                      全部
                    </Option>
                    <Option value="true" key="true">
                      是
                    </Option>
                    <Option value="false" key="false">
                      否
                    </Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="角色类型" key="roleTypeId" colon={false}>
                {getFieldDecorator('roleTypeId', {
                  initialValue: ''
                })(
                  <Select className="input_width">
                    <Option value="">全部</Option>
                    {/* {roleTypeOption} */}
                    {CONFIG.jobPositionId &&
                      CONFIG.jobPositionId.map((item) => {
                        return (
                          <Option value={item} key={item}>
                            {CONFIG.jobPositionName[item]}
                          </Option>
                        );
                      })}
                  </Select>
                )}
              </FormItem>
            </div>
            <div className="form-btn-group">
              <Button type="primary" className="oa-btn" loading={loading} htmlType="submit">
                查询
              </Button>
              {CONFIG.hasAuthorityCreate ? (
                <Button type="primary" className="oa-btn" onClick={this.showStateManage}>
                  <Icon type="plus" />
                  增加角色
                </Button>
              ) : (
                ''
              )}

              {CONFIG.hasAuthorityManType ? (
                <Button type="primary" className="oa-btn" onClick={this.showReportTpeyMaint} style={{ width: 120 }}>
                  角色种类维护
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

export default connect(({ roleQuery }) => ({ roleQuery }))(Form.create()(RoleQuery));
