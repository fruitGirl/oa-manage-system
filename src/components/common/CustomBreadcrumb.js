/*
 * @Description: 面包屑
 * @Author: danding
 * @Date: 2019-05-21 09:38:22
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-21 09:40:33
 */
import React from 'react';
import PropTypes from 'prop-types';
import 'styles/components/common/customBreadcrumb.less';

const CustomBreadcrumb = ({ config = [], title }) => {
  const len = config.length;

  return (
    <div className="custom-breadcrumb-wrapper">
      {
        config.map((i, idx) => {
          const { link, label } = i;
          return (
            <span className="breadcrumb-link">
              {
                link
                  ? <a href={i.link}>{label}</a>
                  : <span className="active">{label}</span>
              }
              {
                (idx !== (len - 1))
                  ? <span>&nbsp;&gt;&nbsp;</span>
                  : null
              }
            </span>
          );
        })
      }
      <div className="title">{title}</div>
    </div>
  );
};

CustomBreadcrumb.propTypes = {
  config: PropTypes.array,
  title: PropTypes.string
};

CustomBreadcrumb.defaultProps = {
  config: [], // 用于展示面包屑, link: 链接，label：导航名称
  title: '', // 用于展示标题
};

export default CustomBreadcrumb;
