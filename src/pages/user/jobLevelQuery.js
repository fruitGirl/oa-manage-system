/*
 * @Description: 系统-层级管理
 * @Author: qianqian
 * @Date: 2019-02-15 19:37:38
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-29 10:24:13
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import 'styles/user/jobLevelQuery.less';
const {
  Form,
  Button,
  Icon,
  Table,
  Checkbox,
  Input,
  Row,
  Col,
  Select,
  message,
  Modal,
  LocaleProvider,
  zh_CN
} = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const JobLevelQueryModal = Form.create()((props) => {
  const {
    currentItem,
    modalVisible,
    handleModalCancel,
    handleModalOk,
    form,
    title,
    okText,
    handleLevelTypeChange,
    value
  } = props;

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
  //层级类型的下拉框
  const levelTypeOption = CONFIG.JobLevelTypeKey.map((item) => {
    return (
      <Option value={item} key={item}>
        {item}
      </Option>
    );
  });
  //层级级别的下拉框
  let levelCodeOption, levelGradeArr;
  if (value && value === 'M') {
    levelCodeOption = CONFIG.JobLevelCodeKeyM.map((item) => {
      return (
        <Option value={item} key={item}>
          {item}
        </Option>
      );
    });
  } else {
    levelCodeOption = CONFIG.JobLevelCodeKeyP.map((item) => {
      return (
        <Option value={item} key={item}>
          {item}
        </Option>
      );
    });
  }
  //复选框回填
  if (currentItem.levelGrade && okText === '修改') {
    levelGradeArr = currentItem.levelGrade.split('/');
  }
  return (
    <Modal
      visible={modalVisible}
      title={title}
      okText={okText}
      onCancel={handleModalCancel}
      onOk={handleModalOk}
      width={415}
    >
      <Form className="antd_form_horizontal creat_from_modify">
        <FormItem {...formItemLayout} label="层级类型" key="levelType" className="formLable" colon={false}>
          {getFieldDecorator('levelType', {
            initialValue: currentItem.levelType ? currentItem.levelType : CONFIG.JobLevelTypeKey[0],
            rules: [
              { required: true, message: '请填写类型代码' }
              // { max: 30, message: '最多只能输入30个字' },
            ]
          })(
            okText === '修改' ? (
              <Select style={{ width: '202px' }} onChange={handleLevelTypeChange} disabled>
                {levelTypeOption}
              </Select>
            ) : (
              <Select style={{ width: '202px' }} onChange={handleLevelTypeChange}>
                {levelTypeOption}
              </Select>
            )
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="层级级别" key="levelCode" className="formLable" colon={false}>
          {getFieldDecorator('levelCode', {
            initialValue: currentItem.levelCode
              ? currentItem.levelCode
              : value && value === 'M'
              ? CONFIG.JobLevelCodeKeyM[0]
              : CONFIG.JobLevelCodeKeyP[0],
            rules: [
              { required: true, message: '请填写类型代码' }
              // { max: 30, message: '最多只能输入30个字' },
            ]
          })(
            okText === '修改' ? (
              <Select style={{ width: '202px' }} disabled>
                {levelCodeOption}
              </Select>
            ) : (
              <Select style={{ width: '202px' }}>{levelCodeOption}</Select>
            )
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="层级等级" key="levelGrade" className="formLable" colon={false}>
          {getFieldDecorator('levelGrade', {
            initialValue: levelGradeArr
          })(
            okText === '修改' ? (
              <CheckboxGroup>
                <Row>
                  {CONFIG.gradeArr.map((item) => {
                    return (
                      <Col className="pull_left check_role" key={item} style={{ marginRight: '7px' }}>
                        <Checkbox value={item}>{item}</Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </CheckboxGroup>
            ) : (
              <CheckboxGroup>
                <Row>
                  {CONFIG.gradeArr.map((item) => {
                    return (
                      <Col className="pull_left check_role" key={item} style={{ marginRight: '7px' }}>
                        <Checkbox value={item}>{item}</Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </CheckboxGroup>
            )
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="层级名称" key="levelName" className="formLable" colon={false}>
          {getFieldDecorator('levelName', {
            initialValue: currentItem.levelName,
            rules: [{ required: true, message: '请输入层级名称' }, { max: 30, message: '最多只能输入30个字' }]
          })(<Input type="text" className="modal_input" />)}
        </FormItem>
      </Form>
    </Modal>
  );
});
class JobLevelQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalType: 'create',
      currentItem: {}, //当前编辑的项,
      value: 'M' //层级类型的下拉框值
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
      currentItem: {},
      value: 'M'
    });
  };
  // 修改模态框
  showModifyModal = (record) => {
    this.modalForm.resetFields();
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
      const levelGrade = values['levelGrade'] || [];
      let isPass = true;
      for (let i = levelGrade.length; i > 0; i--) {
        let index = i - 1;

        if (levelGrade[index] === 'L4') {
          if (levelGrade.indexOf('L1') === -1 || levelGrade.indexOf('L2') === -1 || levelGrade.indexOf('L3') === -1) {
            isPass = false;
            break;
          }
        } else if (levelGrade[index] === 'L3') {
          if (levelGrade.indexOf('L1') === -1 || levelGrade.indexOf('L2') === -1) {
            isPass = false;
            break;
          }
        } else if (levelGrade[index] === 'L2') {
          if (levelGrade.indexOf('L1') === -1) {
            isPass = false;
            break;
          }
        }
      }
      if (!isPass) {
        Modal.error({
          title: '提示',
          content: '不能跳级选'
        });
        return;
      }
      params = {
        levelType: values['levelType'],
        levelCode: values['levelCode'],
        levelGrade: levelGrade.join('/'), //层级等级用‘/’链接
        levelName: values['levelName']
      };
      if (modalType === 'create') {
        this.getCreateForm(params);
      } else {
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
    const url = `${T['userPath']}/jobLevelCreate.json`;
    T.post(url, params)
      .then((data) => {
        //请求成功
        if (data.success) {
          message.success('创建成功');
          setTimeout(() => {
            window.location.reload();
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
    const url = `${T['userPath']}/jobLevelModify.json`;
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
        T.showError('系统报错');
        throw err;
      });
  }
  //删除
  handleReoove = (record, index) => {
    const url = `${T['userPath']}/jobLevelDelete.json`;

    const params = {
      levelType: record.levelType,
      levelCode: record.levelCode,
      enabled: false
    };
    T.post(url, params)
      .then(() => {
        Modal.confirm({
          title: '提示',
          content: '确定要删除吗',
          onOk: () => {
            CONFIG.jobLevelId.splice(index, 1);
            this.setState({});
            message.success('删除成功');
          }
        });
      })
      .catch((data) => {
        T.showError(data);
      });
  };
  //层级类型下拉框的改变
  handleLevelTypeChange = (value) => {
    const levelCode = value && value === 'M' ? CONFIG.JobLevelCodeKeyM[0] : CONFIG.JobLevelCodeKeyP[0];
    this.modalForm.setFieldsValue({ levelCode: levelCode });
    this.setState({ value });
  };
  render() {
    const { modalVisible, modalType, currentItem, value } = this.state;

    const modalMap = {
      create: {
        title: '创建层级',
        okText: '创建'
      },
      modify: {
        title: '修改层级',
        okText: '修改'
      }
    };
    //模态框的属性
    const modalConfig = {
      handleModalOk: this.handleModalOk,
      handleModalCancel: this.handleModalCancel,
      handleLevelTypeChange: this.handleLevelTypeChange,
      title: modalMap[modalType]['title'],
      okText: modalMap[modalType]['okText'],
      modalVisible,
      currentItem,
      value //层级类型的下拉框值
    };

    const tableData = CONFIG.jobLevelId.map((item, index) => {
      const data = [
        {
          key: `${index}`,
          id: item['id'],
          levelType: item['levelType'],
          levelCode: item['levelCode'],
          levelGrade: CONFIG.levelGradeMap[item['levelCode']],
          levelName: item['levelName']
        }
      ];
      return data[0];
    });
    const columns = [
      {
        title: '层级类型',
        dataIndex: 'levelType',
        className: 'text-center'
      },
      {
        title: '层级级别',
        dataIndex: 'levelCode',
        className: 'table-center'
      },
      {
        title: '层级等级',
        dataIndex: 'levelGrade',
        className: 'table-center'
      },
      {
        title: '层级名称',
        dataIndex: 'levelName',
        className: 'table-center text-gray9'
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
                    onClick={() => this.showModifyModal(record)}
                  >
                    修改
                  </span>
                  <span
                    id={`delete${index}`}
                    className="i_block modify-span"
                    onClick={() => this.handleReoove(record, index)}
                  >
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
          <JobLevelQueryModal {...modalConfig} ref={this.saveModalFormRef} />

          {CONFIG.hasAuthorityCreate ? (
            <div>
              <div className="main-content">
                <Button type="primary" className="oa-btn" onClick={this.showCreateFlowModal}>
                  <Icon type="plus" />
                  创建层级
                </Button>
              </div>
              <div className="ant-table-wrapper bg-white" style={{ marginTop: '20px' }}>
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

const WrappedJobLevelQuery = Form.create()(JobLevelQuery);

ReactDOM.render(
  <LocaleProvider locale={zh_CN}>
    <WrappedJobLevelQuery />
  </LocaleProvider>,
  document.getElementById('root')
);
