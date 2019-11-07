/*
 * @Description: 绩效-编辑/查看我的绩效考核
 * @Author: qianqian
 * @Date: 2019-02-19 15:24:06
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-07 16:58:01
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import performanceCommon from 'modules/performanceCommon';
import 'styles/performance/myPerformanceEdit.less';
import HistoryList from 'components/performance/performanceReviewEdit/HistoryList';

const { Form, Input, Button, Select, message, Modal, Row, Col, LocaleProvider, zh_CN, Steps, } = window.antd;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
let keysValue = CONFIG.options.keysValue || [1];
const performanceTypeCodeMap = { QUARTER_PERFORMANCE: '季度考核', ANNUAL_PERFORMANCE: '年度考核' };
// 考核状态
const PERFORMANCE_STAYUS = CONFIG.options.status;
// 考核是草稿还是提交状态
const OBJECT_TYPE = T.tool.getQueryString('objectType');
// 自评总分
let selfTotalScore = 0;
// 是否是审批目标
const ISGOAL = PERFORMANCE_STAYUS.indexOf('GOALS') !== -1;
class PerformanceForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      disabled: false,
      saveDraftBtnLoading: false,
      saveDraftBtnDisabled: false,
      withdrawBtnLoading: false,
      selfScore: '-',
      score: '-',
      theoreticalValue: '-',
      HistoryListMsg: {}, // 历史记录列表对象
    };
  }

  // 进入页面要运行的函数
  componentDidMount() {
    CONFIG.options.id && this.getHistoryList();

    // 回填数据
    // this.backfillData();
    // 页面条状或者刷新的时候提示用户是否要离开本页面
    window.onunload = () => {
      this.showConfirm();
    };
  }

  // 表单提交
  handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const formData = performanceCommon.initFormData({ ...fieldsValue, keys: keysValue });

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
        status: PERFORMANCE_STAYUS,
        id: CONFIG.options.id,
        assessObjectId: CONFIG.options.assessObjectId,
        year: CONFIG.options.year
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
          // 状态改变 需要返回上一页
          if (T.getErrorCode(err) === 'PERFORMANCE_ASSESSMENT_HAS_CHANGED') {
            T.showErrorMessage(err);
            setTimeout(() => {
              window.location.href = `${CONFIG.frontPath}/performance/myPerformanceQuery.htm`;
            }, 2000);
          } else {
            T.showError(err);
          }
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
      const formData = performanceCommon.initFormData({ ...fieldsValue, keys: keysValue });

      T.post(`${CONFIG.frontPath}/performance/selfAssessmentPerformanceDraft.json`, {
        ...formData.params,
        status: PERFORMANCE_STAYUS,
        id: CONFIG.options.id,
        assessObjectId: CONFIG.options.assessObjectId,
        year: CONFIG.options.year ? CONFIG.options.year : undefined
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
          // 状态改变 需要返回上一页
          if (T.getErrorCode(err) === 'PERFORMANCE_ASSESSMENT_HAS_CHANGED') {
            T.showErrorMessage(err);
            setTimeout(() => {
              window.location.href = `${CONFIG.frontPath}/performance/myPerformanceQuery.htm`;
            }, 2000);
          } else {
            T.showError(err);
          }
        });
    });
  };

  // 撤回
  handleClickWithdrawBtn = (e) => {
    if (e) {
      e.preventDefault();
    }
    const url = ISGOAL
      ? `${CONFIG.frontPath}/performance/recallPerformanceGoal.json`
      : `${CONFIG.frontPath}/performance/recallPerformanceSelfAssessment.json
    `;
    this.setState({
      withdrawBtnLoading: true
    });
    T.post(url, {
      id: CONFIG.options.id,
      status: PERFORMANCE_STAYUS
    })
      .then((data) => {
        message.success('撤回成功!');
        // this.setState({
        //   withdrawBtnLoading: false
        // });
        setTimeout(() => {
          window.location.href = `${CONFIG.frontPath}/performance/myPerformanceQuery.htm`;
        }, 2000);
      })
      .catch((err) => {
        this.setState({
          withdrawBtnLoading: false
        });
        // 状态改变 需要返回上一页
        if (T.getErrorCode(err) === 'PERFORMANCE_ASSESSMENT_HAS_CHANGED') {
          T.showErrorMessage(err);
          setTimeout(() => {
            window.location.href = `${CONFIG.frontPath}/performance/myPerformanceQuery.htm`;
          }, 2000);
        } else {
          T.showError(err);
        }
      });
  };

  handlePerformanceTypeChange = (e) => {
    this.setState({
      performanceType: e.target.value
    });
  };

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
      title: '确定退出吗？',
      onOk() {
        if (callback) {
          callback();
        }
      }
    });
  };
  // 自评分
  createSelfRatingOption = () => {
    const rating = CONFIG.options.scoreMap;
    return Object.keys(rating).map((item, index) => {
      return (
        <Option value={item} key={item}>
          {rating[item]}
        </Option>
      );
    });
  };

  getHistoryList = async (page = 1) => {
    try {
      const data = await T.get('/performance/performanceOperationLogQuery.json', {
        currentPage: page,
        id: CONFIG.options.id,
        objectType: (OBJECT_TYPE === 'PERFORMANCE_DRAFT')
          ? 'PERFORMANCE_DRAFT'
          : 'PERFORMANCE_ASSESSMENT'
      });
      const {  logPageQueryResult = {} } = data;
      const { list = [], paginator = {}, } = logPageQueryResult;
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
    const { getFieldDecorator } = this.props.form;
    const { loading, saveDraftBtnLoading, withdrawBtnLoading, disabled, saveDraftBtnDisabled, HistoryListMsg, } = this.state;
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
      wrapperCol: { span: 14 }
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 2 }
      }
    };
    selfTotalScore = 0; // 初始化
    const performanceItems = keysValue.map((k, index) => {
      const performanceData = CONFIG.options.contentMap;
      const scoreMap = CONFIG.options.scoreMap;
      // 自评分计算
      if (performanceData[`goalWeight_${k}`] && performanceData[`selfScore_${k}`]) {
        selfTotalScore = performanceCommon.totalScore(
          selfTotalScore,
          performanceData[`goalWeight_${k}`],
          scoreMap[performanceData[`selfScore_${k}`]]
        );
      }

      // 字符转译后再吧br标签转\n
      let goalDescription = T.escape2Html(performanceData[`goalDescription_${k}`] || '');
      let goalSummary = T.escape2Html(performanceData[`goalSummary_${k}`] || '');

      return (
        <div className="add-box" key={k}>
          <Row>
            <Col span={2} className="ant-form-item-label ant-form-item-no-colon">
              {index === 0 ? <label className="ant-form-item-required">目标项</label> : ''}
            </Col>
            <Col span={14} className="box_default_background_color pull_left">
              <FormItem {...formItemLayoutAddBox} key={`id_${k}`} colon={false}>
                {getFieldDecorator(`id_${k}`, {
                  initialValue: performanceData[`id_${k}`]
                })(<Input type="hidden" />)}
              </FormItem>
              <FormItem {...formItemLayoutAddBox} className="line" label="目标项" key={`goalName_${k}`} colon={false}>
                {getFieldDecorator(`goalName_${k}`, {
                  initialValue: performanceData[`goalName_${k}`]
                })(<span>{performanceData[`goalName_${k}`] || '-'}</span>)}
              </FormItem>
              <FormItem
                {...formItemLayoutAddBox}
                className="multiline-text line"
                label="描述"
                key={`goalDescription_${k}`}
                colon={false}
              >
                {getFieldDecorator(`goalDescription_${k}`, {
                  initialValue: T.return2n(goalDescription)
                })(<span dangerouslySetInnerHTML={{ __html: goalDescription || '-' }} />)}
              </FormItem>
              {/* 状态是提交目标之后 锁定目标之前的话 formItem不需要加虚线（line样式） */}
              <FormItem
                {...formItemLayoutAddBox}
                className={PERFORMANCE_STAYUS === 'CONFIRM_GOALS' ? '' : 'line'}
                label="权重"
                key={`goalWeight_${k}`}
                colon={false}
              >
                {getFieldDecorator(`goalWeight_${k}`, {
                  initialValue: performanceData[`goalWeight_${k}`]
                })(<span>{`${performanceData[`goalWeight_${k}`] || '-'}%`}</span>)}
              </FormItem>
              {/* 填写自评 SELF_ASSESSMENT（目标被锁定状态、自评未填写状态、自评未提交/草稿状态）start */}
              {PERFORMANCE_STAYUS === 'SELF_ASSESSMENT' ? (
                <React.Fragment>
                  <FormItem
                    {...formItemLayoutAddBox}
                    style={{ marginTop: 12 }}
                    label="自评总结"
                    key={`goalSummary_${k}`}
                    colon={false}
                    className="multiline-text"
                  >
                    {getFieldDecorator(`goalSummary_${k}`, {
                      initialValue: T.return2n(goalSummary),
                      rules: [
                        { required: true, message: '请填写自评总结' },
                        { max: 5000, message: '字数不大于5000字' }
                      ]
                    })(<TextArea placeholder="请填写自评总结，最多5000字" rows={8} maxLength={5000} />)}
                  </FormItem>
                  <FormItem {...formItemLayoutAddBox} label="自评分" key={`selfScore_${k}`} colon={false}>
                    {getFieldDecorator(`selfScore_${k}`, {
                      initialValue: performanceData[`selfScore_${k}`],
                      rules: [{ required: true, message: '请填写自评分' }]
                    })(
                      <Select className="input_width" placeholder="选择自评分">
                        {this.createSelfRatingOption()}
                      </Select>
                    )}
                  </FormItem>
                </React.Fragment>
              ) : null}

              {/* end */}

              {/* 查看自评 SUPERIOR_ASSESSMENT（自评提交但未审批状态，可撤回） start*/}
              {(PERFORMANCE_STAYUS === 'SUPERIOR_ASSESSMENT')
                || (PERFORMANCE_STAYUS === 'MANAGER_CONFIRM')
                || (PERFORMANCE_STAYUS === 'HR_CONFIRM')
                || (PERFORMANCE_STAYUS === 'FINISH')
                ? (
                  <React.Fragment>
                    <FormItem
                      {...formItemLayoutAddBox}
                      className="line"
                      label="自评总结"
                      key={`goalSummary_${k}`}
                      colon={false}
                    >
                      <span dangerouslySetInnerHTML={{ __html: goalSummary || '-' }} />
                    </FormItem>
                    <FormItem {...formItemLayoutAddBox} label="自评分" key={`selfScore_${k}`} colon={false}>
                      <span>{scoreMap[performanceData[`selfScore_${k}`]] || '-'}</span>
                    </FormItem>

                    <FormItem
                      {...formItemLayoutAddBox}
                      className="performance-result"
                      label="上级权重"
                      key={`superiorWeight_${k}`}
                      colon={false}
                    >
                      <span className="inline">{performanceData[`superiorWeight_${k}`] || '-'}</span>
                      <label>上级评分</label>
                      <span className="inline">{scoreMap[performanceData[`superiorScore_${k}`]] || '-'}</span>
                    </FormItem>
                  </React.Fragment>
                )
                : null
              }

              {/* end */}
            </Col>
          </Row>
        </div>
      );
    });
    const { nickName, name, performanceTypeCode, timeRange, scoreMap, superiorTotalScore, status } = CONFIG.options;
    const curStatusIdx = CONFIG.statusArr.findIndex(i => i.value === status);
    const { confirmUser, teamManager, assessUser } = CONFIG.options;

    return (
      <LocaleProvider locale={zh_CN}>
        <BasicLayout>
          <div className="content-wrapper">
          <Row className="performance-time">
            <Col span={5}>
              <span className="time">
              {
                OBJECT_TYPE === 'PERFORMANCE_DRAFT'
                  ? '保存时间:'
                  : '发布时间:'
              }
              {CONFIG.options.gmtModified}
              </span>
            </Col>
            <Col span={19}>
              <Steps progressDot current={curStatusIdx}>
                {
                  CONFIG.statusArr.map(i => {
                    let manager; // 负责人
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
                    return <Steps.Step title={i.label} description={manager}  />;
                  })
                }
              </Steps>
            </Col>
          </Row>
          <Form
            name="createPerformanceForm"
            method="post"
            noValidate="novalidate"
            onSubmit={(e) => this.handleSubmit(e)}
            className="antd_form_horizontal"
          >
            {PERFORMANCE_STAYUS === 'FINISH' ? (
              <FormItem {...formItemLayoutWithOutLabel}>
                <div className="performance-result-box">
                  <div className="result-score-wrap">
                    <p className="result-tip">上级评分总分</p>
                    <p className="result-score">{scoreMap[CONFIG.options.superiorTotalScore]}</p>
                  </div>
                  <div className="result-info">
                    <p>上级：{CONFIG.options.superNickName}</p>
                    <p>时间：{CONFIG.options.gmtModified}</p>
                  </div>
                </div>
              </FormItem>
            ) : null}
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
                initialValue: performanceTypeCode
              })(<span>{performanceTypeCodeMap[performanceTypeCode]}</span>)}
            </FormItem>
            <FormItem {...formItemLayout} label="时间" key="timeRange" colon={false}>
              {getFieldDecorator('timeRange', {
                initialValue: timeRange
              })(
                <span>
                  {performanceTypeCode === 'QUARTER_PERFORMANCE'
                    ? `${CONFIG.options.year}年${timeRange}`
                    : `${timeRange}年`}
                </span>
              )}
            </FormItem>

            {/* 目标项 */}
            {performanceItems}

            {/* 提交自评之后 */}
            {(PERFORMANCE_STAYUS === 'MANAGER_CONFIRM')
              || (PERFORMANCE_STAYUS === 'SUPERIOR_ASSESSMENT')
              || (PERFORMANCE_STAYUS === 'HR_CONFIRM')
              || (PERFORMANCE_STAYUS === 'FINISH') ? (
              <React.Fragment>
                <Row className="performance-total">
                  <Col span={2} />
                  <Col span={14}>
                    <FormItem {...formItemLayoutAddBox} className="line" label="自评总分" key="selfScore" colon={false}>
                      <span>{selfTotalScore}</span>
                    </FormItem>
                  </Col>
                </Row>
                <Row className="performance-total">
                  <Col span={2} />
                  <Col span={14}>
                    <FormItem {...formItemLayoutAddBox} className="line" label="上级评分总分" key="score" colon={false}>
                      <span className={PERFORMANCE_STAYUS === 'FINISH' ? 'text-result' : ''}>
                        {superiorTotalScore ? scoreMap[superiorTotalScore] : '-'}
                      </span>
                    </FormItem>
                  </Col>
                </Row>
                <Row className="performance-total">
                  <Col span={2} />
                  <Col span={14}>
                    <FormItem {...formItemLayoutAddBox} className="line" label="上级评语" key="score" colon={false}>
                      <div dangerouslySetInnerHTML={{__html: T.escape2Html(CONFIG.options.comment || '') || '无'}}></div>
                    </FormItem>
                  </Col>
                </Row>
              </React.Fragment>
            ) : null}

            <FormItem {...formItemLayoutWithOutLabel} className="foot-group-btn">
              {/* 编辑目标 编辑自评 */}
              {PERFORMANCE_STAYUS === 'SET_GOALS' || PERFORMANCE_STAYUS === 'SELF_ASSESSMENT' ? (
                <React.Fragment>
                  <Button type="primary" htmlType="submit" loading={loading} disabled={disabled}>
                    {ISGOAL ? '提交目标' : '提交自评'}
                  </Button>
                  <Button onClick={() => this.handleClickGoBackBtn()}>返回</Button>
                  <Button
                    loading={saveDraftBtnLoading}
                    disabled={saveDraftBtnDisabled}
                    onClick={(e) => this.saveDraft(e)}
                  >
                    存草稿
                  </Button>
                </React.Fragment>
              ) : null}

              {/* 提交目标之后 锁定目标之前 或 提交自评之后 完成考核之前 有撤回按钮 */}
              {CONFIG.options.hasAuthority === 'true' &&
              (PERFORMANCE_STAYUS === 'CONFIRM_GOALS' || PERFORMANCE_STAYUS === 'SUPERIOR_ASSESSMENT') ? (
                <Button type="primary" loading={withdrawBtnLoading} onClick={(e) => this.handleClickWithdrawBtn(e)}>
                  {ISGOAL ? '撤回目标' : '撤回自评'}
                </Button>
              ) : null}
            </FormItem>
          </Form>
          </div>
          { PERFORMANCE_STAYUS === 'FINISH'
              ? null
              : <HistoryList HistoryListMsg={HistoryListMsg} onChangePage={this.changeHistoryPage} />
          }
        </BasicLayout>
      </LocaleProvider>
    );
  }
}

const WrappedPerformanceForm = Form.create()(PerformanceForm);
const mountNode = document.getElementById('root');

ReactDOM.render(<WrappedPerformanceForm />, mountNode);
