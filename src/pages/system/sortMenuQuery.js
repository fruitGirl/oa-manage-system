/*
 * @Description:
 * @Author: qianqian
 * @Date: 2019-02-18 16:24:38
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-03-01 14:22:52
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import 'styles/system/sortMenuQuery.less';
const { Modal, Form, Select, Input, DatePicker, Button, Table, message, LocaleProvider, zh_CN } = window.antd;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const SortMenuQueryModal = Form.create()((props) => {
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

  //所属主菜单的下拉框
  const mainMenuIdOption = CONFIG.mainMenuId.map((item, index) => {
    return (
      <Option key={index} value={item}>
        {CONFIG.mainMenuMap[item]}
      </Option>
    );
  });

  return (
    <Modal
      visible={modalVisible}
      title="分类菜单修改"
      okText="修改"
      onCancel={handleModalCancel}
      onOk={handleModalOk}
      width={410}
    >
      <Form className="antd_form_horizontal creat_from_modify">
        <FormItem {...formItemLayout} label="所属主菜单" key="mainMenuIdModal" className="formLable" colon={false}>
          {getFieldDecorator('mainMenuIdModal', {
            initialValue: currentItem.mainMenuName ? currentItem.mainMenuId : '',
            rules: [{ required: true, message: '请选择所属主菜单' }]
          })(
            <Select style={{ width: '202px' }}>
              <Option value="">全部</Option>
              {mainMenuIdOption}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="分类菜单名" key="sortMenuNameModal" className="formLable" colon={false}>
          {getFieldDecorator('sortMenuNameModal', {
            initialValue: currentItem.sortMenuName,
            rules: [{ required: true, message: '请填写分类菜单名' }]
          })(<Input className="modal_input" type="text" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="分类菜单超链接"
          key="sortMenuHrefModal"
          className="formLable"
          colon={false}
        >
          {getFieldDecorator('sortMenuHrefModal', {
            initialValue: currentItem.sortMenuHref,
            rules: [
              { required: true, message: '请填写分类菜单超链接' }
              // { max: 100, message: '最多只能输入30个字' },
            ]
          })(<Input className="modal_input" type="text" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="分类菜单权限"
          key="sortMenuAuthorityModal"
          className="formLable"
          colon={false}
        >
          {getFieldDecorator('sortMenuAuthorityModal', {
            initialValue: currentItem.sortMenuAuthority,
            rules: [{ required: true, message: '请填写分类菜单权限' }]
          })(<Input className="modal_input" type="text" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="排序号" key="orderNumberModal" className="formLable" colon={false}>
          {getFieldDecorator('orderNumberModal', {
            initialValue: currentItem.orderNumber,
            rules: [{ required: true, message: '请填写排序号' }]
          })(<Input className="modal_input" type="text" />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

class SortMenuQuery extends React.Component {
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
      const mainMenuId = values['mainMenuIdModal'];
      const sortMenuName = values['sortMenuNameModal'];
      const sortMenuHref = values['sortMenuHrefModal'];
      const sortMenuAuthority = values['sortMenuAuthorityModal'];
      const orderNumber = values['orderNumberModal'];
      const params = {
        id: this.modifyId,
        mainMenuId,
        sortMenuName,
        sortMenuHref,
        sortMenuAuthority,
        orderNumber
      };
      this.modifyProcess(params);
    });
  };
  //修改弹框的接口请求
  modifyProcess = (params) => {
    const url = `${T['systemPath']}/sortMenuModify.json`;

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

      const url = `${T['systemPath']}/sortMenuQuery.json`;
      const id = values['id'] ? values['id'] : '';
      const mainMenuId = values['mainMenuId'] ? values['mainMenuId'] : '';
      const sortMenuName = values['sortMenuName'] ? values['sortMenuName'] : '';
      const sortMenuHref = values['sortMenuHref'] ? values['sortMenuHref'] : '';
      const sortMenuAuthority = values['sortMenuAuthority'] ? values['sortMenuAuthority'] : '';

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
        mainMenuId,
        sortMenuName,
        sortMenuHref,
        sortMenuAuthority,
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
          const queryResult = data['queryResult'];
          const mainMenuIdAndNameMap = data['mainMenuIdAndNameMap'];

          //组装table的数据
          const itemList = queryResult.map((item, index) => {
            const listData = {
              key: `${index}`,
              id: item.id,
              sortMenuName: item.sortMenuName,
              sortMenuAuthority: item.sortMenuAuthority,
              sortMenuHref: item.sortMenuHref,
              mainMenuName: mainMenuIdAndNameMap[item.mainMenuId],
              creater: item.creater,
              modifier: item.modifier,
              gmtCreate: item.gmtCreate,
              gmtModified: item.gmtModified,
              orderNumber: item.orderNumber,
              mainMenuId: item.mainMenuId
            };
            return listData;
          });
          if (queryResult.length > 0) {
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
    //主菜单下拉框
    const mainMenuIdOption = CONFIG.mainMenuId.map((item) => {
      return (
        <Option value={item} key={item}>
          {CONFIG.mainMenuMap[item]}
        </Option>
      );
    });
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        className: 'table-center',
        width: '10%'
      },
      {
        title: '分类菜单名',
        dataIndex: 'sortMenuName',
        className: 'table-center',
        width: '8%'
      },
      {
        title: '分类菜单权限',
        dataIndex: 'sortMenuAuthority',
        className: 'table-center',
        width: '10%'
      },
      {
        title: '分类菜单超链接',
        dataIndex: 'sortMenuHref',
        className: 'table-center',
        width: '12%'
      },
      {
        title: '所属主菜单',
        dataIndex: 'mainMenuName',
        className: 'table-center',
        width: '8%'
      },
      {
        title: '创建人',
        dataIndex: 'creater',
        className: 'table-center',
        width: '6%'
      },
      {
        title: '修改人',
        dataIndex: 'modifier',
        className: 'table-center',
        width: '6%'
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        className: 'table-center',
        width: '11%'
      },
      {
        title: '修改时间',
        dataIndex: 'gmtModified',
        className: 'table-center',
        width: '11%'
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
          <SortMenuQueryModal {...modalConfig} ref={this.saveModalFormRef} />
          <Form
            layout="inline"
            onSubmit={this.handleSubmit}
            className="antd_form_horizontal main-content-tranche form-inline"
          >
            <div>
              <FormItem label="分类菜单ID" key="id" colon={false}>
                {getFieldDecorator('id', {
                  initialValue: ''
                })(<Input className="input_width" type="text" />)}
              </FormItem>
              <FormItem label="主菜单" key="mainMenuId" colon={false}>
                {getFieldDecorator('mainMenuId', {
                  initialValue: ''
                })(
                  <Select className="input_width">
                    <Option value="">全部</Option>
                    {mainMenuIdOption}
                  </Select>
                )}
              </FormItem>
              <FormItem label="分类菜单名" key="sortMenuName" colon={false}>
                {getFieldDecorator('sortMenuName', {
                  initialValue: ''
                })(<Input className="input_width" type="text" />)}
              </FormItem>
              <FormItem label="分类菜单超链接" className="menu-lable" key="sortMenuHref" colon={false}>
                {getFieldDecorator('sortMenuHref', {
                  initialValue: ''
                })(<Input className="input_width" type="text" />)}
              </FormItem>
            </div>
            <div>
              <FormItem label="分类菜单权限" className="menu-lable" key="sortMenuAuthority" colon={false}>
                {getFieldDecorator('sortMenuAuthority', {
                  initialValue: ''
                })(<Input className="input_width" type="text" />)}
              </FormItem>
              <FormItem label="创建时间" key="gmtCreate" colon={false}>
                {getFieldDecorator('gmtCreate', {
                  // initialValue: '',
                })(<RangePicker {...timeConfig} />)}
              </FormItem>
              <FormItem label="修改时间" key="gmtModified" colon={false}>
                {getFieldDecorator('gmtModified', {
                  initialValue: ''
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
const WrapSortMenuQuery = Form.create()(SortMenuQuery);

ReactDOM.render(<WrapSortMenuQuery />, document.getElementById('root'));
