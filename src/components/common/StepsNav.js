/*
 * @Description: 可切换导航栏
 * @Author: danding
 * @Date: 2019-09-05 16:05:37
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-05 16:05:37
 */

import React from 'react';
import 'styles/components/common/stepsNav.less';

const StepsNav = (props) => {
  const { slectedStepKey, configs, onChange, leftComp, rightComp } = props;

  return (
    <div className="steps-nav-wrapper">
      <div className="steps-nav-left">{leftComp}</div>
      <div className="steps-nav-center">
        {
          configs.map((i, idx) => {
            const { label, value } = i;
            const isActived = slectedStepKey === value;
            return (
              <div
                key={value}
                onClick={() => onChange(value)}
                className={`steps-item-container ${isActived ? 'step-actived' : ''}`}
              >
                <div className="steps-item-icon">
                  <span className="steps-icon">{idx + 1}</span>
                </div>
                <div className="steps-item-content">
                  <div className="steps-item-title">{label}</div>
                </div>
              </div>
            );
          })
        }
      </div>
      <div className="steps-nav-right">{rightComp}</div>
    </div>
  );
};

export default StepsNav;
