/*
 * @Description: 系统-权限控制查询
 * @Author: qianqian
 * @Date: 2019-02-18 15:34:33
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-23 20:41:07
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
const { LocaleProvider, zh_CN, Form, Input, Button, Table, Select, message, Modal, Icon } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
const powerObject = CONFIG.option.powerObject;

const AuthorityModal = Form.create()((props) => {
  const { getFieldDecorator } = props.form;
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
  };
  const { title, visible, onOk, confirmLoading, onCancel, okText } = props;

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onOk}
      okText={okText}
      width={460}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
    >
      <Form hideRequiredMark={true}>
        <FormItem label="权限代码" {...formItemLayout}>
          {getFieldDecorator('authorityCode', {
            initialValue: '',
            rules: [{ required: true, message: '请输入权限代码' }]
          })(<Input />)}
        </FormItem>
        <FormItem label="限制url" {...formItemLayout}>
          {getFieldDecorator('limitUrl', {
            initialValue: '',
            rules: [{ required: true, message: '请输入限制url' }]
          })(<Input />)}
        </FormItem>
        {okText === '修改' ? (
          <FormItem label="是否有效" {...formItemLayout}>
            {getFieldDecorator('enabled', {
              initialValue: ''
              // rules:[{required:true,message:'请输入限制url'}]
            })(
              <Select style={{ width: '240px' }}>
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
class App extends React.Component {
  state = {
    dataSource: [],
    pagination: null,
    tableLoading: false,
    createBtnLoading: false,
    createVisible: false,
    modifyVisible: false,
    modifyBtnLoading: false,
    showTable: false,
    currentModifyInfo: {}
  };
  submitHandler = (e, currentPage = 1, pageSize = 10) => {
    if (e) {
      e.preventDefault();
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Object.assign(values, { currentPage, pageSize });
        this.getTableData(values);
      }
    });
  };
  getTableData = (values) => {
    this.setState({
      tableLoading: true
    });
    T.post(CONFIG.option.queryUrl, values)
      .then((data) => {
        let result = data.authorityControlPageQueryResult;
        let list = result.list;

        this.setState({
          dataSource: list,
          pagination: {
            current: result.paginator.page,
            pageSize: result.paginator.itemsPerPage,
            total: result.paginator.items
          }
        });

        this.setState({
          tableLoading: false,
          showTable: true
        });
      })
      .catch((err) => {
        T.showError(err);
        this.setState({
          tableLoading: false,
          showTable: true
        });
      });
  };
  showCreateModal = () => {
    this.setState({
      createVisible: true
    });
    this.createForm.resetFields();
  };
  closeCreateModal = () => {
    this.setState({
      createVisible: false
    });
  };
  createAuthority = () => {
    this.createForm.validateFields((err, values) => {
      if (err) return;
      this.setState({
        createBtnLoading: true
      });
      T.post(CONFIG.option.createUrl, values)
        .then((data) => {
          this.setState({
            createVisible: false
          });
          message.success('创建成功');

          this.setState({
            createBtnLoading: false
          });
        })
        .catch((err) => {
          this.setState({
            createBtnLoading: false
          });
          T.showError(err);
        });
    });
  };
  showModifyModal = (info) => {
    this.setState({
      currentModifyInfo: {
        id: info.id
      },
      modifyVisible: true
    });

    let form = this.modifyForm;
    form.setFieldsValue({ authorityCode: info.authorityCode });
    form.setFieldsValue({ limitUrl: info.limitUrl });
    form.setFieldsValue({ enabled: `${info.modifyEnabled}` });
  };

  closeModifyModal = () => {
    this.setState({
      modifyVisible: false
    });
  };
  modifyAuthority = () => {
    this.modifyForm.validateFields((err, values) => {
      if (err) return;
      this.setState({
        modifyBtnLoading: true
      });

      Object.assign(values, {
        id: this.state.currentModifyInfo.id
      });
      T.post(CONFIG.option.modifyUrl, values)
        .then((data) => {
          let list = this.state.dataSource;
          list.forEach((item) => {
            if (item.id === values.id) {
              item = Object.assign(item, values);
            }
          });
          this.setState({
            modifyVisible: false,
            dataSource: list,
            modifyBtnLoading: false
          });
          message.success('修改成功');
        })
        .catch((err) => {
          this.setState({
            modifyBtnLoading: false
          });
          T.showError(err);
        });
    });
  };
  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 }
    };
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id'
      },
      {
        title: '权限代码',
        dataIndex: 'authorityCode'
      },
      {
        title: '限制url',
        dataIndex: 'limitUrl'
      },
      {
        title: '是否有效',
        dataIndex: 'enabled',
        render: (text, record) => {
          return record.enabled ? '是' : '否';
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return powerObject.authorityManage ? (
            <a
              onClick={() =>
                this.showModifyModal({
                  id: record.id,
                  authorityCode: record.authorityCode,
                  limitUrl: record.limitUrl,
                  modifyEnabled: record.enabled
                })
              }
            >
              修改
            </a>
          ) : null;
        }
      }
    ];
    return (
      <React.Fragment>
        <Form onSubmit={this.submitHandler} className="form-inline" layout="inline">
          <div className="ant-row">
            <FormItem label="权限代码" {...formItemLayout}>
              {getFieldDecorator('authorityCode', { initialValue: '' })(<Input />)}
            </FormItem>
            <FormItem label="是否有效" {...formItemLayout}>
              {getFieldDecorator('enabled', { initialValue: 'true' })(
                <Select style={{ width: '120px' }}>
                  <Option value="">全部</Option>
                  <Option value="true">是</Option>
                  <Option value="false">否</Option>
                </Select>
              )}
            </FormItem>
          </div>
          <div className="ant-row">
            <FormItem labelCol={{ span: 6 }} label=" " colon={false} style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" style={{ width: '120px' }} loading={this.state.tableLoading}>
                查询
              </Button>
              {powerObject.authorityManage ? (
                <Button type="primary" style={{ width: '120px', marginLeft: '20px' }} onClick={this.showCreateModal}>
                  <Icon type="plus" />
                  创建权限
                </Button>
              ) : null}
            </FormItem>
          </div>
        </Form>
        {this.state.showTable ? (
          <Table
            className="bg-white"
            columns={columns}
            loading={this.state.tableLoading}
            rowKey={(record) => record.id}
            onChange={(pagination) => this.submitHandler(null, pagination.current, pagination.pageSize)}
            dataSource={this.state.dataSource}
            pagination={{
              ...this.state.pagination,
              // showSizeChanger:true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`
              // pageSizeOptions:['10','50','100','500']
            }}
          />
        ) : null}
        {/* 创建权限 */}
        <AuthorityModal
          visible={this.state.createVisible}
          okText="创建"
          title="创建权限"
          onCancel={this.closeCreateModal}
          onOk={this.createAuthority}
          confirmLoading={this.state.createBtnLoading}
          ref={(form) => (this.createForm = form)}
        />
        {/* 修改权限 */}
        <AuthorityModal
          visible={this.state.modifyVisible}
          okText="修改"
          title="修改权限"
          onCancel={this.closeModifyModal}
          onOk={this.modifyAuthority}
          confirmLoading={this.state.modifyBtnLoading}
          ref={(form) => (this.modifyForm = form)}
        />
      </React.Fragment>
    );
  }
}
const WrapApp = Form.create()(App);

ReactDOM.render(
  <LocaleProvider locale={zh_CN}>
    <BasicLayout>
      <WrapApp />
    </BasicLayout>
  </LocaleProvider>,
  document.getElementById('root')
);
