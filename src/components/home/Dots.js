/*
 * @Description: 轮播图的滚动点
 * @Author: danding
 * @Date: 2019-04-23 09:40:42
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-23 09:40:42
 */

import React from 'react';
import PropTypes from 'prop-types';
import 'styles/components/home/swiper.less';

const Dots = (props) => {
  const { selectIdx, dataProvider, changeDot } = props;
  return (
    <div>
      {
        dataProvider.map((i, index) => (
          <span
            onClick={() => changeDot(index)}
            className={`dot ${index === selectIdx ? 'active': ''}`}
          />
        ))
      }
    </div>
  );
};

Dots.propTypes = {
  dataProvider: PropTypes.array.isRequired, // 数据源
  selectIdx: PropTypes.number, // 选中的索引值
  changeDot: PropTypes.func
};

Dots.defaultProps = {
  selectIdx: 0,
  dataProvider: [],
  changeDot: () => {}
};

export default Dots;
