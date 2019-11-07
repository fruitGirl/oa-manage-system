/*
 * @Description: 系统-顶部菜单查询
 * @Author: qianqian
 * @Date: 2019-02-18 16:43:14
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-03-01 14:23:29
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import 'styles/system/topMenuQuery.less';
const { Modal, Form, Input, DatePicker, Button, Table, message, LocaleProvider, zh_CN } = window.antd;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const TopMenuQueryModal = Form.create()((props) => {
  const { currentItem, modalVisible, handleModalCancel, handleModalOk, form } = props;
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
  const handleIsNumber = (rule, value, callback) => {
    if (value) {
      if (!/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(value)) {
        callback('排序号不能为负数');
      }
    }
    callback();
  };
  return (
    <Modal
      visible={modalVisible}
      title="顶部菜单修改"
      okText="修改"
      onCancel={handleModalCancel}
      onOk={handleModalOk}
      width={410}
    >
      <Form className="antd_form_horizontal creat_from_modify">
        <FormItem {...formItemLayout} label="顶部菜单名" key="topMenuNameModal" className="formLable" colon={false}>
          {getFieldDecorator('topMenuNameModal', {
            initialValue: currentItem.topMenuName,
            rules: [{ required: true, message: '请填写顶部菜单名' }]
          })(<Input className="modal_input" type="text" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="首页地址" key="indexUrl" className="formLable" colon={false}>
          {getFieldDecorator('indexUrl', {
            initialValue: currentItem.indexUrl,
            rules: [
              // { required: true, message: '请填写首页地址' },
            ]
          })(<Input className="modal_input" type="text" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="排序号" key="orderNumber" className="formLable" colon={false}>
          {getFieldDecorator('orderNumber', {
            initialValue: currentItem.orderNumber,
            rules: [
              // { required: true, message: '请填写排序号' },
              { validator: handleIsNumber }
            ]
          })(<Input className="modal_input" type="text" />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

class TopMenuQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      tableDataLists: [],
      currentItem: {}, //当前编辑的项,
      showTable: false,
      loading: false // 表格是否加载数据
    };
  }

  // 取消
  handleModalCancel = () => {
    this.setState({
      modalVisible: false
    });
  };
  // 修改模态框
  showModifyModal = (record, index, id) => {
    this.modalForm.resetFields();
    this.modifyId = id;
    this.setState({
      modalVisible: true,
      currentItem: record
    });
  };
  handleModalOk = () => {
    const modalForm = this.modalForm;
    modalForm.validateFields((err, values) => {
      if (err) {
        return;
      }

      modalForm.resetFields();
      this.setState({ modalVisible: false });
      const topMenuName = values['topMenuNameModal'];
      const indexUrl = values['indexUrl'];
      const orderNumber = values['orderNumber'];
      const params = {
        id: this.modifyId,
        topMenuName,
        indexUrl,
        orderNumber
      };
      this.modifyProcess(params);
    });
  };
  //修改弹框的接口请求
  modifyProcess = (params) => {
    const url = `${T['systemPath']}/topMenuModify.json`;
    T.post(url, params)
      .then(() => {
        message.success('修改成功');
        setTimeout(() => {
          this.handleSubmit(null);
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
  //表单提交(请求的是查询接口)
  handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }

      const url = `${T['systemPath']}/topMenuQuery.json`;
      const id = values['id'] ? values['id'] : '';
      const topMenuName = values['topMenuName'] ? values['topMenuName'] : '';

      const gmtCreate = values['gmtCreate'] ? values['gmtCreate'] : '';
      const gmtModified = values['gmtModified'] ? values['gmtModified'] : '';

      //创建时间
      const minGmtCreate = gmtCreate.length !== 0 ? gmtCreate[0].format('YYYY-MM-DD HH:mm:ss') : '';
      const maxGmtCreate = gmtCreate.length !== 0 ? gmtCreate[1].format('YYYY-MM-DD HH:mm:ss') : '';
      //修改时间
      const minGmtModified = gmtModified.length !== 0 ? gmtModified[0].format('YYYY-MM-DD HH:mm:ss') : '';
      const maxGmtModified = gmtModified.length !== 0 ? gmtModified[1].format('YYYY-MM-DD HH:mm:ss') : '';

      const params = {
        id,
        topMenuName,
        minGmtCreate,
        maxGmtCreate,
        minGmtModified,
        maxGmtModified
      };

      this.setState({
        loading: true,
        showTable: true
      });
      //请求查询接口
      T.get(url, params)
        .then((data) => {
          //请求成功
          const topMenuList = data['topMenuList'];

          //组装table的数据
          const itemList = topMenuList.map((item, index) => {
            const listData = {
              key: `${index}`,
              id: item.id,
              topMenuName: item.topMenuName,
              creater: item.creater,
              modifier: item.modifier,
              gmtCreate: item.gmtCreate,
              gmtModified: item.gmtModified,
              orderNumber: item.orderNumber,
              indexUrl: item.indexUrl
            };
            return listData;
          });
          if (topMenuList.length > 0) {
            this.setState({
              tableDataLists: itemList,
              loading: false
            });
          } else {
            this.setState({
              tableDataLists: [],
              loading: false
            });
          }
        })
        .catch((err) => {
          this.setState({ loading: false });
          T.showError(err);
        });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible, tableDataLists, currentItem, showTable, loading } = this.state;

    // 时间参数
    const timeConfig = {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间']
    };

    //模态框的属性
    const modalConfig = {
      handleModalOk: this.handleModalOk,
      handleModalCancel: this.handleModalCancel,
      modalVisible,
      currentItem
    };

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        className: 'table-center',
        width: '17%'
      },
      {
        title: '顶部菜单',
        dataIndex: 'topMenuName',
        className: 'table-center',
        width: '10%'
      },
      {
        title: '首页地址',
        dataIndex: 'indexUrl',
        className: 'table-center',
        width: '15%'
      },
      {
        title: '创建人',
        dataIndex: 'creater',
        className: 'table-center',
        width: '8%'
      },
      {
        title: '修改人',
        dataIndex: 'modifier',
        className: 'table-center',
        width: '8%'
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        className: 'table-center',
        width: '15%'
      },
      {
        title: '修改时间',
        dataIndex: 'gmtModified',
        className: 'table-center',
        width: '15%'
      },
      {
        title: '排序值',
        dataIndex: 'orderNumber',
        className: 'table-center',
        width: '6%'
      },
      {
        title: CONFIG.hasAuthority ? '操作' : '',
        dataIndex: 'operate',
        width: '6%',
        render: (text, record, index) => {
          const modifyId = tableDataLists[index]['id'];
          return (
            <div>
              {CONFIG.hasAuthority ? (
                <span className="i_block modify-span" onClick={() => this.showModifyModal(record, index, modifyId)}>
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
          <TopMenuQueryModal {...modalConfig} ref={this.saveModalFormRef} />
          <Form
            layout="inline"
            onSubmit={this.handleSubmit}
            className="antd_form_horizontal main-content-tranche form-inline"
          >
            <div>
              <FormItem label="顶部菜单id" key="id" colon={false}>
                {getFieldDecorator('id', {
                  initialValue: ''
                })(<Input className="input_width" type="text" />)}
              </FormItem>
              <FormItem label="顶部菜单名" key="topMenuName" colon={false}>
                {getFieldDecorator('topMenuName', {
                  initialValue: ''
                })(<Input className="input_width" type="text" />)}
              </FormItem>
              <FormItem label="创建时间" key="gmtCreate" colon={false}>
                {getFieldDecorator('gmtCreate', {
                  initialValue: ''
                })(<RangePicker {...timeConfig} />)}
              </FormItem>
              <FormItem label="修改时间" key="gmtModified" colon={false}>
                {getFieldDecorator('gmtModified', {
                  // initialValue: '',
                })(<RangePicker {...timeConfig} />)}
              </FormItem>
            </div>
            <div className="form-btn-group">
              <Button type="primary" className="oa-btn" htmlType="submit" loading={loading}>
                查询
              </Button>
            </div>
          </Form>
          {showTable ? (
            <div className="ant-table-wrapper bg-white">
              <Table columns={columns} dataSource={tableDataLists} loading={loading} pagination={false} />
            </div>
          ) : (
            ''
          )}
        </BasicLayout>
      </LocaleProvider>
    );
  }
}
const WrapTopMenuQuery = Form.create()(TopMenuQuery);

ReactDOM.render(<WrapTopMenuQuery />, document.getElementById('root'));
