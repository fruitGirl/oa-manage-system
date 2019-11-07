import React from 'react';
import { connect } from 'dva';
import StepsNav from 'components/common/StepsNav';
import NormalInfo from 'components/process/processConfigEdit/NormalInfo';
import FormDesign from 'components/process/processConfigEdit/FormDesign';
import ProcessConfig from 'components/process/processConfigEdit/ProcessConfig';
import { configs, NORMAL_INFO_STEP, FORM_CONFIG_STEP, PROCESS_CONFIG_STEP, BREADCRUMB_CONFIG } from 'constants/process/stepsNavConfig';
import BasicLayout from 'layouts/BasicLayout';
import Separate from 'components/common/Separate';
import CustomBreadcrumb from 'components/common/CustomBreadcrumb';
import { VISIBLE_RANGE_ALL_USER } from 'constants/process/processConfigEdit';
import { CHECKBOX_COMPONENT_TYPE, RADIO_COMPONENT_TYPE } from 'constants/components/businessCommon/dragForm';

const { Button, Spin, Modal } = window.antd;
const { warning } = Modal;

class ProcessConfigEdit extends React.PureComponent {
  UNSAFE_componentWillMount() {
    this.getClassifList();
    this.getAllUsers();
    this.getAllDepts();
    this.getAllGroups();
    this.getDetailMsg();
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.leaveConfirm);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.leaveConfirm);
  }

  // 查看时获取详情
  getDetailMsg() {
    const { id } = T.tool.getSearchParams();
    if (id) {
      this.props.dispatch({
        type: 'processConfigEdit/getDetailMsg',
        payload: { id }
      });
    }
  }

  // 离开时的确认，防止用户误操作
  leaveConfirm = (e) => {
    const { isSaveSuc } = this.props;

    // 非保存成功下退出
    if (!isSaveSuc) {
      const event = window.event || e;
      const confirmTxt = isSaveSuc ? '' : "离开将不会保留修改内容";
      event.returnValue = confirmTxt;
      return confirmTxt;
    }
  }

  changeNavStep = (payload) => {
    this.props.dispatch({
      type: 'processConfigEdit/changeNavStey',
      payload
    });
  }

  // 获取所有用户
  getAllUsers = () => {
    this.props.dispatch({
      type: 'processConfigEdit/getAllUsers',
    });
  }

  // 获取所有部门树
  getAllDepts = () => {
    this.props.dispatch({
      type: 'processConfigEdit/getAllDepts',
    });
  }

  // 获取所有人员分类
  getAllGroups = () => {
    this.props.dispatch({
      type: 'processConfigEdit/getAllGroups',
    });
  }

  // 获取审批分类
  getClassifList = () => {
    this.props.dispatch({
      type: 'processConfigEdit/getClassifList'
    });
  }

  // 提交流程配置
  submit = () => {
    let errs = [];
    const normalErrs = this.validateNormalInfo();
    const formDesignErrs = this.validateFormDesign();
    const processConfigErrs = this.validateProcessConfig();
    errs = [ ...normalErrs, ...formDesignErrs, ...processConfigErrs];

    // 是否含有错误信息
    if (errs.length) {
      warning({
        title: '以下信息未填写完整',
        okText: '确定',
        content: (
          <ul>
            {
              errs.map(i => {
                return <li>{i.errMsg}</li>;
              })
            }
          </ul>
        )
      });
    } else {
      this.props.dispatch({
        type: 'processConfigEdit/submitProcessConfig'
      });
    }
  }

  // 校验基本信息
  validateNormalInfo = () => {
    const { normalInfo, processVisibleConfig, } = this.props;
    const { name, typeId } = normalInfo;
    const { visibleObjectType, visibleObjectIds } = processVisibleConfig;
    let errs = [];
    if (!name) {
      errs.push({ errMsg: '基本信息-审批名称不能为空' });
    }
    if (!typeId) {
      errs.push({ errMsg: '基本信息-审批分类未选择' });
    }
    if (!visibleObjectType) {
      errs.push({ errMsg: '基本信息-可见范围类型未选择' });
    }

    // 可见范围选择非全部人员，且未添加值
    if (
      (visibleObjectType !== VISIBLE_RANGE_ALL_USER)
      && !visibleObjectIds.length
    ) {
      errs.push({ errMsg: '基本信息-可见范围的值未添加' });
    }

    return errs;
  }

  // 校验表单设计
  validateFormDesign = () => {
    const { targetConfigs } = this.props;
    const noLabels = targetConfigs.filter(i => !i.props.label);
    let errs = [];

    // 存在标题未填写
    if (noLabels.length) {
      errs.push({ errMsg: `表单设计-存在${noLabels.length}个组件的标题未填写` });
    }

    targetConfigs.forEach(i => {
      // 多选或者单选的组件
      if (
        (i.type === CHECKBOX_COMPONENT_TYPE)
        || (i.type === RADIO_COMPONENT_TYPE)
      ) {
        const { options, label } = i.props;
        const isLableEmpty = options.some(j => !j.label);
        isLableEmpty && errs.push({ errMsg: `表单设计-${label}的选项名未填写`});
      }
    });
    return errs;
  }

  // 校验流程配置
  validateProcessConfig = () => {
    let errs = [];
    const { startNodeConfig } = this.props;
    // console.log('startNodeConfig=', startNodeConfig);
    this.validateEachProcess(startNodeConfig, errs);
    return errs;
  }

  // 校验每个流程
  validateEachProcess = (config = [], errs) => {
    // for (let i = 0; i < config.length; i++) {
    //   const { type, name } = config[i];
    // }
  }

  render() {
    const { activeNavKey, loading } = this.props;
    const saveLoading = loading.effects['processConfigEdit/submitProcessConfig'];
    const pageLoading = loading.effects['processConfigEdit/getDetailMsg'] || false;

    return (
      <BasicLayout>
        <Spin spinning={pageLoading}>
          <div className="process-config-edit-wrapper">
            <Separate size={1} />
            <StepsNav
              onChange={this.changeNavStep}
              slectedStepKey={activeNavKey}
              configs={configs}
              leftComp={<CustomBreadcrumb config={BREADCRUMB_CONFIG} />}
              rightComp={(
                <Button
                  type="primary"
                  onClick={this.submit}
                  loading={saveLoading}
                >&nbsp;完成&nbsp;</Button>
              )}
            />
            <div style={{flex: 1, display: 'flex'}}>
              <div style={{flex: 1}}>
                { activeNavKey === NORMAL_INFO_STEP && <NormalInfo /> }
                { activeNavKey === FORM_CONFIG_STEP && <FormDesign /> }
                { activeNavKey === PROCESS_CONFIG_STEP && <ProcessConfig /> }
              </div>
            </div>
          </div>
        </Spin>
      </BasicLayout>
    );
  }
}

export default connect(({
  processConfigEdit,
  loading
}) => ({
  ...processConfigEdit,
  loading
}))(ProcessConfigEdit);
