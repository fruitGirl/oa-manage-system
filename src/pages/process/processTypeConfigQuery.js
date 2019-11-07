/*
 * @Description: 流程-流程类型配置
 * @Author: qianqian
 * @Date: 2019-02-11 18:21:57
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-27 17:07:57
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import 'styles/process/processTypeConfigQuery.less';
const { LocaleProvider, Form, Button, Icon, Table, message, Modal, Input, Select, zh_CN } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
const FlowTypeConfigModal = Form.create()((props) => {
  const { currentItem, modalVisible, handleModalCancel, handleModalOk, form, title, okText, isCreate } = props;

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
        <FormItem {...formItemLayout} label="类型代码" key="code" className="formLable" colon={false}>
          {getFieldDecorator('code', {
            initialValue: isCreate === true ? '' : currentItem.typeCode,
            rules: [{ required: true, message: '请填写类型代码' }, { max: 30, message: '最多只能输入30个字' }]
          })(<Input type="text" className="modal_input" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="类型名" key="name" className="formLable" colon={false}>
          {getFieldDecorator('name', {
            initialValue: isCreate === true ? '' : currentItem.typeName,
            rules: [{ required: true, message: '请输入类型名' }, { max: 30, message: '最多只能输入30个字' }]
          })(<Input type="text" className="modal_input" />)}
        </FormItem>
        {isCreate === true ? (
          ''
        ) : (
          <FormItem {...formItemLayout} label="是否有效" key="enabled" className="formLable" colon={false}>
            {getFieldDecorator('enabled', {
              initialValue: currentItem.isValid === '是' ? 'true' : 'false',
              rules: [{ required: true, message: '请选择是否有效' }]
            })(
              <Select style={{ width: '202px' }}>
                <Option value="true">是</Option>
                <Option value="false">否</Option>
              </Select>
            )}
          </FormItem>
        )}
      </Form>
    </Modal>
  );
});
class FlowTypeConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalType: 'create',
      currentItem: {}, //当前编辑的项,
      idList: CONFIG.idArr
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
  showModifyModal = (record, index) => {
    this.modalForm.resetFields();
    this.modifyIndex = index;
    this.setState({
      modalType: 'modify',
      modalVisible: true,
      currentItem: record
    });
    this.id = CONFIG.idArr[index];
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
        // this.getCreateForm(values);
        this.getCreateOrModiyfData(values, true);
      } else {
        const codeVal = values['code'];
        const nameVal = values['name'];
        const enabledVal = values['enabled'] === 'true' ? true : false;

        const params = {
          id: this.id,
          code: codeVal,
          name: nameVal,
          enabled: enabledVal
        };
        // this.getModifyForm(params);
        this.getCreateOrModiyfData(params, false);
      }
    });
  };

  // 把模态框中的form传出来
  saveModalFormRef = (form) => {
    this.modalForm = form;
  };

  // //创建的接口请求
  // getCreateForm(params) {
  // 	const url = `${T['processPath']}/processTypeConfigCreate.json`;
  // 		axios(url,{
  // 			method: 'POST',
  // 			params,
  // 		})
  // 		.then((response) => {
  // 			//请求成功
  // 			if(response.data.success) {
  // 				message.success('创建成功');
  // 				setTimeout(() => {
  // 					window.location.reload(true);
  // 				}, 2000);
  // 			}else {
  // 				T.showError(response.data);
  // 			}
  // 		})
  // 		.catch((err) => {
  // 			T.showError('系统报错');
  // 			throw err;
  // 	});
  // }
  // //修改的接口请求
  // getModifyForm(params) {
  // 	const url = `${T['processPath']}/processTypeConfigModifyById.json`;
  //   axios(url,{
  //     method: 'POST',
  //     params,
  //   })
  //   .then((response) => {
  //     //请求成功
  //     if(response.data.success) {
  //       message.success('修改成功');
  //       setTimeout(() => {
  //         window.location.reload(true);
  //       }, 2000);
  //     }else {

  //       T.showError(response.data);
  //     }
  //   })
  //   .catch((err) => {
  //     T.showError('系统报错');
  //     throw err;
  //  });
  // }

  //创建、修改弹框的接口数据请求
  getCreateOrModiyfData = (params, isCreate) => {
    const url = isCreate
      ? `${T['processPath']}/processTypeConfigCreate.json`
      : `${T['processPath']}/processTypeConfigModifyById.json`;
    const text = isCreate ? '创建成功' : '修改成功';

    T.post(url, params)
      .then((data) => {
        //请求成功
        message.success(text);
        setTimeout(() => {
          window.location.reload(true);
        }, 2000);
      })
      .catch((err) => {
        T.showError(err);
      });
  };
  render() {
    const { modalVisible, modalType, currentItem, idList } = this.state;

    const modalMap = {
      create: {
        title: '创建流程任务模板',
        okText: '创建',
        isCreate: true
      },
      modify: {
        title: '修改流程任务模板',
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
    const columns = [
      {
        title: '类型代码',
        dataIndex: 'typeCode',
        className: 'text-center'
      },
      {
        title: '类型名',
        dataIndex: 'typeName',
        className: 'table-center'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        className: 'table-center'
      },
      {
        title: '修改时间',
        dataIndex: 'modifyTime',
        className: 'table-center'
      },
      {
        title: '是否有效',
        dataIndex: 'isValid',
        className: 'table-center'
      },
      {
        title: CONFIG.hasAuthority ? '操作' : '',
        dataIndex: 'operate',
        render: (text, record, index) => {
          return (
            <div>
              {CONFIG.hasAuthority ? (
                <span
                  className="i_block modify-span"
                  id={idList[index]}
                  onClick={() => this.showModifyModal(record, index)}
                >
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
    const tableData = idList.map((item, index) => {
      const enabledV = CONFIG.enabledArr[index] === 'true' ? '是' : '否';
      const data = [
        {
          key: `${index}`,
          typeCode: CONFIG.codeArr[index],
          typeName: CONFIG.nameArr[index],
          createTime: CONFIG.gmtCreateArr[index],
          modifyTime: CONFIG.gmtModifiedArr[index],
          isValid: enabledV
        }
      ];
      return data[0];
    });

    return (
      <LocaleProvider locale={zh_CN}>
        <div>
          <FlowTypeConfigModal {...modalConfig} ref={this.saveModalFormRef} />
          {/* {CONFIG.hasAuthority ?
					<div className="main-content">
						<Button	type="primary" className="oa-btn" onClick={this.showCreateFlowModal}><Icon type="plus" />创建流程类型</Button>
					</div> : ''} */}

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
                  创建流程类型
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
        </div>
      </LocaleProvider>
    );
  }
}
const WrappedFlowTypeConfig = Form.create()(FlowTypeConfig);

ReactDOM.render(
  <BasicLayout>
    <WrappedFlowTypeConfig />
  </BasicLayout>,
  document.getElementById('root')
);
