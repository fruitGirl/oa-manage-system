/*
 * @Description: 导航栏状态选择
 * @Author: danding
 * @Date: 2019-04-26 18:36:25
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-26 18:36:25
 */

import React from 'react';
import PropTypes from 'prop-types';
import 'styles/components/common/statusNav.less';

const { Radio } = window.antd;

const StatusNav = ({ activeNavVal, activeNav, toggleNav }) => {
  return (
    <div className="status-nav">
        <Radio.Group
          size="small"
          onChange={(e) => { toggleNav(e.target.value); }}
          value={activeNavVal}
        >
          {
            activeNav.map(i => {
              const { label, value } = i;
              return <Radio.Button value={value}>{label}</Radio.Button>;
            })
          }
        </Radio.Group>
    </div>
  );
};

StatusNav.propTypes = {
  activeNavVal: PropTypes.any,
  activeNav: PropTypes.array,
  toggleNav: PropTypes.func
};

StatusNav.defaultProps = {
  activeNavVal: '', // 当前选中的导航值
  activeNav: [], // 导航栏配置
  toggleNav: () => {}, // 改变导航栏选择值
};

export default StatusNav;
