/*
 * @Description: 系统-员工查询
 * @Author: qianqian
 * @Date: 2019-02-15 18:24:19
 * @Last Modified by: moran
 * @Last Modified time: 2019-09-26 16:54:06
 */

import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import TreeSelectComptent from 'components/businessCommon/TreeSelectComptent';
import Separate from 'components/common/Separate';
import QuitJobModal from 'components/user/userQuery/QuitJobModal';
import { URL_COMPANY_DATA, URL_DEPARTMENT_DATA,  } from 'constants/performance/userQuery';
import { parseDepartmentTreeData, parseCompanyTreeData } from 'constants/performance';
import RemoteTreeSelect from 'components/common/RemoteTreeSelect';

const {
  Form,
  Select,
  Input,
  DatePicker,
  Button,
  Icon,
  Table,
  Modal,
  message,
  Row,
  Col,
  Spin
} = window.antd;

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

// 添加岗位的上限配置
let PARTTIMEDEPTNUM = 10;
CONFIG.parttimePostUuid = 0;
const getTypeOption = (list) => {
  return (
    list &&
    list.map((i) => (
      <Option key={i.id} value={i.id}>
        {i.value}
      </Option>
    ))
  );
};

const ParttimePostForm = Form.create()((props) => {
  const { getFieldDecorator, getFieldValue } = props.form;
  const { parttimePostData, key = [0], jobPositionTypeList } = props.params;

  getFieldDecorator('parttimePostKeys', {
    initialValue: key
  });
  const treeSelectComptentConfig = {
    dispatch: props.dispatch,
    pageData: props.params,
    nameSpace: 'userQuery',
    style: { width: 158 }
  };

  const parttimePostKeys = getFieldValue('parttimePostKeys');

  const handleDeleteParttimePost = (options) => {
    const { id, url, name, k } = options;
    const keys = getFieldValue(name);

    if (id) {
      //请求接口
      T.get(url, {
        id: id
      })
        .then((data) => {
          message.success('删除成功！');
          props.form.setFieldsValue({
            [name]: keys.filter((key) => key !== k)
          });
          props.removeParttimePost(k);
        })
        .catch((data) => {
          T.showError(data);
        });
    } else {
      props.form.setFieldsValue({
        [name]: keys.filter((key) => key !== k)
      });
    }
  };

  //添加一个岗位
  const add = (e, type) => {
    e && e.preventDefault();
    const keys = props.form.getFieldValue(`${type}Keys`);
    if (keys.length >= PARTTIMEDEPTNUM) {
      Modal.error({
        title: '提示',
        content: `最多添加${PARTTIMEDEPTNUM}条！`
      });
    } else {
      CONFIG.parttimePostUuid++;
      const nextKeys = keys.concat(CONFIG.parttimePostUuid);
      props.form.setFieldsValue({
        [`${type}Keys`]: nextKeys
      });
    }
  };
  //删除一个岗位
  const remove = (e, k, type) => {
    e.preventDefault();

    // 删除接口
    const deleteUrl = {
      parttimePost: `${T['userPath']}/userParttimeDeptDelete.json`
    };
    // 当前Id
    const id = {
      parttimePost: parttimePostData[`parttimePostId-${k}`]
    };

    confirm({
      title: '提示',
      content: '确定删除该岗位？',
      onOk: () => {
        handleDeleteParttimePost({
          id: id[`${type}`],
          url: deleteUrl[type],
          name: `${type}Keys`,
          k
        });
      }
    });
  };

  // 职位
  const getPostionNameTypeOption = getTypeOption(jobPositionTypeList);

  const parttimePostBox =
    parttimePostKeys &&
    parttimePostKeys.map((k, index) => {
      const postionNameList = parttimePostData[`postionNameList-${k}`];

      let getPostionNameOption = getTypeOption(postionNameList);

      const postionNameValue =
        parttimePostData[`postionName-${k}`] || (postionNameList && postionNameList[0] ? postionNameList[0]['id'] : '');

      return (
        <div className="add-box" key={k}>
          {getFieldDecorator(`parttimePostId-${k}`, {
            initialValue: parttimePostData[`parttimePostId-${k}`] || ''
          })(<Input type="hidden" />)}
          <Row>
            <Col span={4} className="ant-form-item-label ant-form-item-no-colon">
              {index === 0 ? <label>兼职岗位</label> : ''}
            </Col>
            <Col span={16} className="box_default_background_color">
              <FormItem key="departmentId" colon={false}>
                {getFieldDecorator(`departmentId-${k}`, {
                  initialValue: parttimePostData[`departmentName-${k}`] || '',
                  rules: [{ required: true, message: '请选择部门' }]
                })(
                  <TreeSelectComptent
                    {...treeSelectComptentConfig}
                    valueSpaceName={[`departmentId-${k}`, `departmentName-${k}`]}
                  />
                )}
              </FormItem>
              <Row>
                <Col span={11} className="pull_left">
                  <FormItem>
                    {getFieldDecorator(`postionNameType-${k}`, {
                      ...parttimePostData[`jobPositionTypeValue-${k}`],
                      rules: [{ required: true, message: '请选择职位类型' }]
                    })(
                      <Select
                        className="input_width"
                        placeholder="职位类型"
                        onChange={(value) =>
                          props.handleChangePositionType({
                            value,
                            k,
                            needSet: true
                          })
                        }
                      >
                        {getPostionNameTypeOption}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={1} className="pull_left icon_wave">
                  ~
                </Col>
                <Col span={11} className="pull_left">
                  <FormItem>
                    {getFieldDecorator(`postionName-${k}`, {
                      initialValue: postionNameValue,
                      rules: [{ required: true, message: '请选择具体职位' }]
                    })(
                      <Select className="input_width" placeholder="请选择">
                        {getPostionNameOption}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col span={3} className="add_btn_wrapper">
              {parttimePostKeys.length === 1 ? (
                <a href="javascript:;" onClick={(e) => add(e, 'parttimePost')} className="mr10">
                  添加
                </a>
              ) : index === 0 ? (
                <a href="javascript:;" onClick={(e) => add(e, 'parttimePost')} style={{ marginRight: 10 }}>
                  添加
                </a>
              ) : (
                ''
              )}
              {parttimePostKeys.length === 1 ? (
                index === 0 ? (
                  parttimePostData[`parttimePostId-${k}`] ? (
                    <a href="javascript:;" onClick={(e) => remove(e, k, 'parttimePost')} style={{ marginRight: 10 }}>
                      删除
                    </a>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
              ) : (
                <a href="javascript:;" onClick={(e) => remove(e, k, 'parttimePost')} style={{ marginRight: 10 }}>
                  删除
                </a>
              )}
            </Col>
          </Row>
        </div>
      );
    });

  return <div>{parttimePostBox}</div>;
});

class UserQueryFormClass extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companyId: ''
    };
  }

  changeCompany = (val) => {
    this.setState({
      companyId: val
    });
    this.props.form.resetFields(['departmentId']);
  }

  render() {
    const { companyId } = this.state;
    const { getFieldDecorator } = this.props.form;

    // 时间参数
    const timeConfig = {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间']
    };

    //状态的下拉
    const statusOption =
      CONFIG.statusKey &&
      CONFIG.statusKey.map((item) => {
        return (
          <Option value={item} key={item}>
            {CONFIG.statusMap[item]}
          </Option>
        );
      });

    //员工性质的下拉
    const jobNatureOption =
      CONFIG.jobNatureKey &&
      CONFIG.jobNatureKey.map((item) => {
        return (
          <Option value={item} key={item}>
            {CONFIG.jobNatureMap[item]}
          </Option>
        );
      });

    const createUrl = `${T['userPath']}/userCreate.htm`;

    return (
      <Form
        layout="inline"
        onSubmit={this.props.handleSubmit}
        className="antd_form_horizontal main-content-tranche form-inline"
        id="process_form"
      >
        <div>
          <FormItem colon={false} label="公司">
            {getFieldDecorator('companyId')(
              <RemoteTreeSelect
                onChangeVal={this.changeCompany}
                action={URL_COMPANY_DATA}
                parseStructure={parseCompanyTreeData}
              />
            )}
          </FormItem>
          <FormItem colon={false} label="部门">
            {getFieldDecorator('departmentId')(
              <RemoteTreeSelect
                action={companyId ? `${URL_DEPARTMENT_DATA}${companyId}` : ''}
                parseStructure={parseDepartmentTreeData}
              />
            )}
          </FormItem>
          <FormItem label="名字" key="realName" colon={false}>
            {getFieldDecorator('realName', {
              initialValue: '',
            })(<Input placeholder="请输入名字" className="input_width" type="text" maxLength={20} />)}
          </FormItem>
          <FormItem label="花名" key="nickName" colon={false}>
            {getFieldDecorator('nickName', {
              initialValue: ''
            })(<Input placeholder="请输入花名" className="input_width" type="text" maxLength={20} />)}
          </FormItem>
          <FormItem label="入职时间" key="gmtEntry" colon={false}>
            {getFieldDecorator('gmtEntry')(<RangePicker {...this.props.timeConfig} />)}
          </FormItem>
          <FormItem label="转正日期" key="becomeRegular" colon={false}>
            {getFieldDecorator('becomeRegular')(<RangePicker {...timeConfig} />)}
          </FormItem>
          <FormItem label="状态" key="status" colon={false}>
            {getFieldDecorator('status', {
              initialValue: 'INCUMBENCY',
            })(
              <Select className="input_width">
                <Option value="">全部</Option>
                {statusOption}
              </Select>
            )}
          </FormItem>
          <FormItem label="员工性质" key="jobNature" colon={false}>
            {getFieldDecorator('jobNature', {
              initialValue: '',
            })(
              <Select className="input_width">
                <Option value="">全部</Option>
                {jobNatureOption}
              </Select>
            )}
          </FormItem>
        </div>
        <div className="form-btn-group">
          <Button type="primary" className="oa-btn" htmlType="submit" loading={this.props.loading}>
            查询
          </Button>
          <Button type="primary" className="oa-btn">
            <a href={createUrl}>
              <Icon type="plus" />
              创建员工
            </a>
          </Button>
        </div>
      </Form>
    );

  }
}
const UserQueryForm = Form.create()(UserQueryFormClass);

class UserQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      visible: false, //重置的模态框
      userName: null,
      userId: null, //重置密码时传的用户id
      hasAuthorityVisible: false,
      canLogin: false,
      visibleParttimePost: false,
      parttimePostLoading: true,
      parttimePost: {
        parttimePostUuid: 0,
        jobPositionTypeList: [],
        parttimePostData: {},
        key: []
      }
    };
  }

  handlePageSubmit = (pagination, filters, sorter) => {
    this.handleSubmit(null, pagination.current);
  };

  //表单提交(请求的是查询接口)
  handleSubmit = (e, currentPage = 1) => {
    if (e) {
      e.preventDefault();
    }
    this.UserQueryForm.validateFields((errors, values) => {
      if (errors) {
        return;
      }

      const url = `${T['userPath']}/userQuery.json`;
      const realName = values['realName'] ? values['realName'] : '';
      const nickName = values['nickName'] ? values['nickName'] : '';
      const status = values['status'] ? values['status'] : '';

      const becomeRegular = values['becomeRegular'] ? values['becomeRegular'] : '';
      const gmtEntry = values['gmtEntry'] ? values['gmtEntry'] : '';
      const jobNature = values['jobNature'] ? values['jobNature'] : ''; //员工性质

      //转正时间
      const minGmtBecomeRegular = becomeRegular.length !== 0 ? becomeRegular[0].format('YYYY-MM-DD HH:mm:ss') : '';
      const maxGmtBecomeRegular = becomeRegular.length !== 0 ? becomeRegular[1].format('YYYY-MM-DD HH:mm:ss') : '';
      //入职时间
      const minGmtEntry = gmtEntry.length !== 0 ? gmtEntry[0].format('YYYY-MM-DD HH:mm:ss') : '';
      const maxGmtEntry = gmtEntry.length !== 0 ? gmtEntry[1].format('YYYY-MM-DD HH:mm:ss') : '';
      const params = {
        ...values,
        realName,
        nickName,
        minGmtBecomeRegular,
        maxGmtBecomeRegular,
        status,
        minGmtEntry,
        maxGmtEntry,
        jobNature,
        currentPage
      };

      this.setState({
        loading: true,
        showTable: true
      });

      //请求查询接口
      T.get(url, params)
        .then((data) => {
          const { pageList = {}, userIdAndBirthdayMap = {} } = data;
          const { list = [], positionMap = {}, userIdAndMajorDepartmentMap = {} } = pageList;

          //组装table的数据
          const itemList =
            list.length > 0 &&
            list.map((item, index) => {
              const { userId } = item;
              const departmentName = userIdAndMajorDepartmentMap[userId]
                ? userIdAndMajorDepartmentMap[userId]['departmentName']
                : '';

              const department = `${item.companyShortName}-${departmentName}`; //部门
              const positionName =
                positionMap[userId].length !== 0 ? positionMap[userId][0]['positionName'] : '';
              const listData = {
                key: `${index}`,
                id: item.id,
                department: department,
                stageName: item.nickName,
                jobNumber: item.jobNumber,
                sex: item.sex['message'],
                birthday: userIdAndBirthdayMap[userId],
                workingConditions: item.status['message'],
                workingConditionsStatus: item.status['name'],
                postionName: positionName,
                enterTime: item.gmtEntry,
                userId,
                canLogin: item.canLogin,
                shortGmtEntry: item.shortGmtEntry
              };
              return listData;
            });
          const paginator = pageList['paginator'];

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
        })
        .catch((err) => {
          this.setState({ loading: false });
          T.showError(err);
        });
    });
  };

  handleModalVisible = (nameSpace, visible) => {
    this.setState({ [nameSpace]: visible });
  };

  //设置权限
  setAuthority = (record) => {
    this.setState({
      hasAuthorityVisible: true,
      userId: record.userId,
      canLogin: record.canLogin
    });
  };

  authhandleModalOk = () => {
    const url = `${T['userPath']}/setUserCanLogin.json`;
    const { canLogin, userId } = this.state;
    const params = {
      userId,
      canLogin: !canLogin
    };

    T.post(url, params)
      .then(() => {
        message.success('操作成功');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        T.showError(err);
      });
    this.setState({ hasAuthorityVisible: false });
  };

  //重置密码
  setPassword = (index, stageName, userId) => {
    this.setState({
      visible: true,
      userName: stageName,
      userId
    });
  };

  //重置密码的模态框
  handleModalOk = () => {
    const url = `${T['userPath']}/resetUserPassword.json`;
    const params = {
      userId: this.state.userId
    };

    T.get(url, params)
      .then((data) => {
        const newPassword = data['newPassword'];
        Modal.success({
          title: '提示',
          content: (
            <div style={{ marginTop: '13px' }}>
              <p className="setOk">
                重置
                <span style={{ color: '#74beff' }}>{this.state.userName}</span>
                的密码成功
              </p>
              <div className="newPwsMsg">
                <span>新密码：</span>
                <span className="newPwsNum">{newPassword}</span>
              </div>
            </div>
          ),
          okText: '确认'
        });
      })
      .catch((err) => {
        T.showError(err);
      });
    this.setState({ visible: false });
  };

  // 设置和查看一人多岗
  setParttimePost = (record) => {
    // console.log(record);
    this.setState({
      visibleParttimePost: true,
      parttimePostLoading: true
      // parttimePost: {
      //   parttimePostUuid: 0,
      //   jobPositionTypeList: [],
      //   parttimePostData: {},
      //   key: []
      // }
    });
    const url = `${T['userPath']}/userParttimeDeptQuery.json`;
    const params = {
      userId: record.userId
    };

    // 职位
    T.get(url, params)
      .then((data) => {
        const { jobPositionTypeList = [], userDeptJobPositionLinkList = [], parttimeDeptNum = 10 } = data;

        // 一人多岗 岗位添加上限
        PARTTIMEDEPTNUM = parttimeDeptNum;

        let list = [];
        let key = [];
        const l = userDeptJobPositionLinkList.length;
        let parttimePostData = {};

        // 职位类型的数据组装
        jobPositionTypeList.forEach((item) => {
          list.push({
            id: item.id,
            value: item.name
          });
        });

        if (l > 0) {
          // 回填数据
          for (let i = 0; i < l; i++) {
            const item = userDeptJobPositionLinkList[i];
            // 一共几条数据
            key.push(i);

            // id
            parttimePostData[`parttimePostId-${i}`] = item['id'];

            // 部门
            parttimePostData[`departmentId-${i}`] = item['departmentId'];
            parttimePostData[`departmentName-${i}`] = item['departmentName'];

            // 职位类型
            parttimePostData[`postionNameType-${i}`] = item['jobPositionType'];
            // 职位
            parttimePostData[`postionName-${i}`] = item['jobPositionId'];

            // 职位类型的initValue
            parttimePostData[`jobPositionTypeValue-${i}`] = T.getSelectInitialValue({
              data: item,
              key: 'jobPositionTypeId'
            });

            // 请求职位下拉数据
            this.handleChangePositionType({
              value: item['jobPositionTypeId'],
              k: i,
              needSet: false
            });
          }
        } else {
          // 默认有一条数据
          key.push(0);
        }

        CONFIG.parttimePostUuid = key.length;
        this.setState({
          parttimePostLoading: false,
          parttimePost: {
            ...this.state.parttimePost,
            jobPositionTypeList: list,
            parttimePostData,
            userId: record.userId,
            key
          }
        });
      })
      .catch((err) => {
        T.showError(err);
      });
  };

  // 职位类型变化是具体职位列表
  handleChangePositionType({ value, k, needSet }) {
    const params = {
      positionTypeId: value
    };
    this.getPositionByPositionType({
      params,
      callback: (parttimePostData) => {
        const postionNameList = parttimePostData[`postionNameList-${k}`];

        const defaultValue = postionNameList && postionNameList[0] ? postionNameList[0]['id'] : '';

        const postionNameValue = defaultValue;
        if (needSet) {
          this.ParttimePostForm.setFieldsValue({
            [`postionName-${k}`]: postionNameValue
          });
        }
      },
      k
    });
  }

  getPositionByPositionType({ params, callback, k }) {
    const url = `${T['userPath']}/getPositionByPositionTypeId.json`;

    T.get(url, params)
      .then((data) => {
        const list = data.jobPositionList;
        const map = {};
        const postionNameList = [];
        let parttimePostData = this.state.parttimePost.parttimePostData;
        list &&
          list.forEach((i) => {
            i.name = i.positionName;
            map[i.id] = i.positionName;
            postionNameList.push({
              id: i.id,
              value: i.positionName
            });
          });
        parttimePostData[`postionNameList-${k}`] = postionNameList;
        this.setState({
          parttimePost: {
            ...this.state.parttimePost,
            parttimePostData
          }
        });
        if (callback && T.isFunction(callback)) {
          callback(parttimePostData);
        }
      })
      .catch((err) => {
        T.showError(err);
      });
  }

  // 创建一人多岗
  handleParttimePostModalOk = () => {
    this.ParttimePostForm.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      // console.log(values);
      this.setState({
        parttimePostConfirmLoading: true
      });
      const url = `${T['userPath']}/userParttimeDeptModify.json`;

      // 用来放置参数
      let parttimeDepts = [];

      // 得到当前有多少个兼职岗位
      const parttimePostKeys = this.ParttimePostForm.getFieldValue('parttimePostKeys');

      // 组装数据
      parttimePostKeys.forEach((k) => {
        // id,职位类型id,职位id
        let departmentId = parseInt(values[`departmentId-${k}`], 10);
        departmentId = isNaN(departmentId)
          ? this.state.parttimePost.parttimePostData[`departmentId-${k}`]
          : values[`departmentId-${k}`];

        parttimeDepts.push(`${values[`parttimePostId-${k}`]},${departmentId},${values[`postionName-${k}`]}`);
      });
      const params = {
        userId: this.state.parttimePost.userId,
        parttimeDepts: parttimeDepts.join(';')
      };

      T.get(url, params)
        .then((data) => {
          message.success('修改成功!');
          this.handleModalVisible();
          this.setState({
            visibleParttimePost: false,
            parttimePostConfirmLoading: false
          });
        })
        .catch((err) => {
          T.showError(err);
          this.setState({
            parttimePostConfirmLoading: false
          });
        });
    });
  };

  removeParttimePost = (k) => {
    // console.log(k);

    let parttimePostData = this.state.parttimePost.parttimePostData;

    // id
    delete parttimePostData[`parttimePostId-${k}`];

    // 部门
    delete parttimePostData[`departmentId-${k}`];
    delete parttimePostData[`departmentName-${k}`];

    // 职位类型
    delete parttimePostData[`postionNameType-${k}`];
    // 职位
    delete parttimePostData[`postionName-${k}`];
    // 职位list下拉
    delete parttimePostData[`postionNameList-${k}`];
    // 职位类型的initValue
    delete parttimePostData[`jobPositionTypeValue-${k}`];

    CONFIG.parttimePostUuid--;
    this.setState({
      parttimePost: {
        ...this.state.parttimePost,
        parttimePostData
      }
    });
    const parttimePostKeys = this.ParttimePostForm.getFieldValue('parttimePostKeys');
    // 全部删除之后需要添加一条空数据
    if (parttimePostKeys.length === 0) {
      this.ParttimePostForm.setFieldsValue({ parttimePostKeys: [0] });
    }
  };

  closeParttimePostModal = () => {
    this.setState({
      visibleParttimePost: false,
      parttimePostLoading: true
    });
  };

  saveParttimePostFormRef = (form) => {
    this.ParttimePostForm = form;
  };

  saveUserQueryFormRef = (form) => {
    this.UserQueryForm = form;
  };

  // 离职
  handleQuitJob = (record) => {
    this.props.dispatch({
      type: 'userQuery/showQuitJobModal',
      payload: record
    });
  }

  // 隐藏离职弹窗
  hideQuitJobModal = () => {
    this.props.dispatch({
      type: 'userQuery/hideQuitJobModal'
    });
  }

  // 提交离职
  handleSubmitQuitJob = async (payload) => {
    await this.props.dispatch({
      type: 'userQuery/submitQuitJob',
      payload: payload
    });

    const { pagination } = this.state;
    this.handleSubmit(null, pagination.current);
  }

  render() {
    const { loading: dvaLoading, userQuery, dispatch } = this.props;
    const { showQuitJobModal, curHandleRecord } = userQuery;
    const {
      visible,
      userName,
      tableDataLists,
      loading,
      showTable,
      hasAuthorityVisible,
      visibleParttimePost,
      parttimePostLoading,
      parttimePostConfirmLoading
    } = this.state;

    const columns = [
      {
        title: '部门',
        dataIndex: 'department',
        className: 'table-center'
      },
      {
        title: '花名',
        dataIndex: 'stageName',
        className: 'table-center'
      },
      {
        title: '工号',
        dataIndex: 'jobNumber',
        className: 'table-center'
      },
      {
        title: '性别',
        dataIndex: 'sex',
        className: 'table-center'
      },
      {
        title: '出生日期',
        dataIndex: 'birthday',
        className: 'table-center'
      },
      {
        title: '在职状况',
        dataIndex: 'workingConditions',
        className: 'table-center'
      },
      {
        title: '岗位',
        dataIndex: 'postionName',
        className: 'table-center'
      },
      {
        title: '入职时间',
        dataIndex: 'shortGmtEntry',
        className: 'table-center'
      },
      {
        title: CONFIG.hasAuthorityPws || CONFIG.hasAuthorityLogin ? '操作' : '',
        dataIndex: 'operate',
        width: '11%',
        render: (text, record, index) => {
          const editerUrl = `${T['userPath']}/userModify.htm?userId=${record.userId}`;
          return (
            <div>
              {CONFIG.hasAuthorityEditer ? (
                <a className="i_block modify-span" style={{ width: 30 }} href={editerUrl}>
                  编辑
                </a>
              ) : (
                ''
              )}

              {CONFIG.hasAuthorityPws ? (
                <span
                  className="i_block modify-span"
                  style={{ width: 70 }}
                  onClick={() => this.setPassword(index, record.stageName, record.userId)}
                >
                  重置密码
                </span>
              ) : (
                ''
              )}

              {CONFIG.hasAuthorityLogin ? (
                record.canLogin ? (
                  <span className="i_block modify-span" onClick={() => this.setAuthority(record)}>
                    禁止登录
                  </span>
                ) : (
                  <span className="i_block modify-span" onClick={() => this.setAuthority(record)}>
                    允许登录
                  </span>
                )
              ) : (
                ''
              )}
              <Separate isVertical={false} />
              <span className="i_block modify-span" onClick={() => this.setParttimePost(record)}>
                兼任岗位
              </span>
              <Separate isVertical={false} />
              {
                (record.workingConditionsStatus === 'DIMISSION')
                  ? null
                  : (<span className="i_block modify-span" onClick={() => this.handleQuitJob(record)}>离职</span>)
              }
            </div>
          );
        },
        className: 'table-center'
      }
    ];

    const treeSelectComptentConfig = {
      dispatch,
      pageData: userQuery,
      nameSpace: 'userQuery',
      style: { width: 176 }
    };
    const handleQuitJobLoading = dvaLoading.effects['userQuery/submitQuitJob']; // 提交离职弹窗，按钮loading状态

    return (
        <BasicLayout>
          <Modal
            visible={visible}
            title="提示"
            okText="确定"
            onCancel={() => this.handleModalVisible('visible', false)}
            onOk={this.handleModalOk}
            width={410}
          >
            <div className="setMsg">
              确定要重置<span>{userName}</span>的密码吗？
            </div>
          </Modal>
          <Modal
            visible={hasAuthorityVisible}
            title="提示"
            okText="确定"
            onCancel={() => this.handleModalVisible('hasAuthorityVisible', false)}
            onOk={this.authhandleModalOk}
            width={410}
          >
            <div className="setMsg authority">确定执行该操作吗？</div>
          </Modal>

          <UserQueryForm
            ref={this.saveUserQueryFormRef}
            treeSelectComptentConfig={treeSelectComptentConfig}
            handleSubmit={this.handleSubmit}
          />

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

          <Modal
            visible={visibleParttimePost}
            title="兼职岗位"
            okText="保存"
            onCancel={() => this.closeParttimePostModal()}
            onOk={this.handleParttimePostModalOk}
            width={560}
            className="parttime-post-modal"
            confirmLoading={parttimePostConfirmLoading}
          >
            {parttimePostLoading ? (
              <div className="loading">
                <Spin />
              </div>
            ) : (
              <ParttimePostForm
                ref={this.saveParttimePostFormRef}
                params={this.state.parttimePost}
                dispatch={dispatch}
                handleChangePositionType={({ value, k, needSet }) =>
                  this.handleChangePositionType({
                    value,
                    k,
                    needSet
                  })
                }
                removeParttimePost={(k) => this.removeParttimePost(k)}
              />
            )}
          </Modal>
          <QuitJobModal
            submit={this.handleSubmitQuitJob}
            hideModal={this.hideQuitJobModal}
            visible={showQuitJobModal}
            curUserMsg={curHandleRecord}
            loading={handleQuitJobLoading}
          />
        </BasicLayout>
    );
  }
}

export default connect(({ userQuery, loading, }) => ({ userQuery, loading }))(UserQuery);
