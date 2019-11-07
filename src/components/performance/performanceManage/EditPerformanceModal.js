/*
 * @Description: 编辑绩效模态框
 * @Author: moran
 * @Date: 2019-08-06 15:21:47
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-16 16:43:42
 */

 import React from 'react';
 import { connect } from 'dva';
 import PropTypes from 'prop-types';
import { thisYear, formItemLayout, PART_OF_TEAM, ALL_TEAM } from 'constants/components/performance/editPerformanceModal';
import { createPerformanceYears, PERFORMANCE_TYPE, PERFORMANCE_RANGE, ANNUAL_PERFORMANCE } from 'constants/performance/index';

 const { Modal, Form, Input, Select, Radio, Checkbox, Row, Col } = window.antd;
 const { Option } = Select;
 const FormItem = Form.Item;
 const RadioGroup = Radio.Group;
 const CheckboxGroup = Checkbox.Group;

//  ALL_TEAM -> 全部团队  PART_OF_TEAM -> 部分团队 ANNUAL_PERFORMANCE -> 年度考核
class EditPerformanceModal extends React.PureComponent {
  constructor(props) {
    super(props);
    const assessTeamIds = this.transId(this.props.teamLists);
    this.state = {
      checkAll: true, // 全部团队是否全选
      indeterminate: false, // 是否全选样式
      assessTeamIds // 考核范围id
    };
  }

