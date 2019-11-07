/*
 * @Description: 会议室-状态选择
 * @Author: danding
 * @Date: 2019-04-26 18:36:25
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 17:35:14
 */

import React from 'react';

const StatusNav = ({ activeNavVal, activeNav, toggleNav }) => {
  return (
    <nav className="my_nav">
      <ul style={{ width: '135px' }}>
        {
          activeNav.map(item => {
            const { value, label } = item;
            const cls = (value === activeNavVal)
              ? 'active'
              : ' ';
            return (
              <li
                key={value}
                className={cls}
                onClick={() => toggleNav(value)}
              >
                <a href="javascript:;">{label}</a>
              </li>
            );
          })
        }
      </ul>
    </nav>
  );
};

export default StatusNav;
