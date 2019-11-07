/*
 * @Description: 个人-主页-基本信息
 * @Author: danding
 * @Date: 2019-03-19 14:05:40
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 18:05:20
 */

import PropTypes from 'prop-types';
import InfoCard from 'components/common/InfoCard';
import { PROFILE_CONFIG } from 'constants/components/common/essentialInfo';
import 'styles/components/common/essentialInfo.less';
import Separate from 'components/common/Separate';

const { Input, Icon } = window.antd;

/**
 * 创建个人信息组件
 * @return {object} 组件
 */
const createInfo = (info) => {
  return PROFILE_CONFIG.map(i => (
    <div className="desc-wrapper">
      <span className="desc-label">{ i.label }</span>
      <span>{ info[i.field] || '无' }</span>
    </div>
  ));
};

/**
 * 切换图片上传的展示组件
 * @param {string} imageUrl
 * @return {object} 展示的组件
 */
const switchAvatar = (imageUrl, isAbleEdit) => {
  // 只读模式
  if (!isAbleEdit) {
    return imageUrl
      ? <img src={imageUrl} alt="照片" className="avatar_img" />
      : <span className="no-avatar-tip">暂无照片</span>;
  }

  return imageUrl
    ? (<img src={imageUrl} alt="照片" className="avatar_img" />)
    : (
      <div>
        <i className="icon-camera" />
        <div className="ant-upload-text">点击上传照片</div>
      </div>
    );
};

const EssentialInfo = (props) => {
  const { handleChange, isAbleEdit, info, isQueryCell, queryCell } = props;
  const isAbleQueryCell = !isQueryCell && info.cell; // 是否显示查看操作
  return (
    <InfoCard title="基本信息">
      <div className="essential-info-wrapper clearfix">
        <div className="pull-left avatar-uploader">
            { isAbleEdit && <Input
              className="file"
              type="file"
              title="点击上传新图片"
              name="imageContent"
              accept="image/gif,image/png,image/jpeg"
              onChange={handleChange}
              id="imageContent"
            /> }
            { switchAvatar(info.imageURL, isAbleEdit) }
        </div>
        <div className="pull-left">
          <h6 className="name">{info.nickName}</h6>
          { createInfo(info) }
          <div className="desc-wrapper clearfix">
            <div className="phone-wrapper pull-left">
              <Icon type="phone" className="desc-label"/>
              <span>{info.cell || '无'}</span>
              <Separate isVertical={false} />
              { isAbleQueryCell ? <a onClick={queryCell}>查看</a> : null }
            </div>
          </div>
        </div>
      </div>
    </InfoCard>
  );
};

EssentialInfo.propTypes = {
  handleChange: PropTypes.func, // 修改图片函数
  queryCell: PropTypes.func, // 查看手机号
  isAbleEdit: PropTypes.bool, // 是否可以修改图片
  isQueryCell: PropTypes.bool, // 是否查看过手机号
};

EssentialInfo.defaultProps = {
  handleChange: () => {},
  queryCell: () => {},
  isAbleEdit: false,
  isQueryCell: false,
};

export default EssentialInfo;
