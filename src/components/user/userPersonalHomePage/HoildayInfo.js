/*
 * @Description: 个人-我的主页-我的假期
 * @Author: danding
 * @Date: 2019-03-19 14:04:20
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-09 10:44:36
 */

import PropTypes from 'prop-types';
import InfoCard from 'components/common/InfoCard';
import { HOILDAY_CONFIG } from 'constants/components/user/userPersonalHomePage';
import 'styles/components/user/userPersonalHomePage/hoildayInfo.less';

const { Row, Col } = window.antd;

// 创建信息容器
const createItem = (info) => {
  return HOILDAY_CONFIG.map((i, idx) => (
    <Col span={12} >
      <div className={`info-wrapper ${idx === 2 ? 'last-row' : ''}`}>
        <div className="content" style={{backgroundImage: `url(${i.imgUrl})`}}>
          <div>
            <span className="hours">{ info[i.field] || 0 }h</span>
            <span className="days">
              ({ parseInt(info[i.field] / 8, 10) || 0 } 天
              { (info[i.field] % 8) || 0 } 小时)
            </span>
          </div>
          <div className="label">{ i.label }</div>
        </div>
      </div>
    </Col>
  ));
};

const HoildayInfo = (props) => {
  const { info } = props;

  return (
    <InfoCard title="我的假期">
      <Row gutter={32} className="hoilday-info-wrapper">
        { createItem(info) }
      </Row>
    </InfoCard>
  );
};

HoildayInfo.propTypes = {
  info: PropTypes.object
};

HoildayInfo.defaultProps = {
  info: {}
};

export default HoildayInfo;


