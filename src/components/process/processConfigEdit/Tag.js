/*
 * @Description: 标签（可删除）
 * @Author: danding
 * @Date: 2019-09-27 14:24:22
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-27 14:26:37
 */

import React from 'react';
import PropTypes from 'prop-types';
import 'styles/components/process/processConfigEdit/tag.less';

const Tag = (props) => {
  const { label, value, onRemove } = props;
  return (
    <div className="tag-wrapper">
      { label }
      <i className="remove-icon" onClick={() => onRemove(value)}></i>
    </div>
  );
};

Tag.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  onRemove: PropTypes.func
};

Tag.defaultProps = {
  label: '',
  value: null,
  onRemove: () => {}
};

export default Tag;
