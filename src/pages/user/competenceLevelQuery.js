/*
 * @Description: 系统-职级管理
 * @Author: qianqian
 * @Date: 2019-02-13 17:20:10
 * @Last Modified by: lanlan
 * @Last Modified time: 2019-02-25 16:16:02
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import 'styles/user/competenceLevelQuery.less';
const { Form, Button, Icon, Table, message, Modal, Input, Select, LocaleProvider, zh_CN } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
const CompetenceLevelQueryModal = Form.create()((props) => {
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
        <FormItem {...formItemLayout} label="职级名称" key="name" className="formLable" colon={false}>
          {getFieldDecorator('name', {
            initialValue: currentItem.competenceLevelName,
            rules: [{ required: true, message: '请输入职级名称' }, { max: 30, message: '最多只能输入30个字' }]
          })(<Input type="text" className="modal_input" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="职级代码" key="code" className="formLable" colon={false}>
          {getFieldDecorator('code', {
            initialValue: currentItem.competenceLevelCode,
            rules: [
              { required: true, message: '请输入职级代码' }
              // { max: 30, message: '最多只能输入30个字' },
            ]
          })(<Input type="text" className="modal_input" />)}
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
class CompetenceLevelQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalType: 'create',
      currentItem: {} //当前编辑的项,
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
      const name = values['name'];
      const code = values['code'];
      if (modalType === 'create') {
        params = {
          name,
          code
        };
        this.getCreateForm(params);
      } else {
        const enabled = values['enabled'];
        params = {
          id: this.id,
          name,
          code,
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
    const url = `${T['userPath']}/competenceLevelCreate.json`;
    T.post(url, params)
      .then((data) => {
        //请求成功
        if (data.success) {
          message.success('创建成功');
          setTimeout(() => {
            window.location.reload(true);
          }, 2000);
        } else {
          T.showError(data);
        }
      })
      .catch((err) => {
        T.showError(err);
        throw err;
      });
  }
  //修改的接口请求
  getModifyForm(params) {
    const url = `${T['userPath']}/competenceLevelModifyById.json`;
    T.post(url, params)
      .then((data) => {
        //请求成功
        if (data.success) {
          message.success('修改成功');
          setTimeout(() => {
            window.location.reload(true);
          }, 2000);
        } else {
          T.showError(data);
        }
      })
      .catch((err) => {
        T.showError(err);
        throw err;
      });
  }
  render() {
    const { modalVisible, modalType, currentItem } = this.state;

    const modalMap = {
      create: {
        title: '创建职级',
        okText: '创建'
      },
      modify: {
        title: '修改职级',
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
    const tableData = CONFIG.competenceLevelId.map((item, index) => {
      const data = [
        {
          key: `${index}`,
          id: CONFIG.competenceLevelId[index],
          competenceLevelName: CONFIG.competenceLevelName[index],
          competenceLevelCode: CONFIG.competenceLevelCode[index],
          gmtCreate: CONFIG.gmtCreate[index],
          gmtModified: CONFIG.gmtModified[index],
          enabled: CONFIG.enabled[index] === 'true' ? '有效' : '无效'
        }
      ];
      return data[0];
    });

    const columns = [
      {
        title: '职级名称',
        dataIndex: 'competenceLevelName',
        className: 'text-center'
      },
      {
        title: '职级代码',
        dataIndex: 'competenceLevelCode',
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
                <span
                  className="i_block modify-span"
                  style={{ marginRight: '15px' }}
                  onClick={() => this.showModifyModal(record, modifyId)}
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

    return (
      <LocaleProvider locale={zh_CN}>
        <BasicLayout>
          {CONFIG.hasAuthority ? (
            <Button type="primary" className="oa-btn" onClick={this.showCreateFlowModal}>
              <Icon type="plus" />
              创建职级
            </Button>
          ) : (
            ''
          )}
          <div style={{ marginTop: 20 }}>
            <Table columns={columns} dataSource={tableData} pagination={false} />
          </div>
          <CompetenceLevelQueryModal {...modalConfig} ref={this.saveModalFormRef} />
        </BasicLayout>
      </LocaleProvider>
    );
  }
}

const WrappedCompetenceLevelQueryForm = Form.create()(CompetenceLevelQuery);
const mountNode = document.getElementById('root');

ReactDOM.render(<WrappedCompetenceLevelQueryForm />, mountNode);
