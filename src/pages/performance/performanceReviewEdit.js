/*
 * @Description: 绩效-绩效点评
 * @Author: qianqian
 * @Date: 2019-02-19 15:24:06
 * @Last Modified by: danding
 * @Last Modified time: 2019-07-10 19:08:34
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import performanceCommon from 'modules/performanceCommon';
import 'styles/performance/performanceReviewEdit.less';
import RefuseModal from 'components/performance/performanceReviewEdit/RefuseModal';
import HistoryList from 'components/performance/performanceReviewEdit/HistoryList';

const { Form, Input, InputNumber, Button, Select, message, Modal, Row, Col, LocaleProvider, zh_CN, Steps } = window.antd;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
let keysValue = CONFIG.options.keysValue || [1];
const performanceTypeCodeMap = { QUARTER_PERFORMANCE: '季度考核', ANNUAL_PERFORMANCE: '年度考核' };

// 考核状态
const PERFORMANCE_STAYUS = CONFIG.options.status;
// 是否是审批目标
const ISGOAL = PERFORMANCE_STAYUS.indexOf('GOALS') !== -1;

let selfTotalScore = 0; // 自评总分
let theoreticalValue = 0; // 上级评分理论值

class performanceForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      disabled: false,
      repulseBtnLoading: false,
      repulseBtnDisabled: false,
      revokeBtnLoading: false,
      selfScore: '-',
      score: '-',
      showRefuseModal: false, // 显示打回弹窗
      HistoryListMsg: {}, // 历史记录列表对象
    };
  }

  // 初始化上级的评分权重
  initSuperiorScore() {
    keysValue.forEach((k, index) => {
      const performanceData = CONFIG.options.contentMap;
      if (performanceData[`superiorWeight_${k}`] && performanceData[`superiorScore_${k}`]) {
        this.setState({
          [`superiorWeight_${k}`]: performanceData[`superiorWeight_${k}`],
          [`superiorScore_${k}`]: performanceData[`superiorScore_${k}`]
        });
      }
    });
  }

  // 进入页面要运行的函数
  componentDidMount() {
    this.getHistoryList();
    this.initSuperiorScore();

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
      // 锁定目标提交的接口地址
      let url = `${CONFIG.frontPath}/performance/confirmPerformanceGoal.json`;
      let params = {
        status: PERFORMANCE_STAYUS,
        id: CONFIG.options.id
      };

      // 完成考核
      if (!ISGOAL) {
        const formData = performanceCommon.initFormData({ ...fieldsValue, keys: keysValue });
        // 判断权重总和是否到100
        if (formData.count1 !== 100) {
          Modal.error({
            title: '提示',
            content: '无法提交，权重和不等于100%'
          });
          return;
        }
        // 完成考核的接口地址
        url = `${CONFIG.frontPath}/performance/finishPerformanceAssess.json`;
        // 锁定目标的话只需要id和状态
        params = {
          ...params,
          selfTotalScore: fieldsValue.selfTotalScore,
          assessObjectId: CONFIG.options.assessObjectId,
          superiorTotalScore: fieldsValue.superiorTotalScore,
          ...formData.params,
          comment: T.return2Br(fieldsValue.comment || '')
        };
      }
      this.setState({
        loading: true,
        repulseBtnDisabled: true
      });
      T.post(url, params)
        .then(() => {
          message.success('提交成功!');

          setTimeout(() => {
            window.location.href = `${CONFIG.frontPath}/performance/performanceReviewQuery.htm`;
          }, 2000);
        })
        .catch((err) => {
          this.setState({
            loading: false,
            repulseBtnDisabled: false
          });
          // 状态改变 需要返回上一页
          if (T.getErrorCode(err) === 'PERFORMANCE_ASSESSMENT_HAS_CHANGED') {
            T.showErrorMessage(err);
            setTimeout(() => {
              window.location.href = `${CONFIG.frontPath}/performance/performanceReviewQuery.htm`;
            }, 2000);
          } else {
            T.showError(err);
          }
        });
    });
  };

  handleRepulse = (extraVals) => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        Object.keys(err).forEach((item, index) => {
          this.props.form.setFields({
            [item]: { value: fieldsValue[item] }
          });
        });
      }

      this.setState({
        repulseBtnLoading: true,
        disabled: true
      });
      let url = CONFIG.canRefuse
        ? `${CONFIG.frontPath}/performance/refusePerformanceInManagerConfirm.json`
        : `${CONFIG.frontPath}/performance/refusePerformance.json`;
      let params = {
        status: PERFORMANCE_STAYUS,
        id: CONFIG.options.id,
        ...extraVals,
      };

      // 是否可以显示更高上级的打回功能
      if (CONFIG.canRefuse) {
        params.performanceAssessmentId = CONFIG.options.id;
      }

      if (!ISGOAL) {
        const formData = performanceCommon.initFormData({ ...fieldsValue, keys: keysValue });
        params = {
          ...params,
          ...formData.params,
          ...extraVals,
        };
      }

      T.post(url, params)
        .then(() => {
          message.success('打回成功!');

          setTimeout(() => {
            window.location.href = `${CONFIG.frontPath}/performance/performanceReviewQuery.htm`;
          }, 2000);
        })
        .catch((err) => {
          this.setState({
            repulseBtnLoading: false,
            disabled: false
          });
          // 状态改变 需要返回上一页
          if (T.getErrorCode(err) === 'PERFORMANCE_ASSESSMENT_HAS_CHANGED') {
            T.showErrorMessage(err);
            setTimeout(() => {
              window.location.href = `${CONFIG.frontPath}/performance/performanceReviewQuery.htm`;
            }, 2000);
          } else {
            T.showError(err);
          }
        });
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
  handleChangeSuperiorScore = (value, k) => {
    this.setState({
      [`superiorScore_${k}`]: value
    });
  };
  handleChangeSuperiorWeight = (value, k) => {
    this.setState({
      [`superiorWeight_${k}`]: value
    });
  };

  hideRefuseModal = () => {
    this.setState({
      showRefuseModal: false
    });
  }

  showRefuseModal = () => {
    this.setState({
      showRefuseModal: true
    });
  }

  getHistoryList = async (page = 1) => {
    try {
      const data = await T.get('/performance/performanceOperationLogQuery.json', {
        currentPage: page,
        id: CONFIG.options.id,
        objectType: 'PERFORMANCE_ASSESSMENT'
      });
      const {  logPageQueryResult } = data;
      const { list = [], paginator, } = logPageQueryResult;
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

  // 锁定目标
  lockGoal = () => {
    confirm({
      title: '操作提示',
      content: '目标锁定后，将进入自评阶段，目标内容不可修改，确定继续吗？',
      onOk: () => {
        this.handleSubmit();
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, repulseBtnLoading, disabled, repulseBtnDisabled, showRefuseModal, HistoryListMsg } = this.state;
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
      wrapperCol: { span: 16 }
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 2 }
      }
    };
    selfTotalScore = 0; // 自评分初始化
    theoreticalValue = 0; // 理论值初始化
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

      if (this.state[`superiorWeight_${k}`] && this.state[`superiorScore_${k}`]) {
        // 计算上级评分理论值
        theoreticalValue = performanceCommon.totalScore(
          theoreticalValue,
          this.state[`superiorWeight_${k}`],
          scoreMap[this.state[`superiorScore_${k}`]]
        );
      }

      // 字符转译后再吧br标签转\n
      let goalDescription = T.escape2Html(performanceData[`goalDescription_${k}`] || '') || '-';
      let goalSummary = T.escape2Html(performanceData[`goalSummary_${k}`] || '') || '-';

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
                  initialValue: goalDescription
                })(<span dangerouslySetInnerHTML={{ __html: goalDescription }} />)}
              </FormItem>
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

              {/* 上级考核 结束 */}
              {(PERFORMANCE_STAYUS === 'SUPERIOR_ASSESSMENT')
                || (PERFORMANCE_STAYUS === 'FINISH')
                || (PERFORMANCE_STAYUS === 'MANAGER_CONFIRM')
                || (PERFORMANCE_STAYUS === 'HR_CONFIRM')
              ? (
                <React.Fragment>
                  <FormItem
                    {...formItemLayoutAddBox}
                    className="multiline-text line"
                    label="自评总结"
                    key={`goalSummary_${k}`}
                    colon={false}
                  >
                    {getFieldDecorator(`goalSummary_${k}`, {
                      initialValue: goalSummary
                    })(<span dangerouslySetInnerHTML={{ __html: goalSummary }} />)}
                  </FormItem>
                  <FormItem {...formItemLayoutAddBox} label="自评分" key={`selfScore_${k}`} colon={false}>
                    {getFieldDecorator(`selfScore_${k}`, {
                      initialValue: performanceData[`selfScore_${k}`]
                    })(<span>{scoreMap[performanceData[`selfScore_${k}`]] || '-'}</span>)}
                  </FormItem>
                </React.Fragment>
              ) : null}

              {/* 上级点评 start*/}
              {PERFORMANCE_STAYUS === 'SUPERIOR_ASSESSMENT' ? (
                <React.Fragment>
                  <FormItem
                    labelCol= {{ span: 8 }}
                    wrapperCol= {{ span: 11 }}
                    className="form-item-inline superior_weight"
                    label="上级权重"
                    key={`superiorWeight_${k}`}
                    colon={false}
                  >
                    {getFieldDecorator(`superiorWeight_${k}`, {
                      initialValue: performanceData[`superiorWeight_${k}`],
                      rules: [
                        {
                          required: true,
                          message: '请填写上级权重'
                        },
                        {
                          pattern: T.positiveInteger,
                          message: '请输入1-100的自然数'
                        }
                      ]
                    })(
                        <InputNumber
                          className="input_width"
                          min={0}
                          onChange={(value) => this.handleChangeSuperiorWeight(value, k)}
                        />
                    )}
                  </FormItem>
                  <FormItem
                    labelCol= {{ span: 8 }}
                    wrapperCol= {{ span: 16 }}
                    className="form-item-inline"
                    label="上级评分"
                    key={`superiorScore_${k}`}
                    colon={false}
                  >
                    {getFieldDecorator(`superiorScore_${k}`, {
                      initialValue: performanceData[`superiorScore_${k}`],
                      rules: [{ required: true, message: '请填写评分' }]
                    })(
                      <Select
                        className="input_width"
                        placeholder="选择评分"
                        onChange={(value) => this.handleChangeSuperiorScore(value, k)}
                      >
                        {this.createSelfRatingOption()}
                      </Select>
                    )}
                  </FormItem>
                </React.Fragment>
              ) : null}

              {/* end */}
              {(PERFORMANCE_STAYUS === 'FINISH')
                || (PERFORMANCE_STAYUS === 'MANAGER_CONFIRM')
                || (PERFORMANCE_STAYUS === 'HR_CONFIRM')
                ? (
                <FormItem
                  {...formItemLayoutAddBox}
                  className="performance-result"
                  label="上级权重"
                  key={`superiorWeight_${k}`}
                  colon={false}
                >
                  <span className="inline">{performanceData[`superiorWeight_${k}`] || '-'}%</span>
                  <label>上级评分</label>
                  <span className="inline">{scoreMap[performanceData[`superiorScore_${k}`]] || '-'}</span>
                </FormItem>
              ) : null}
            </Col>
          </Row>
        </div>
      );
    });
    const { nickName, name, performanceTypeCode, timeRange, scoreMap, status } = CONFIG.options;
    const curStatusIdx = CONFIG.statusArr.findIndex(i => i.value === status);
    const { confirmUser, teamManager, assessUser } = CONFIG.options;

    return (
      <LocaleProvider locale={zh_CN}>
        <BasicLayout>
          <div className="content-wrapper">
          <Row className="performance-time">
            <Col span={5}>
              <span className="time">
              发布时间：
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
                    return <Steps.Step title={i.label} description={manager} />;
                  })
                }
              </Steps>
            </Col>
          </Row>
          <Form
            name="performanceForm"
            method="post"
            noValidate="novalidate"
            onSubmit={(e) => this.handleSubmit(e)}
            className="antd_form_horizontal"
          >
            {(PERFORMANCE_STAYUS === 'FINISH') ? (
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

            {/* 自评分 */}
            {(PERFORMANCE_STAYUS === 'SUPERIOR_ASSESSMENT')
             || (PERFORMANCE_STAYUS === 'FINISH')
              || (PERFORMANCE_STAYUS === 'MANAGER_CONFIRM')
              || (PERFORMANCE_STAYUS === 'HR_CONFIRM')
               ? (
              <Row className="performance-total">
                <Col span={2} />
                <Col span={14}>
                  <FormItem
                    {...formItemLayoutAddBox}
                    className="line"
                    label="自评总分"
                    key="selfTotalScore"
                    colon={false}
                  >
                    {getFieldDecorator('selfTotalScore', {
                      initialValue: selfTotalScore
                    })(<span>{selfTotalScore}</span>)}
                  </FormItem>
                </Col>
              </Row>
            ) : null}

            {/* 上级点评 */}
            {PERFORMANCE_STAYUS === 'SUPERIOR_ASSESSMENT' ? (
              <Row className="performance-total">
                <Col span={2} />
                <Col span={14}>
                  <div style={{ position: 'relative' }}>
                    <FormItem
                      {...formItemLayoutAddBox}
                      className="line"
                      label="上级评分总分"
                      key="superiorTotalScore"
                      colon={false}
                    >
                      {getFieldDecorator('superiorTotalScore', {
                        initialValue: CONFIG.options.superiorTotalScore,
                        rules: [{ required: true, message: '请填写最终总分' }]
                      })(
                        <Select className="input_width" placeholder="选择最终总分">
                          {this.createSelfRatingOption()}
                        </Select>
                      )}
                    </FormItem>
                    {PERFORMANCE_STAYUS === 'SUPERIOR_ASSESSMENT' ? (
                      <span className="text-tip">理论值 {theoreticalValue}</span>
                    ) : null}
                  </div>
                </Col>
              </Row>
            ) : null}

            {/* 考核结束 */}
            {(PERFORMANCE_STAYUS === 'FINISH')
              || (PERFORMANCE_STAYUS === 'MANAGER_CONFIRM')
              || (PERFORMANCE_STAYUS === 'HR_CONFIRM')
             ? (
              <Row className="performance-total">
                <Col span={2} />
                <Col span={14}>
                  <FormItem
                    {...formItemLayoutAddBox}
                    className="line"
                    label="上级评分总分"
                    key="superiorTotalScore"
                    colon={false}
                  >
                    <span className="text-result">{scoreMap[CONFIG.options.superiorTotalScore]}</span>
                  </FormItem>
                </Col>
              </Row>
            ) : null}

            {/* 上级点评 */}
            {PERFORMANCE_STAYUS === 'SUPERIOR_ASSESSMENT' ? (
              <Row className="performance-total">
                <Col span={2} />
                <Col span={14}>
                  <div style={{ position: 'relative' }}>
                    <FormItem
                      {...formItemLayoutAddBox}
                      className="line"
                      label="上级评语"
                      colon={false}
                    >
                      {getFieldDecorator('comment', { initialValue: T.return2n(T.escape2Html(T.escape2Html(CONFIG.options.comment || ''))) })(
                        <Input.TextArea
                          autosize={{ minRows: 3 }}
                          maxLength={5000}
                          placeholder="请输入评语，最多5000字"
                        />
                      )}
                    </FormItem>
                  </div>
                </Col>
              </Row>
            ) : null}

            {/* 考核结束 */}
            {(PERFORMANCE_STAYUS === 'FINISH')
              || (PERFORMANCE_STAYUS === 'MANAGER_CONFIRM')
              || (PERFORMANCE_STAYUS === 'HR_CONFIRM')
            ? (
              <Row className="performance-total">
                <Col span={2} />
                <Col span={14}>
                  <FormItem
                    {...formItemLayoutAddBox}
                    className="line"
                    label="上级评语"
                    colon={false}
                  >
                    <div dangerouslySetInnerHTML={{__html: T.escape2Html(CONFIG.options.comment || '') || '无'}}></div>
                  </FormItem>
                </Col>
              </Row>
            ) : null}

            <FormItem {...formItemLayoutWithOutLabel} className="foot-group-btn">
              {/* 锁定目标 点评 */}
              {CONFIG.options.hasAuthority === 'true' &&
              (PERFORMANCE_STAYUS === 'CONFIRM_GOALS' || PERFORMANCE_STAYUS === 'SUPERIOR_ASSESSMENT') ? (
                <React.Fragment>
                  { ISGOAL
                      ? <Button
                          type="primary"
                          onClick={this.lockGoal}
                          loading={loading}
                          disabled={disabled}

                        >
                          锁定目标
                        </Button>
                      : <Button
                          type="primary"
                          htmlType="submit"
                          loading={loading}
                          disabled={disabled}
                        >
                          完成打分
                        </Button>
                  }
                  <Button
                    loading={repulseBtnLoading}
                    onClick={this.showRefuseModal}
                    disabled={repulseBtnDisabled}
                  >
                    打回
                  </Button>
                </React.Fragment>
              ) : null}
              {
                CONFIG.canRefuse
                ? (
                    <Button
                      loading={repulseBtnLoading}
                      onClick={this.showRefuseModal}
                      disabled={repulseBtnDisabled}
                    >
                      打回
                    </Button>
                  )
                : null
              }
            </FormItem>
          </Form>
          </div>
          { PERFORMANCE_STAYUS === 'FINISH'
              ? null
              : <HistoryList HistoryListMsg={HistoryListMsg} onChangePage={this.changeHistoryPage} />
          }
          <RefuseModal
            visible={showRefuseModal}
            hideModal={this.hideRefuseModal}
            submit={this.handleRepulse}
            loading={repulseBtnLoading}
          />
        </BasicLayout>
      </LocaleProvider>
    );
  }
}

const WrappedPerformanceForm = Form.create()(performanceForm);
const mountNode = document.getElementById('root');

ReactDOM.render(<WrappedPerformanceForm />, mountNode);

