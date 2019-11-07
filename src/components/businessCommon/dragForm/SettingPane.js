/*
 * @Description: 表单配置-属性配置
 * @Author: danding
 * @Date: 2019-09-05 16:08:23
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-05 16:08:45
 */

import React from 'react';
import CreateSettingForm from 'components/businessCommon/dragForm/formSetting/CreateSettingForm';
import { timeConfig } from 'constants/components/businessCommon/dragForm/formSetting';

class SettingPane extends React.PureComponent {
  render() {
    return (
      <div className="setting-pane-wrapper">
        <CreateSettingForm configs={timeConfig} />
      </div>
    );
  }
}

export default SettingPane;
