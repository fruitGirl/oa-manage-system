/*
 * @Description: 系统-权限类型管理
 * @Author: qianqian
 * @Date: 2019-02-18 11:51:54
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-03-01 14:51:07
 */
import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
const { Form, Button, Icon, Table, message, Modal, Input, Select, LocaleProvider, zh_CN } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
const AuthorityTypeQueryModal = Form.create()((props) => {
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
  const parentTypeOption = CONFIG.authorityTypeId.map((item, index) => {
    return (
      <Option value={item} key={item}>
        {CONFIG.authorityTypeName[index]}
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
        <FormItem {...formItemLayout} label="权限类型代码" key="authorityTypeCode" className="formLable" colon={false}>
          {getFieldDecorator('authorityTypeCode', {
            initialValue: currentItem.authorityTypeCode,
            rules: [{ required: true, message: '请输入权限类型代码' }, { max: 30, message: '最多只能输入30个字' }]
          })(<Input type="text" className="modal_input" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="权限类型名" key="authorityTypeName" className="formLable" colon={false}>
          {getFieldDecorator('authorityTypeName', {
            initialValue: currentItem.authorityTypeName,
            rules: [
              { required: true, message: '请输入权限类型名' }
              // { max: 30, message: '最多只能输入30个字' },
            ]
          })(<Input type="text" className="modal_input" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="父权限类型" key="parentTypeId" className="formLable" colon={false}>
          {getFieldDecorator('parentTypeId', {
            initialValue: currentItem.parentTypeId === '0' ? '' : currentItem.parentTypeId,
            rules: [
              // { required: true, message: '请选择父权限类型' },
            ]
          })(<Select style={{ width: '202px' }}>{parentTypeOption}</Select>)}
        </FormItem>
        {okText === '修改' ? (
          <FormItem {...formItemLayout} label="是否有效" key="enabled" className="formLable" colon={false}>
            {getFieldDecorator('enabled', {
              initialValue: currentItem.enabled === '有效' ? 'true' : 'false',
              rules: [
                { required: true, message: '请选择是否有效' }
                // { max: 30, message: '最多只能输入30个字' },
              ]
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

class AuthorityTypeQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalType: 'create',
      currentItem: {}, //当前编辑的项,
      parentTypeChange: false
    };
  }

  handleModalCancel = () => {
    this.setState({
      modalVisible: false
    });
  };
  // 创建
  showCreateFlowModal = () => {
    this.modalForm.resetFields();
    this.setState({
      modalVisible: true,
      modalType: 'create',
      currentItem: {}
    });
  };
  // 修改模态框
  showModifyModal = (record, modifyId) => {
    this.modalForm.resetFields();
    this.id = modifyId;
    this.setState({
      modalType: 'modify',
      modalVisible: true,
      currentItem: record
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
      const authorityTypeCode = values['authorityTypeCode'];
      const authorityTypeName = values['authorityTypeName'];
      const parentTypeId = values['parentTypeId'];
      if (modalType === 'create') {
        params = {
          authorityTypeCode,
          authorityTypeName,
          parentTypeId
        };
        this.getCreateForm(params);
      } else {
        const enabled = values['enabled'];
        params = {
          id: this.id, //修改时传的id
          authorityTypeCode,
          authorityTypeName,
          parentTypeId,
          enabled
        };
        this.getModifyForm(params);
      }
    });
  };

  // 把模态框中的form传出来
  saveModalFormRef = (form) => {
    this.modalForm = form;
  };

  //创建的接口请求
  getCreateForm(params) {
    const url = `${T['userPath']}/authorityTypeCreate.json`;
    T.post(url, params)
      .then((data) => {
        message.success('创建成功');
        setTimeout(() => {
          window.location.reload(true);
        }, 2000);
      })
      .catch((err) => {
        T.showError(err);
      });
  }
  //修改的接口请求
  getModifyForm(params) {
    const url = `${T['userPath']}/authorityTypeModify.json`;
    T.post(url, params)
      .then((data) => {
        //请求成功

        message.success('修改成功');
        setTimeout(() => {
          window.location.reload(true);
        }, 2000);
      })
      .catch((err) => {
        T.showError(err);
      });
  }
  render() {
    const { modalVisible, modalType, currentItem } = this.state;

    const modalMap = {
      create: {
        title: '创建权限类型',
        okText: '创建'
      },
      modify: {
        title: '修改权限类型',
        okText: '修改'
      }
    };
    //模态框的属性
    const modalConfig = {
      handleModalOk: this.handleModalOk,
      handleModalCancel: this.handleModalCancel,
      title: modalMap[modalType]['title'],
      okText: modalMap[modalType]['okText'],
      modalVisible,
      currentItem
    };
    const tableData = CONFIG.authorityTypeId.map((item, index) => {
      const data = [
        {
          key: `${index}`,
          id: CONFIG.authorityTypeId[index],
          parentTypeId: CONFIG.parentTypeId[index], //父权限类型id
          authorityTypeCode: CONFIG.authorityTypeCode[index],
          authorityTypeName: CONFIG.authorityTypeName[index],
          parentTypeName: CONFIG.parentTypeName[index], //父权限类型名字
          gmtCreate: CONFIG.gmtCreate[index],
          gmtModified: CONFIG.gmtModified[index],
          enabled: CONFIG.enabled[index] === 'true' ? '有效' : '无效'
        }
      ];
      return data[0];
    });
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        className: 'text-center'
      },
      {
        title: '权限类型代码',
        dataIndex: 'authorityTypeCode',
        className: 'table-center'
      },
      {
        title: '权限类型名',
        dataIndex: 'authorityTypeName',
        className: 'table-center'
      },
      {
        title: '父权限类型',
        dataIndex: 'parentTypeName',
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
        className: 'table-center text-gray9'
      },
      {
        title: '是否有效',
        dataIndex: 'enabled',
        className: 'table-center text-gray9'
      },
      {
        title: CONFIG.hasAuthority ? '操作' : '',
        dataIndex: 'operate',
        render: (text, record) => {
          const modifyId = record['id'];
          return (
            <div>
              {CONFIG.hasAuthority ? (
                <span>
                  <span
                    className="i_block modify-span"
                    style={{ marginRight: '15px' }}
                    onClick={() => this.showModifyModal(record, modifyId)}
                  >
                    修改
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
          <AuthorityTypeQueryModal {...modalConfig} ref={this.saveModalFormRef} />

          {CONFIG.hasAuthority ? (
            <div>
              <div className="main-content">
                <Button
                  type="primary"
                  className="oa-btn"
                  onClick={this.showCreateFlowModal}
                  style={{ width: 130, marginBottom: 15 }}
                >
                  <Icon type="plus" />
                  创建权限类型
                </Button>
              </div>
              <div className="ant-table-wrapper bg-white">
                <Table columns={columns} dataSource={tableData} pagination={false} />
              </div>
            </div>
          ) : (
            <div className="ant-table-wrapper bg-white">
              <Table columns={columns} dataSource={tableData} pagination={false} />
            </div>
          )}
        </BasicLayout>
      </LocaleProvider>
    );
  }
}

export default connect(({ authorityTypeQuery }) => ({ authorityTypeQuery }))(Form.create()(AuthorityTypeQuery));
