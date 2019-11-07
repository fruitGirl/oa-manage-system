/*
 * @Description: 系统-令牌设置
 * @Author: qianqian
 * @Date: 2019-02-18 15:59:50
 * @Last Modified by: lanlan
 * @Last Modified time: 2019-02-25 20:04:35
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
const {
  Form,
  Input,
  DatePicker,
  Button,
  Table,
  Icon,
  message,
  Radio,
  Select,
  Modal,
  InputNumber,
  LocaleProvider,
  zh_CN
} = window.antd;

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;

const getTypeOption = (list) => {
  return list.map((i) => (
    <Option key={i.id} value={i.id}>
      {i.value}
    </Option>
  ));
};

// 变更类型
const getTokenTypeOption = getTypeOption(CONFIG.tokenTypeList);

const UserTokenQueryModal = Form.create()((props) => {
  const {
    currentItem,
    modalVisible,
    handleModalCancel,
    handleModalOk,
    form,
    title,
    okText,
    getTokenTypeOption
  } = props;

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
      <Form className="form-flex formLable">
        {getFieldDecorator('id', {
          initialValue: currentItem.id
        })(<input type="hidden" />)}
        <FormItem label="花名" colon={false} key="nickName">
          {getFieldDecorator('nickName', {
            initialValue: currentItem.nickName,
            rules: [
              { required: true, message: '花名不能为空' }
              //  { pattern: T.cell(), message:'请输入正确的手机号' }
            ]
          })(<Input style={{ width: 230 }} />)}
        </FormItem>

        <FormItem label="令牌" colon={false} key="token">
          {getFieldDecorator('token', {
            initialValue: currentItem.token,
            rules: [{ required: true, message: '令牌不能为空' }]
          })(<Input style={{ width: 230 }} />)}
        </FormItem>

        <FormItem label="令牌类型" key="tokenType" colon={false}>
          {getFieldDecorator('tokenType', {
            initialValue: currentItem.tokenType || '',
            rules: [{ required: true, message: '令牌类型不能为空' }]
          })(
            <Select placeholder="请选择" style={{ width: 230 }}>
              {getTokenTypeOption}
              {/* <Option value="WEIXIN_TOKEN">微信令牌</Option>
                <Option value="CELL_TOKEN">手机令牌</Option> */}
            </Select>
          )}
        </FormItem>
        {currentItem.id ? (
          <FormItem label="是否有效" colon={false} key="enabled">
            {getFieldDecorator('enabled', {
              initialValue: currentItem.enabled
            })(
              <RadioGroup>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
        ) : (
          ''
        )}
      </Form>
    </Modal>
  );
});

class UserTokenQueryForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowTable: false,
      loading: false,
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
      tokenType: ''
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
    const { modalType } = this.state;
    const modalForm = this.modalForm;
    modalForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      modalForm.resetFields();
      this.setState({ modalVisible: false });

      let url, messageTip;
      if (modalType === 'create') {
        url = CONFIG.userTokenCreate;
        messageTip = '创建';
      } else {
        url = CONFIG.userTokenModify;
        messageTip = '修改';
      }

      this.createProcessTaskTemplate({
        url,
        values,
        messageTip
      });
    });
  };

  // 请求创建,修改接口
  createProcessTaskTemplate = ({ url, values, messageTip }) => {
    T.post(url, values)
      .then(() => {
        message.success(`${messageTip}成功`);
        setTimeout(() => {
          if (messageTip === '修改') {
            const currentPage = this.state.pagination.current;
            this.handleSubmit(null, currentPage);
          } else {
            this.handleSubmit(null);
          }
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

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const url = CONFIG.userTokenQueryJsonUrl;

      const id = fieldsValue['id'] ? fieldsValue['id'] : '';
      const tokenType = fieldsValue['tokenType'] ? fieldsValue['tokenType'] : '';
      // const cell = fieldsValue['cell'] ? fieldsValue['cell'] : '' ;
      const nickName = fieldsValue['nickName'] ? fieldsValue['nickName'] : '';
      const enabled = fieldsValue['enabled'];
      const minFailedCount = fieldsValue['minFailedCount'] ? fieldsValue['minFailedCount'] : 0;
      const maxFailedCount = fieldsValue['maxFailedCount'] ? fieldsValue['maxFailedCount'] : 0;

      const gmtCreate = fieldsValue['gmtCreate'] ? fieldsValue['gmtCreate'] : '';
      const gmtModified = fieldsValue['gmtModified'] ? fieldsValue['gmtModified'] : '';
      const gmtLastFailed = fieldsValue['gmtLastFailed'] ? fieldsValue['gmtLastFailed'] : '';
      const minGmtCreate = gmtCreate.length !== 0 ? gmtCreate[0].format('YYYY-MM-DD HH:mm:ss') : '';
      const maxGmtCreate = gmtCreate.length !== 0 ? gmtCreate[1].format('YYYY-MM-DD HH:mm:ss') : '';
      const minGmtModified = gmtModified.length !== 0 ? gmtModified[0].format('YYYY-MM-DD HH:mm:ss') : '';
      const maxGmtModified = gmtModified.length !== 0 ? gmtModified[1].format('YYYY-MM-DD HH:mm:ss') : '';
      const minGmtLastFailed = gmtLastFailed.length !== 0 ? gmtLastFailed[0].format('YYYY-MM-DD HH:mm:ss') : '';
      const maxGmtLastFailed = gmtLastFailed.length !== 0 ? gmtLastFailed[1].format('YYYY-MM-DD HH:mm:ss') : '';

      const params = {
        id,
        tokenType,
        // cell,
        nickName,
        enabled,
        minFailedCount,
        maxFailedCount,
        minGmtCreate,
        maxGmtCreate,
        minGmtModified,
        maxGmtModified,
        minGmtLastFailed,
        maxGmtLastFailed,
        currentPage
      };

      this.setState({
        loading: true
      });

      // 查询
      T.post(url, params)
        .then((data) => this.querySuccess(data))
        .catch((err) => {
          this.setState({
            loading: false
          });
          T.showError(err);
        });
    });
  };

  // 查询成功后的操作
  querySuccess = (data) => {
    const result = data['result'];
    const list = result['list'];
    const paginator = result['paginator'];
    this.setState({
      pagination: {
        ...this.state.pagination,
        total: paginator['items'],
        current: paginator['page'],
        pageSize: paginator['itemsPerPage']
      }
    });
    if (list.length > 0) {
      this.setState({ tableDataLists: list });
    } else {
      this.setState({ tableDataLists: [] });
    }

    if (!this.state.isShowTable) {
      this.setState({
        isShowTable: true
      });
    }
    this.setState({ loading: false });
  };

  // 创建流程任务模板
  showCreateModal = () => {
    this.setState({
      modalVisible: true,
      modalType: 'create',
      currentItem: {}
    });
  };

  showModifyModal = (record, index) => {
    this.modifyIndex = index;
    this.setState({
      modalType: 'modify',
      modalVisible: true,
      currentItem: record
    });
  };

  saveModalFormRef = (form) => {
    this.modalForm = form;
  };

  handlePageSubmit = (pagination, filters, sorter) => {
    this.handleSubmit(null, pagination.current);
  };

  render() {
    const {
      modalVisible,
      modalType,
      tableDataLists,
      currentItem,
      pagination,
      isShowTable,
      loading,
      tokenType
    } = this.state;

    const modalMap = {
      create: {
        title: '创建令牌',
        okText: '创建'
      },
      modify: {
        title: '修改令牌',
        okText: '修改'
      }
    };
    const modalConfig = {
      handleModalOk: this.handleModalOk,
      handleModalCancel: this.handleModalCancel,
      title: modalMap[modalType]['title'],
      okText: modalMap[modalType]['okText'],
      modalVisible,
      currentItem,
      getTokenTypeOption
    };

    const { getFieldDecorator } = this.props.form;
    const handleClickModify = (record, index, e) => {
      e.preventDefault();
      this.showModifyModal(record, index);
    };
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '14%',
        className: 'text-center'
      },
      {
        title: '花名',
        dataIndex: 'nickName',
        key: 'nickName',
        width: '9%'
      },
      {
        title: '手机号',
        dataIndex: 'cell',
        key: 'cell',
        width: '9%'
      },
      {
        title: '令牌',
        dataIndex: 'token',
        key: 'token',
        width: '9%',
        className: 'text-center'
      },
      {
        title: '令牌类型',
        dataIndex: 'tokenType',
        key: 'tokenType',
        width: '9%',
        className: 'text-center'
      },
      {
        title: '上次失败时间',
        dataIndex: 'gmtLastFailed',
        key: 'gmtLastFailed',
        width: '9%',
        className: 'text-center'
      },
      {
        title: '失败次数',
        dataIndex: 'failedCount',
        key: 'failedCount',
        width: '9%',
        className: 'text-center'
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        width: '9%',
        className: 'text-center'
      },
      {
        title: '修改时间',
        dataIndex: 'gmtModified',
        key: 'gmtModified',
        width: '9%',
        className: 'text-center'
      },
      {
        title: '是否有效',
        dataIndex: 'enabled',
        key: 'enabled',
        width: '5%',
        className: 'text-center',
        render: (text, record, index) => {
          return <span>{text ? '是' : '否'}</span>;
        }
      },
      {
        title: CONFIG.hasUserTokenManage === 'true' ? '操作' : '',
        dataIndex: 'operation',
        key: 'operation',
        width: '9%',
        className: 'text-center',
        render: (text, record, index) => {
          return (
            <div>
              {CONFIG.hasUserTokenManage === 'true' ? (
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

    return (
      <BasicLayout>
        <Form className="form-inline" layout="inline" onSubmit={this.handleSubmit}>
          <div className="form-row">
            <FormItem label="ID" colon={false} key="id">
              {getFieldDecorator('id')(<Input />)}
            </FormItem>

            <FormItem label="创建时间" colon={false} key="gmtCreate">
              {getFieldDecorator('gmtCreate')(<RangePicker {...T.rangerTimeConfig} />)}
            </FormItem>

            <FormItem label="令牌类型" key="tokenType" colon={false}>
              {getFieldDecorator('tokenType', {
                initialValue: tokenType
              })(
                <Select placeholder="请选择" style={{ width: 200 }}>
                  {getTokenTypeOption}
                </Select>
              )}
            </FormItem>
          </div>
          <div className="form-row">
            {/* <FormItem label="手机号" colon={false} key="cell">
              {getFieldDecorator('cell',{
                rules:[
                  {
                    pattern: T.cell(),
                    message:'请输入正确的手机号'
                  }
                ]
              })(<Input maxLength={11} minLength={11} />)}
            </FormItem> */}

            <FormItem label="花名" colon={false} key="nickName">
              {getFieldDecorator('nickName')(<Input />)}
            </FormItem>

            <FormItem label="修改时间" colon={false} key="gmtModified">
              {getFieldDecorator('gmtModified')(<RangePicker {...T.rangerTimeConfig} />)}
            </FormItem>
            <FormItem label="是否有效" colon={false} key="enabled">
              {getFieldDecorator('enabled')(
                <RadioGroup>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </div>
          <div className="form-row">
            <FormItem label="失败次数" colon={false} key="minFailedCount">
              {getFieldDecorator('minFailedCount')(<InputNumber min={0} className="number_input" />)}
            </FormItem>
            <span className="day_span"> - </span>
            <FormItem colon={false} key="maxFailedCount">
              {getFieldDecorator('maxFailedCount')(<InputNumber min={0} className="number_input" />)}
            </FormItem>

            <FormItem label="上次失败时间" colon={false} key="gmtLastFailed">
              {getFieldDecorator('gmtLastFailed')(<RangePicker {...T.rangerTimeConfig} />)}
            </FormItem>
          </div>
          <div className="form-btn-group">
            <Button className="oa-btn" type="primary" htmlType="submit" loading={loading}>
              查询
            </Button>
            {CONFIG.hasUserTokenManage === 'true' ? (
              <Button className="oa-btn" type="primary" onClick={this.showCreateModal} style={{ width: 100 }}>
                <Icon type="plus" />
                令牌创建
              </Button>
            ) : (
              ''
            )}
          </div>
        </Form>

        {modalVisible && (
          <UserTokenQueryModal
            {...modalConfig}
            ref={this.saveModalFormRef}
            // currentItem
          />
        )}

        {isShowTable && (
          <Table
            className="bg-white"
            columns={columns}
            dataSource={tableDataLists}
            rowKey="id"
            // size="middle"
            loading={loading}
            pagination={pagination}
            onChange={this.handlePageSubmit}
          />
        )}
      </BasicLayout>
    );
  }
}

const WrappedUserTokenQueryForm = Form.create()(UserTokenQueryForm);
const mountNode = document.getElementById('root');

ReactDOM.render(
  <LocaleProvider locale={zh_CN}>
    <WrappedUserTokenQueryForm />
  </LocaleProvider>,
  mountNode
);
