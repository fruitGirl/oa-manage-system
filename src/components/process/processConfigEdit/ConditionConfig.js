/*
 * @Description: 条件配置
 * @Author: danding
 * @Date: 2019-09-19 15:15:10
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-27 16:24:06
 */

import React from 'react';
import { connect } from 'dva';
import cloneDeep from 'lodash.clonedeep';
import Separate from 'components/common/Separate';
import RoleRange from 'components/process/processConfigEdit/RoleRange';
import { compareConfig, BETWEEN_TYPE } from 'constants/process/processConfigEdit';
import ConditionModal from 'components/process/processConfigEdit/ConditionModal';
import { updateProcessConfig, CONDITION_PROCESS_TYPE } from 'constants/components/process/processConfigEdit';
import { RADIO_COMPONENT_TYPE, CONDITION_TYPES } from 'constants/components/businessCommon/dragForm';
import CondProcLineConfig from 'components/process/processConfigEdit/CondProcLineConfig';

const { Form, Input, Select, Button, InputNumber, Checkbox, Modal, Row, Col } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const titleLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};
const selectStyle = { width: '150px' };

class ConditionConfig extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showConditionModal: false, // 显示条件弹窗
      priorityEnum: [], // 优先级枚举
    };
  }

  componentDidMount() {
    this.createPriority();
  }

  // 查找当前修改的流程数据
  findProcessData = (compareKey, config) => {
    for (let i = 0; i < config.length; i++) {
      const { childNodes = [], key } = config[i];

      // 匹配到当前的选中项
      if (key === compareKey) {
        return config;
      } else if (childNodes && childNodes.length) {
        const findData = this.findProcessData(compareKey, childNodes);
        if (findData) return findData;
      }
    }
  }

  // 创建优先级
  createPriority = () => {
    const { selectedKey, startNodeConfig } = this.props;
    const findData = this.findProcessData(selectedKey, startNodeConfig);
    let priority = [];
    findData.forEach((i, idx) => {
      const { type } = i;
      if (type === CONDITION_PROCESS_TYPE) {
        const value = idx + 1;
        priority.push({
          label: `优先级${value}`,
          value
        });
      }
    });

    this.setState({
      priorityEnum: priority
    });
  }

  // 修改标题
  onChangeName = (e) => {
    const { value } = e.target;
    const { selectedKey } = this.props;
    const payload = {
      name: value,
      key: selectedKey
    };
    this.updateSelectedCard(payload);
    this.updateConfig(payload);
  }

  // 标题输入框失焦
  nameInputBlur = (e) => {
    const { value } = e.target;
    if (!value) {
      this.onChangeName({ target: { value: '条件' }});
    }
  }

  // 修改优先级
  onChangePriority = (priority) => {
    const { selectedKey, startNodeConfig, } = this.props;
    const cloneConfig = cloneDeep(startNodeConfig);
    confirm({
      title: '已存在该优先级的条件，是否修改优先级？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const payload = {
          priority,
          key: selectedKey
        };
        this.updateSelectedCard(payload);
        this.changeConditionSort(selectedKey, cloneConfig, priority - 1);
        this.props.dispatch({
          type: 'processConfigEdit/updateProcessLine',
          payload: cloneConfig
        });
      },
      onCancel: () => {}
    });
  }

  // 修改优先级的排序
  changeConditionSort = (compareKey, config, newIndex) => {
    for (let i = 0; i < config.length; i++) {
      const { childNodes = [], key } = config[i];

      // 匹配到当前的选中项
      if (key === compareKey) {
        const cloneItem = config.splice(i, 1)[0];
        config.splice(newIndex, 0, cloneItem);
        config.forEach((i, idx) => {
          i.priority = idx + 1;
        });
        return;
      } else if (childNodes && childNodes.length) {
        this.changeConditionSort(compareKey, childNodes, newIndex);
      }
    }
  }

  // 控制添加条件弹窗显隐
  displayConditionModal = (showConditionModal) => {
    this.setState({
      showConditionModal
    });
  }

  // 更新配置
  updateConfig = (payload) => {
    const { startNodeConfig } = this.props;
    const cloneConfig = cloneDeep(startNodeConfig);
    updateProcessConfig(payload, cloneConfig);
    this.props.dispatch({
      type: 'processConfigEdit/updateProcessLine',
      payload: cloneConfig
    });
  }

  // 更新选中信息
  updateSelectedCard = (payload) => {
    const { selectedProcessCard } = this.props;
    this.props.dispatch({
      type: 'processConfigEdit/setSelectedSiderProcessCard',
      payload: {
        ...selectedProcessCard,
        ...payload
      }
    });
  }

  // 更新比较选择
  changeCompareWay = (paramName, val) => {
    const { selectedProcessCard, } = this.props;
    const cloneData = cloneDeep(selectedProcessCard);
    const { processConditionNodePropertiesList = [] } = cloneData;
    const matchItem = processConditionNodePropertiesList.find(i => i.paramName === paramName);
    matchItem.compareWay = val;
    matchItem.paramValues.value = [];
    this.updateSelectedCard(cloneData);
    this.updateConfig(cloneData);
  }

  // 修改发起人类型
  changeLaunchType = (paramName, type) => {
    const { selectedProcessCard, } = this.props;
    const cloneData = cloneDeep(selectedProcessCard);
    const { processConditionNodePropertiesList = [] } = cloneData;
    const matchItem = processConditionNodePropertiesList.find(i => i.paramName === paramName);
    matchItem.paramValues.key = type;
    matchItem.paramValues.value = [];
    this.updateSelectedCard(cloneData);
    this.updateConfig(cloneData);
  }

  // 修改发起人对象/单选的选项
  changeCheckboxIds = (paramName, ids) => {
    const { selectedProcessCard, } = this.props;
    const cloneData = cloneDeep(selectedProcessCard);
    const { processConditionNodePropertiesList = [] } = cloneData;
    const matchItem = processConditionNodePropertiesList.find(i => i.paramName === paramName);
    matchItem.paramValues.value = ids;
    this.updateSelectedCard(cloneData);
    this.updateConfig(cloneData);
  }

  // 修改条件输入框的小的数据
  changeMinCondition = (paramName, value) => {
    this.changeNumCondition(value, paramName, true);
  }

  // 修改条件输入框的大的数据
  changeMaxCondition = (paramName, value) => {
    this.changeNumCondition(value, paramName, false);
  }

  // 修改条件值的数字大小
  changeNumCondition = (value, paramName, isMin = true) => {
    const { selectedProcessCard, } = this.props;
    const cloneData = cloneDeep(selectedProcessCard);
    const { processConditionNodePropertiesList = [] } = cloneData;
    const matchItem = processConditionNodePropertiesList.find(i => i.paramName === paramName);
    matchItem.paramValues.value = matchItem.paramValues.value || [];
    if (isMin) {
      matchItem.paramValues.value[0] = value || '';
    } else {
      matchItem.paramValues.value[1] = value || '';
    }
    this.updateSelectedCard(cloneData);
    this.updateConfig(cloneData);
  }

  // 渲染条件组件项
  renderConditionComps = () => {
    const { selectedProcessCard, targetConfigs } = this.props;
    const { processConditionNodePropertiesList = [] } = selectedProcessCard;
    return processConditionNodePropertiesList.map(i => {
      const { paramName, paramValues: { key, value = [] }, compareWay } = i;
      const matchItem = targetConfigs.find(j => {
        return j.paramName === paramName;
      });

      // 匹配到表单设计内的类型
      if (matchItem) {
        const { props: { options = [], label = '' } } = matchItem;
        // 单选类型
        if (matchItem.type === RADIO_COMPONENT_TYPE) {
          return (
            <FormItem className="condition-form-item" label={label}>
              <CheckboxGroup
                value={value}
                onChange={(ids) => this.changeCheckboxIds(paramName, ids)}
              >
                <Row>
                  {
                    options.map((i) => {
                      const { label, value } = i;
                      return (
                        <Col
                          span={24}
                          key={value}
                        >
                          <Checkbox value={value}>{label}</Checkbox>
                        </Col>
                      );
                    })
                  }
                </Row>
            </CheckboxGroup>
            </FormItem>
          );
        }

        // 金额，时长类型
        return (
          <FormItem className="condition-form-item" label={label}>
            <Select
              onChange={(val) => this.changeCompareWay(paramName, val)}
              value={compareWay}
              style={selectStyle}
            >
              {
                compareConfig.map(j => {
                  return <Option value={j.value}>{j.label}</Option>;
                })
              }
            </Select>
            <Separate isVertical={false} />
            <InputNumber value={value[0]} onChange={(e) => {this.changeMinCondition(paramName, e);}} />
            { compareWay === BETWEEN_TYPE &&  ' - ' }
            { compareWay === BETWEEN_TYPE &&  <InputNumber value={value[1]} onChange={(e) => {this.changeMaxCondition(paramName, e);}} /> }
          </FormItem>
        );
      } else { // 默认发起人
        const { allUsers, allDepts, allGroups } = this.props;
        return (
          <FormItem label="发起人">
            <RoleRange
              selectedType={key}
              selectedIds={value}
              onChangeVisibleType={(type) => this.changeLaunchType(paramName, type)}
              onChangeVisibleIds={(ids) => this.changeCheckboxIds(paramName, ids)}
              allUsers={allUsers}
              allDepts={allDepts}
              allGroups={allGroups}
            />
          </FormItem>
        );
      }
    });
  }

  // 得到所有的条件数量
  getConditionCount = () => {
    const { targetConfigs } = this.props;
    const filters = targetConfigs.filter(i => {
      const { type } = i;
      return CONDITION_TYPES.includes(type);
    });

    // 加上发起人条件
    return filters.length ? (filters.length + 1) : 1;
  }

  render() {
    const { selectedProcessCard, } = this.props;
    const { name, priority } = selectedProcessCard;
    const { showConditionModal, priorityEnum } = this.state;
    const conditionComps = this.renderConditionComps();
    const allConditionCount = this.getConditionCount();
    const restConditionCount = allConditionCount - (conditionComps.length || 0);

    return (
      <div className="condition-config-wrapper">
        <h3 className="process-title">设置条件</h3>
        <Form colon={false} { ...layout }>
          <FormItem {...titleLayout} required label="标题">
            <Input
              placeholder="条件"
              value={name}
              onChange={this.onChangeName}
              onBlur={this.nameInputBlur}
              maxLength={30}
            />
          </FormItem>
          <FormItem required label="优先级">
            <Select
              style={selectStyle}
              value={priority}
              onChange={this.onChangePriority}
              placeholder="请选择优先级"
            >
              {
                priorityEnum.map((i) => {
                  const { label, value } = i;
                  return <Option value={value}>{label}</Option>;
                })
              }
            </Select>
            <Separate isVertical={false} />
            <span>当条件满足时，按照优先级高的执行</span>
          </FormItem>
          <FormItem label="发起条件">
            <Button onClick={this.displayConditionModal} type="primary">+添加条件</Button>
            <Separate isVertical={false} />
            <span>还有{restConditionCount}个条件可用</span>
          </FormItem>
          {
            conditionComps
          }
        </Form>
        <Separate size={30} />
        <CondProcLineConfig />
        <ConditionModal
          hideModal={() => this.displayConditionModal(false)}
          visible={showConditionModal}
        />
      </div>
    );
  }
}

export default connect(({ processConfigEdit, loading }) => ({ ...processConfigEdit, loading }))(ConditionConfig);