  // 数组对象转换成数组
  transId = (arr) => {
    return arr.map((res) => {
      return res.value;
    });
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'performanceManage/getTeamLists',
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.editInfos !== prevProps.performancePlanInfos) {
      const { teamLists, editInfos } = this.props;
      const {  assessRange, name, performanceTypeCode, timeRange, year, assessTeamIds } = editInfos;
      const allAssessTeamId = this.transId(teamLists);

      this.setState({
        checkAll: !(assessRange.name === PART_OF_TEAM)
      });
      this.props.form.setFieldsValue({
        name,
        performanceTypeCode,
        timeRange,
        year,
        assessTeamIds: assessRange.name === ALL_TEAM ? allAssessTeamId : assessTeamIds
      });
    }
  }

  handleSumbit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { checkAll } = this.state;
        const { assessTeamIds, timeRange, year, performanceTypeCode } = values;
        // 全选的时候传 ALL_TEAM, 否则传PART_OF_TEAM
        const assessRange  = checkAll ? ALL_TEAM : PART_OF_TEAM;
        // 选择全部团队， 团队assessTeamIds不需要传
        const assessTeamneedIds = assessRange !== ALL_TEAM ? assessTeamIds : undefined;
        // 年度考核 timeRange传year的数据
        const needTimeRange = performanceTypeCode === ANNUAL_PERFORMANCE ? year : timeRange;
        this.props.submit({
          ...values,
          assessRange,
          assessTeamIds: assessTeamneedIds,
          timeRange: needTimeRange
        }, this.props.editInfos.id);
      }
    });
  };

  handleCancel = () => {
    this.props.dispatch({
      type: 'performanceManage/displayModal',
      payload: false
    });
  };

  // 全部团队
  handleCheckAllChange = (e) => {
    const { form, teamLists } = this.props;
    const assessTeamIds = this.transId(teamLists);
    const checked = e.target.checked;
    this.setState({
      indeterminate: false,
      checkAll: e.target.checked,
    });
    form.setFieldsValue({
      assessTeamIds: checked ? assessTeamIds : [],
    });
  };

  // 单个团队点击
  handleCheckChange = (assessTeamIds ) => {
    const { teamLists } = this.props;
    this.setState({
      assessTeamIds,
      indeterminate: !!assessTeamIds.length && assessTeamIds.length < teamLists.length,
      checkAll: assessTeamIds.length === teamLists.length,
    });
  }

  render() {
    const {
      title,
      form,
      disabled,
      isEdit,
      showModal,
      teamLists,
      loading,
      editInfos
    } = this.props;

    const {
      checkAll
    } = this.state;
    const { getFieldDecorator } = form;
    const performanceTypeCode = form.getFieldValue('performanceTypeCode'); // 获取考核类型
    const assessTeamIds = this.transId(teamLists); // 获取考核范围id
    const btnLoading = loading.effects['performanceManage/savePerformancePlan'] || false;

    const disableSelectDepart = !!(editInfos.id && editInfos.status && (editInfos.status.name === 'END')); // 已结束状态全部禁用

    return (
      <Modal
          title={title}
          visible={showModal}
          width={650}
          destroyOnClose={true}
          onOk={this.handleSumbit}
          onCancel={this.handleCancel}
          confirmLoading={btnLoading}
        >
          <p>开启绩效后，会在选中的考核范围人员[我的绩效]页面中自动创建一项绩效表，开启后不可关闭</p>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <FormItem label="考核名称" colon={false} {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: '请输入考核名称' }
                ]
              })(
              <Input placeholder="请输入" maxLength="100" disabled={isEdit}/>
              )}
            </FormItem>
            <FormItem label="考核年度" colon={false} {...formItemLayout}>
              {getFieldDecorator('year', {
                initialValue: thisYear,
                rules: [
                  { required: true, message: '请选择考核年度' }
                ]
              })(
              <Select placeholder="请选择" disabled={disabled}>
                {createPerformanceYears().map(i => {
                  const { label, value } = i;
                  return <Option value={value}>{label}</Option>;
                })}
              </Select>
              )}
            </FormItem>
            <FormItem label="考核类型" colon={false} {...formItemLayout}>
              {getFieldDecorator('performanceTypeCode', {
                initialValue: 'QUARTER_PERFORMANCE',
                rules: [
                  { required: true, message: '请选择考核类型' }
                ]
              })(
              <RadioGroup disabled={disabled}>
                {
                  PERFORMANCE_TYPE.map((res) => {
                    return (<Radio value={res.value}>{res.label}</Radio>);
                  })
                }
              </RadioGroup>
              )}
            </FormItem>
            {performanceTypeCode !== ANNUAL_PERFORMANCE ? (<FormItem label="考核季度" colon={false} {...formItemLayout}>
              {getFieldDecorator('timeRange', {
                rules: [
                  { required: true, message: '请选择考核季度' }
                ]
              })(
              <Select placeholder="请选择" disabled={disabled}>
                {
                  PERFORMANCE_RANGE.map((res) => {
                    return (<Option value={res.value}>{res.label}</Option>);
                  })
                }
              </Select>
              )}
            </FormItem>) : null}
            <FormItem label="考核范围" colon={false} {...formItemLayout}>
              <Checkbox
                indeterminate={this.state.indeterminate}
                onChange={this.handleCheckAllChange}
                checked={checkAll}
                defaultChecked={true}
                disabled={disableSelectDepart}
              >
                全部团队
              </Checkbox>
              <br />
              {getFieldDecorator('assessTeamIds', {
                initialValue: assessTeamIds,
                rules: [
                  { required: true, message: '请选择考核范围' }
                ]
              })(
                  <CheckboxGroup
                    onChange={this.handleCheckChange}
                    disabled={disableSelectDepart}
                  >
                    <Row>
                      {
                        teamLists.map(i => {
                          const { value, label} = i;
                          return (
                            <Col span={12}>
                              <Checkbox value={value}>{label}</Checkbox>
                            </Col>
                          );
                        })
                      }
                    </Row>
                  </CheckboxGroup>

              )}
            </FormItem>
          </Form>
      </Modal>
    );
  }
}

EditPerformanceModal.propTypes = {
  title: PropTypes.string, // 标题
  showModal: PropTypes.bool, // 弹框展开
  submit: PropTypes.func, // 开启绩效
  disabled: PropTypes.bool, // 考核年度、考核类型、考核季度的禁用设置
  isEdit:  PropTypes.bool // 考核名称禁用设置
};

EditPerformanceModal.defaultProps = {
  title: '开启绩效',
  showModal: false,
  disabled: false,
  isEdit: false,
  submit: () => {}
};

export default connect (({ performanceManage, loading }) => ({ ...performanceManage, loading }))(Form.create()(EditPerformanceModal));
