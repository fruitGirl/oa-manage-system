/*
 * @Description: 分隔组件
 * @Author: danding
 * @Date: 2019-03-20 15:50:50
 * @Last Modified by: danding
 * @Last Modified time: 2019-03-20 15:50:50
 */

import PropTypes from 'prop-types';

const createStyle = (size, isVertical) => {
  if (isVertical) { // 垂直模式
    return { height: size };
  }
  return { display: 'inline-block', width: size, height: '100%'};
};

const Separate = ({ size, isVertical }) => {
  return <div style={createStyle(size, isVertical)}></div>;
};

Separate.propTypes = {
  size: PropTypes.number, // 间距大小
  isVertical: PropTypes.bool, // 是否是垂直模式
};

Separate.defaultProps = {
  size: 10,
  isVertical: true
};

export default Separate;
