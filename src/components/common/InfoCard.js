/*
 * @Description: 卡片容器
 * @Author: danding
 * @Date: 2019-03-19 14:05:59
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 18:05:49
 */

import PropTypes from 'prop-types';
import 'styles/components/common/infoCard.less';

const InfoCard = (props) => {
  const { title, children, wrapperClass } = props;

  return (
    <div className={`${wrapperClass ? wrapperClass : ''} info-card-wrapper`}>
      { title && <h5 className="title">{ title }</h5> }
      { children }
    </div>
  );
};

InfoCard.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  wrapperClass: PropTypes.string
};

InfoCard.defaultProps = {
  title: '', // 标题
  children: null, // 子元素
  wrapperClass: '' // 包裹的class
};

export default InfoCard;
