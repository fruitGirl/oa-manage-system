/*
 * @Description: 可拖拽表单
 * @Author: danding
 * @Date: 2019-09-05 16:07:50
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-23 19:28:01
 */

import React from 'react';
import SourcePane from 'components/businessCommon/dragForm/SourcePane';
import TargetPane from 'components/businessCommon/dragForm/TargetPane';
import { SOURCE_CONFIGS } from 'constants/components/businessCommon/dragForm';
import 'styles/components/businessCommon/dragForm.less';
import cloneDeep from 'lodash.clonedeep';
import CreateSettingForm from 'components/businessCommon/dragForm/formSetting/CreateSettingForm';
import { typeMapConfig } from 'constants/components/businessCommon/dragForm/formSetting';
import Separate from 'components/common/Separate';

class Index extends React.PureComponent {
  // 排序表单项
  sortTargetItems = (newIndex, oldIndex) => {
    let { targetConfigs } = this.props;
    targetConfigs = cloneDeep(targetConfigs);
    const cloneItem = targetConfigs.splice(oldIndex, 1)[0];
    targetConfigs.splice(newIndex, 0, cloneItem);
    this.props.updateTargetconfigs(targetConfigs);
  }

  // 新增表单项
  addTargetConfig = (order, sortable, evt) => {
    let { targetConfigs, } = this.props;
    targetConfigs = cloneDeep(targetConfigs);
    const dataId = evt.clone.getAttribute('data-id');
    const matchItem = SOURCE_CONFIGS.find(i => i.type === dataId);
    const { type, props, } = matchItem;
    const sameTypeComps = targetConfigs.filter(i => i.type === type);
    const sameTypeCompLen = sameTypeComps.length;
    const addItem = {
      ...matchItem,
      paramName: T.tool.createUuid(type),
      props: {
        ...cloneDeep(props),
        label: sameTypeCompLen
          ? `${props.label}(${sameTypeCompLen + 1})`
          : props.label, // 名称递增
      }
    };
    targetConfigs.splice(
      evt.newIndex,
      0,
      addItem
    );

    this.props.updateTargetconfigs(targetConfigs);
    this.selectTargetItem(addItem);
  }

  // 选中表单项
  selectTargetItem = (item) => {
    this.props.onSelectTargetItem(item);
  }

  // 删除表单项
  removeTargetItem = (item) => {
    let { targetConfigs } = this.props;
    const matchIdx = targetConfigs.findIndex(i => i.paramName === item.paramName);
    this.props.removeTargetItem(matchIdx, item);
  }

  // 更新表单属性的配置
  changeSettings = (values) => {
    const { selectedTargetItem } = this.props;
    let { targetConfigs } = this.props;
    targetConfigs = cloneDeep(targetConfigs);
    const matchIdx = targetConfigs.findIndex(i => i.paramName === selectedTargetItem.paramName);
    targetConfigs[matchIdx] = {
      ...targetConfigs[matchIdx],
      props: {
        ...targetConfigs[matchIdx].props,
        ...values
      }
    };
    this.props.onUpdateSelectTargetConfig(targetConfigs[matchIdx]);
    this.props.updateTargetconfigs(targetConfigs);
  }

  render() {
    const { targetConfigs, selectedTargetItem } = this.props;

    return (
      <div className="drag-form-wrapper">
        <div className="source-pane-wrapper sider-pane-wrapper">
          <SourcePane
            addItem={this.addTargetConfig}
            configs={SOURCE_CONFIGS}
          />
        </div>
        <div className="target-pane-wrapper">
          <TargetPane
            selectedItem={selectedTargetItem}
            changeConfigs={this.sortTargetItems}
            configs={targetConfigs}
            selectItem={this.selectTargetItem}
            removeItem={this.removeTargetItem}
          />
        </div>
        <div className="setting-pane-wrapper sider-pane-wrapper">
          <div className="setting-pane-wrapper">
            {
              selectedTargetItem.paramName
                ? (
                    <CreateSettingForm
                      key={selectedTargetItem.paramName}
                      configs={typeMapConfig[selectedTargetItem.type] || {}}
                      onChange={this.changeSettings}
                      curSelectedTarget={selectedTargetItem}
                    />
                )
                : (
                  <div className="text-gray9 text-center">
                    <Separate size={50} />
                    请点击左侧的表单项，进行配置
                  </div>
                )
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
