/*
 * @Description: 系统-权限管理
 * @Author: qianqian
 * @Date: 2019-02-18 12:05:37
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-03-01 14:30:18
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import 'styles/user/authorityQuery.less';
const { Modal, Form, Select, Input, Button, Icon, Table, message, LocaleProvider, zh_CN, Collapse } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
const AuthorityQueryModal = Form.create()((props) => {
  const { currentItem, modalVisible, handleModalCancel, handleModalOk, form, title, okText } = props;

  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 }
    }
  };
  //父权限类型的下拉
  const authorityTypeIdOption = CONFIG.authorityTypeId.map((item) => {
    return (
      <Option value={item} key={item}>
        {CONFIG.authorityTypeNameMap[item]}
      </Option>
    );
  });
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
        <FormItem {...formItemLayout} label="权限代码" key="authorityCode" className="formLable" colon={false}>
          {getFieldDecorator('authorityCode', {
            initialValue: currentItem.authorityCode,
            rules: [{ required: true, message: '请输入权限代码' }]
          })(<Input type="text" className="modal_input" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="权限名称" key="authorityName" className="formLable" colon={false}>
          {getFieldDecorator('authorityName', {
            initialValue: currentItem.authorityName,
            rules: [
              { required: true, message: '请输入权限名称' }
              // { max: 30, message: '最多只能输入30个字' },
            ]
          })(<Input type="text" className="modal_input" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="权限类型" key="authorityTypeId" className="formLable" colon={false}>
          {getFieldDecorator('authorityTypeId', {
            initialValue: currentItem.authorityTypeName ? currentItem.authorityTypeId : '',
            rules: [{ required: true, message: '请选择权限类型' }]
          })(<Select style={{ width: '202px' }}>{authorityTypeIdOption}</Select>)}
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

class AuthorityQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      showTable: false,
      loading: false, // 表格是否加载数据
      modifyId: [],

      authorityModalVisible: false, // 权限弹框显示隐藏控制参数
      authorityModalData: {
        authority: {},
        roleIdAndNameMap: {},
        roleIdAndNickNameMap: {},
        userList: []
      }
    };
  }
  // 取消
  handleModalCancel = () => {
    this.setState({
      modalVisible: false
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
  showModifyModal = (record) => {
    this.modalForm.resetFields();
    this.setState({
      modalType: 'modify',
      modalVisible: true,
      currentItem: record,
      modifyId: record.id
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
      let params;
      const authorityCode = values['authorityCode'];
      const authorityName = values['authorityName'];
      const authorityTypeId = values['authorityTypeId'];

      if (modalType === 'create') {
        params = {
          authorityCode,
          authorityName,
          authorityTypeId
        };
        this.createProcess(params);
      } else {
        const enabled = values['enabled'];
        params = {
          id: this.state.modifyId, //修改时传的id
          authorityCode,
          authorityName,
          authorityTypeId,
          enabled
        };
        this.modifyProcess(params);
      }
    });
  };
  //创建接口请求
  createProcess = (params) => {
    const url = `${T['userPath']}/authorityCreate.json`;

    T.post(url, params)
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
  //修改弹框的接口请求
  modifyProcess = (params) => {
    const url = `${T['userPath']}/authorityModify.json`;

    T.post(url, params)
      .then(() => {
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
  // 把模态框中的form传出来
  saveModalFormRef = (form) => {
    this.modalForm = form;
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

      const url = `${T['userPath']}/authorityQuery.json`;
      const id = values['id'] ? values['id'] : ''; //权限id
      const authorityCode = values['authorityCode'] ? values['authorityCode'] : ''; //权限代码
      const authorityName = values['authorityName'] ? values['authorityName'] : ''; //权限名称
      const enabled = values['enabled'];
      const authorityTypeId = values['authorityTypeId']; //权限类型

      const params = {
        id,
        authorityCode,
        authorityName,
        authorityTypeId,
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
          const pageList = data['pageList'];
          const list = pageList['list'] || [];

          //组装table的数据
          const itemList = list.map((item, index) => {
            const enabled = item.enabled === true ? '是' : '否';
            const listData = {
              key: `${index}`,
              id: item.id,
              authorityCode: item.authorityCode,
              authorityName: item.authorityName,
              authorityTypeName: CONFIG.authorityTypeNameMap[item.authorityTypeId],
              authorityTypeId: item.authorityTypeId,
              gmtCreate: item.gmtCreate,
              gmtModified: item.gmtModified,
              enabled: enabled
            };
            return listData;
          });
          const paginator = pageList['paginator'];

          if (list.length > 0) {
            this.setState({
              tableDataLists: itemList,
              loading: false,
              pagination: {
                ...this.state.pagination,
                total: paginator['items'],
                current: paginator['page'],
                pageSize: paginator['itemsPerPage']
              }
            });
          } else {
            this.setState({
              tableDataLists: [],
              loading: false,
              pagination: {
                ...this.state.pagination,
                total: paginator['items'],
                current: paginator['page'],
                pageSize: paginator['itemsPerPage']
              }
            });
          }
        })
        .catch((err) => {
          this.setState({ loading: false });
          T.showError(err);
        });
    });
  };

  showAuthorityDetailModal = (record) => {
    this.setState({
      authorityModalVisible: true
    });

    this.getAuthorityDetailQuery(record.id);
  };

  handleAuthorityDetailOk = () => {
    this.setState({
      authorityModalVisible: false
    });
  };

  handleAuthorityDetailCancel = () => {
    this.setState({
      authorityModalVisible: false
    });
  };

  getAuthorityDetailQuery = (authorityId) => {
    const params = {
      authorityId
    };
    const url = `${T['userPath']}/authorityDetailQuery.json`;
    //请求查询接口
    T.get(url, params)
      .then((data) => {
        const authority = data.authority;
        const roleIdAndNameMap = data.roleIdAndNameMap;
        const roleIdAndNickNameMap = data.roleIdAndNickNameMap;
        const userList = data.userNickNames;

        this.setState({
          authorityModalData: {
            authority,
            roleIdAndNameMap,
            roleIdAndNickNameMap,
            userList
          }
        });
      })
      .catch((err) => {
        T.showError(err);
      });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible, modalType, tableDataLists, currentItem, showTable, loading, authorityModalData } = this.state;
    const { authority, roleIdAndNameMap, roleIdAndNickNameMap, userList } = authorityModalData;
    const roleIdArr = Object.keys(roleIdAndNameMap);
    const modalMap = {
      create: {
        title: '创建权限',
        okText: '创建',
        isCreate: true
      },
      modify: {
        title: '修改权限',
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
    //流行类型id
    const authorityTypeIdOption = CONFIG.authorityTypeId.map((item) => {
      return (
        <Option value={item} key={item}>
          {CONFIG.authorityTypeNameMap[item]}
        </Option>
      );
    });
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        className: 'table-center',
        render: (text, record) => {
          return (
            <span className="modify-span" onClick={() => this.showAuthorityDetailModal(record)}>
              {text}
            </span>
          );
        }
      },
      {
        title: '权限代码',
        dataIndex: 'authorityCode',
        className: 'table-center'
      },
      {
        title: '权限名称',
        dataIndex: 'authorityName',
        className: 'table-center'
      },
      {
        title: '权限类型',
        dataIndex: 'authorityTypeName',
        className: 'table-center'
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        className: 'table-center'
      },
      {
        title: '修改时间',
        dataIndex: 'gmtModified',
        className: 'table-center'
      },
      {
        title: '是否有效',
        dataIndex: 'enabled',
        className: 'table-center'
      },
      {
        title: CONFIG.hasAuthority ? '操作' : '',
        dataIndex: 'operate',
        render: (text, record, index) => {
          return (
            <div>
              {CONFIG.hasAuthority ? (
                <span className="i_block modify-span" onClick={() => this.showModifyModal(record, index)}>
                  修改
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
          <AuthorityQueryModal {...modalConfig} ref={this.saveModalFormRef} />
          <Modal
            title="权限信息"
            visible={this.state.authorityModalVisible}
            onOk={this.handleAuthorityDetailOk}
            onCancel={this.handleAuthorityDetailCancel}
            width={600}
          >
            <p>权限名字：{authority.authorityName}</p>
            <p>权限code：{authority.authorityCode}</p>
            <p style={{ borderBottom: '1px solid #d9d9d9', paddingBottom: 20 }}>
              权限typeId：{authority.authorityTypeId}
            </p>

            <Collapse bordered={false} defaultActiveKey={['0']}>
              {roleIdArr.map((item, index) => {
                return (
                  <Panel header={`角色名：${roleIdAndNameMap[item]}`} key={index}>
                    {
                      <p style={{ paddingLeft: 24 }}>
                        {roleIdAndNickNameMap[item] && roleIdAndNickNameMap[item].length > 0
                          ? roleIdAndNickNameMap[item].join(',')
                          : '-'}
                      </p>
                    }
                  </Panel>
                );
              })}
              <Panel header="单独有这个权限的人" key={roleIdArr.length}>
                <p style={{ paddingLeft: 24 }}>
                  {userList.length > 0
                    ? userList.map((item) => {
                        return <span style={{ paddingRight: 10 }}>{item}</span>;
                      })
                    : '-'}
                </p>
              </Panel>
            </Collapse>
          </Modal>
          <Form
            layout="inline"
            onSubmit={this.handleSubmit}
            className="antd_form_horizontal main-content-tranche form-inline"
          >
            <div>
              <FormItem label="权限id" key="id" colon={false}>
                {getFieldDecorator('id', {
                  initialValue: ''
                })(<Input className="input_width" type="text" />)}
              </FormItem>
              <FormItem label="权限代码" key="authorityCode" colon={false}>
                {getFieldDecorator('authorityCode', {
                  initialValue: ''
                })(<Input className="input_width" type="text" />)}
              </FormItem>
              <FormItem label="权限名称" key="authorityName" colon={false}>
                {getFieldDecorator('authorityName', {
                  initialValue: ''
                })(<Input className="input_width" type="text" />)}
              </FormItem>
              <FormItem label="权限类型" key="authorityTypeId" colon={false}>
                {getFieldDecorator('authorityTypeId', {
                  initialValue: ''
                })(
                  <Select className="input_width">
                    <Option value="">全部</Option>
                    {authorityTypeIdOption}
                  </Select>
                )}
              </FormItem>
            </div>
            <div>
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
            </div>
            <div className="form-btn-group">
              <Button type="primary" className="oa-btn" htmlType="submit">
                查询
              </Button>
              <Button type="primary" className="oa-btn" onClick={this.showCreateFlowModal}>
                <Icon type="plus" />
                创建权限
              </Button>
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
const WrapAuthorityQuery = Form.create()(AuthorityQuery);
ReactDOM.render(<WrapAuthorityQuery />, document.getElementById('root'));
