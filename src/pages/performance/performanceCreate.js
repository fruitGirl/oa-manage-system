/*
 * @Description: 绩效-创建/编辑我的绩效考核
 * @Author: qianqian
 * @Date: 2019-02-19 15:24:06
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 15:41:10
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import performanceCommon from 'modules/performanceCommon';
import 'styles/performance/performanceCreate.less';
import HistoryList from 'components/performance/performanceReviewEdit/HistoryList';

const {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  message,
  Modal,
  Row,
  Col,
  Steps
} = window.antd;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
let uuid = CONFIG.options.keysValue ? CONFIG.options.keysValue.length : 0;

let keysValue = (!CONFIG.options.keysValue
  || (CONFIG.options.keysValue.length < 1))
    ? [0]
    : CONFIG.options.keysValue;

const CUR_YEAR = new Date().getFullYear(); // 当前年度
const performanceTypeCodeMap = {
  'QUARTER_PERFORMANCE': '季度考核',
  'ANNUAL_PERFORMANCE': '年度考核'
};
// 考核是草稿还是提交状态
const OBJECT_TYPE = T.tool.getQueryString('objectType');

class CreatePerformanceForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      disabled: false,
      saveDraftBtnLoading: false,
      saveDraftBtnDisabled: false,
      performanceTypeCode: CONFIG.options.performanceTypeCode || 'QUARTER_PERFORMANCE',
      timeRange: CONFIG.options.timeRange || '',
      HistoryListMsg: {}, // 历史记录列表对象
    };
  }

  // 进入页面要运行的函数
  componentDidMount() {
    CONFIG.options.id && this.getHistoryList();

    // 页面条状或者刷新的时候提示用户是否要离开本页面
    window.onunload = () => {
      this.showConfirm();
    };
  }

  // 年度考核的年份options
  createYearOption = () => {
    const date = new Date();
    const now = date.getFullYear();
    let years = [];
    for (let i = 5; i > 0; i--) {
      years.push(now - i);
    }
    for (let i = 0; i < 6; i++) {
      years.push(now + i);
    }
    return years.map((item, index) => {
      return (
        <Option value={item} key={item}>
          {`${item}年`}
        </Option>
      );
    });
  };

  // 考核类型
  handlePerformanceTypeChange = (e) => {
    const value = e.target.value;
    this.setState({
      performanceTypeCode: value
    });
    const timeRange = value === 'QUARTER_PERFORMANCE'
      ? ''
      : CUR_YEAR;
    this.props.form.setFieldsValue({ timeRange: timeRange });
  };

  // 时间
  handleChangeTimeRange = (value) => {
    this.setState({
      timeRange: value
    });
  };

  //添加
  add(e) {
    e.preventDefault();
    const keys = this.props.form.getFieldValue('keys');
    if (keys.length > 19) { // 最多20项
      Modal.error({
        title: '提示',
        content: '目标项已超上限'
      });
    } else {
      uuid++;
      const nextKeys = keys.concat(uuid);
      this.props.form.setFieldsValue({
        keys: nextKeys
      });
    }
  }

  //删除
  remove(e, k) {
    e.preventDefault();
    const keys = this.props.form.getFieldValue('keys');

    this.props.form.setFieldsValue({
      keys: keys.filter((key) => key !== k)
    });
  }

  // 返回
  handleClickGoBackBtn = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.showConfirm(() => {
      // 返回到上一页
      window.history.go(-1);
    });
  };

  // 离开页面的时候的弹框提示
  showConfirm = (callback) => {
    confirm({
      title: '提示',
      content: '确定退出吗？',
      onOk() {
        if (callback) {
          callback();
        }
      }
    });
  };

  // 表单提交
  handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const formData = performanceCommon.initFormData(fieldsValue);
      // 判断权重总和是否到100
      if (formData.count !== 100) {
        Modal.error({
          title: '提示',
          content: '无法提交，权重和不等于100%'
        });
        return;
      }
      this.setState({
        loading: true,
        saveDraftBtnDisabled: true
      });

      T.post(`${CONFIG.frontPath}/performance/performanceSubmit.json`, {
        ...formData.params,
        status: 'SET_GOALS',
        id: CONFIG.options.id,
        assessObjectId: CONFIG.options.assessObjectId
      })
        .then(() => {
          message.success('提交成功!');
          setTimeout(() => {
            window.location.href = `${CONFIG.frontPath}/performance/myPerformanceQuery.htm`;
          }, 2000);
        })
        .catch((err) => {
          this.setState({
            loading: false,
            saveDraftBtnDisabled: false
          });
          T.showError(err);
        });
    });
  };

  saveDraft = (e) => {
    if (e) {
      e.preventDefault();
    }

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        Object.keys(err).forEach((item, index) => {
          if (item !== 'timeRange') {
            this.props.form.setFields({
              [item]: { value: fieldsValue[item] }
            });
          }
        });
        if (err['timeRange']) {
          return;
        }
      }

      this.setState({
        saveDraftBtnLoading: true,
        disabled: true
      });
      const formData = performanceCommon.initFormData(fieldsValue);
      T.post(`${CONFIG.frontPath}/performance/savePerformanceDraft.json`, {
        ...formData.params,
        status: 'SET_GOALS',
        id: CONFIG.options.id,
        assessObjectId: CONFIG.options.assessObjectId
      })
        .then(() => {
          message.success('存草稿成功!');

          setTimeout(() => {
            window.location.href = `${CONFIG.frontPath}/performance/myPerformanceQuery.htm`;
          }, 2000);
        })
        .catch((err) => {
          this.setState({
            saveDraftBtnLoading: false,
            disabled: false
          });
          T.showError(err);
        });
    });
  };

  getHistoryList = async (page = 1) => {
    try {
      const data = await T.get('/performance/performanceOperationLogQuery.json', {
        currentPage: page,
        id: CONFIG.options.id,
        objectType: 'PERFORMANCE_DRAFT'
      });
      const { logPageQueryResult = {} } = data;
      const { list = [], paginator = {} } = logPageQueryResult || {};
      this.setState({
        HistoryListMsg: {
          list,
          paginator
        }
      });
    } catch (err) {
      T.showErrorMessage(err);
    }
  }

  changeHistoryPage = (currentPage) => {
    this.getHistoryList(currentPage);
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { loading, saveDraftBtnLoading, disabled, saveDraftBtnDisabled, HistoryListMsg, } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      }
    };

    const formItemLayoutAddBox = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 2 }
      }
    };

    getFieldDecorator('keys', { initialValue: keysValue });
    const keys = getFieldValue('keys');
    const performanceItems = keys.map((k, index) => {
      const performanceData = CONFIG.options.contentMap || {};
      // 字符转译后再吧br标签转\n
      let goalDescription = T.escape2Html(performanceData[`goalDescription_${k}`] || '');
      goalDescription = T.return2n(goalDescription);
      return (
        <div className="add-box" key={k}>
          <Row>
            <Col span={2} className="ant-form-item-label ant-form-item-no-colon">
              {index === 0 ? <label className="ant-form-item-required">目标项</label> : ''}
            </Col>
            <Col span={14} className="box_default_background_color pull_left">
              <FormItem {...formItemLayoutAddBox} label="目标项" key={`goalName_${k}`} colon={false}>
                {getFieldDecorator(`goalName_${k}`, {
                  initialValue: performanceData[`goalName_${k}`],
                  rules: [{ required: true, message: '请填写目标项' }]
                })(<Input placeholder="请输入目标，最多100字" maxLength={100} />)}
              </FormItem>
              <FormItem {...formItemLayoutAddBox} label="描述" key={`goalDescription_${k}`} colon={false}>
                {getFieldDecorator(`goalDescription_${k}`, {
                  initialValue: goalDescription,
                  rules: [
                    { required: true, message: '请填写描述' },
                    { max: 5000, message: '字数不大于5000字' }
                  ]
                })(<TextArea placeholder="请填写描述,最多5000字" rows={8} maxLength={5000} />)}
              </FormItem>
              <div style={{ position: 'relative' }}>
                <FormItem {...formItemLayoutAddBox} label="权重" key={`goalWeight_${k}`} colon={false}>
                  {getFieldDecorator(`goalWeight_${k}`, {
                    initialValue: performanceData[`goalWeight_${k}`]
                      ? parseInt(performanceData[`goalWeight_${k}`], 10)
                      : '',
                    rules: [
                      {
                        required: true,
                        message: '请填写权重'
                      },
                      {
                        pattern: T.positiveInteger,
                        message: '请输入1-100的自然数'
                      }
                    ]
                  })(<InputNumber placeholder="请输入" className="input_width weight-percent" max={100} min={0} />)}
                </FormItem>
              </div>
            </Col>
            <Col className="pull_left add_btn_wrapper">
              {keys.length === 1 ? (
                <a href="javascript:;" onClick={(e) => this.add(e)} className="mr10">
                  添加
                </a>
              ) : index === 0 ? (
                <a href="javascript:;" onClick={(e) => this.add(e)} className="mr10">
                  添加
                </a>
              ) : (
                <a href="javascript:;" onClick={(e) => this.remove(e, k)} className="mr10">
                  删除
                </a>
              )}
              {keys.length === 1 ? (
                ''
              ) : index === 0 ? (
                <a href="javascript:;" onClick={(e) => this.remove(e, k)} className="mr10">
                  删除
                </a>
              ) : (
                ''
              )}
            </Col>
          </Row>
        </div>
      );
    });
    const { nickName, name = '', status } = CONFIG.options;
    const curStatusIdx = CONFIG.statusArr
      ? CONFIG.statusArr.findIndex(i => i.value === status)
      : 0;
    const { confirmUser, teamManager, assessUser } = CONFIG.options;

    return (
        <BasicLayout>
          <div className="content-wrapper">
          {OBJECT_TYPE === 'PERFORMANCE_DRAFT'
            ? (
              <Row  className="performance-time">
                <Col span={5}>
                  <span className="time">
                    保存时间：{CONFIG.options.gmtModified}
                  </span>
                </Col>
                <Col span={19}>
                  <Steps progressDot current={curStatusIdx}>
                    {
                      CONFIG.statusArr.map(i => {
                        let manager;
                        switch (i.value) {
                          case 'CONFIRM_GOALS':
                              manager = confirmUser;
                              break;
                          case 'SUPERIOR_ASSESSMENT':
                              manager = assessUser;
                              break;
                          case 'MANAGER_CONFIRM':
                                manager = teamManager;
                                break;
                          default:
                              manager = '';
                        }
                        return <Steps.Step title={i.label} description={manager} />;
                      })
                    }
                  </Steps>
                </Col>
              </Row>
            )
            : null
          }
          <Form
            name="createPerformanceForm"
            method="post"
            noValidate="novalidate"
            onSubmit={(e) => this.handleSubmit(e)}
            className="antd_form_horizontal"
          >
            <FormItem {...formItemLayout} label="考核对象" key="nickName" colon={false}>
              <span>{nickName}</span>
            </FormItem>

            <FormItem {...formItemLayout} label="考核名称" key="name" colon={false}>
              {getFieldDecorator('name', {
                initialValue: name
              })(<span>{name}</span>)}
            </FormItem>
            <FormItem {...formItemLayout} label="考核类型" key="performanceTypeCode" colon={false}>
              {getFieldDecorator('performanceTypeCode', {
                initialValue: this.state.performanceTypeCode,
              })(
                <span>{performanceTypeCodeMap[this.state.performanceTypeCode]}</span>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="时间" key="timeRange" colon={false}>
              {getFieldDecorator('timeRange', {
                initialValue: this.state.timeRange
              })(
                <span>
                  {this.state.performanceTypeCode === 'QUARTER_PERFORMANCE'
                    ? `${CONFIG.options.year}年${this.state.timeRange}`
                    : `${this.state.timeRange}年`}
                </span>
              )}
            </FormItem>

            {performanceItems}

            <FormItem {...formItemLayoutWithOutLabel} className="foot-group-btn">
              <Button type="primary" htmlType="submit" loading={loading} disabled={disabled}>
                提交目标
              </Button>
              <Button onClick={() => this.handleClickGoBackBtn()}>返回</Button>
              <Button loading={saveDraftBtnLoading} disabled={saveDraftBtnDisabled} onClick={(e) => this.saveDraft(e)}>
                存草稿
              </Button>
            </FormItem>
          </Form>
          </div>
          <HistoryList HistoryListMsg={HistoryListMsg} onChangePage={this.changeHistoryPage} />
        </BasicLayout>
    );
  }
}

const WrappedCreatePerformanceForm = Form.create()(CreatePerformanceForm);
const mountNode = document.getElementById('root');

ReactDOM.render(<WrappedCreatePerformanceForm />, mountNode);
