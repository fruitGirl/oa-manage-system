/*
 * @Description: 申请单卡片
 * @Author: moran
 * @Date: 2019-09-10 15:36:30
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-15 11:56:55
 */
import React from 'react';
import 'styles/components/process/applyCard.less';
const { Tooltip } = window.antd;

class ApplyCard extends React.Component {
  handleJumpHref = () => {
    const { id, name } = this.props.config;
    window.location.href = `${CONFIG.frontPath}/process/processCreate.htm?processConfigId=${id}&name=${name}`;
  }
  render() {
    const { isShowBtn, config } = this.props;
    const {
      name,
      description,
      logo } = config;
    const isCenter = description ? '' : 'name-center'; // 没有描述，不显示无，居中显示
    return (
      <a href="javascript:;" className="apply-card-box" onClick={this.handleJumpHref}>
        <div>
          <div className="card-left">
            <img className="img-left" src={window.T.getImg(`process/approval-logo/${logo}`)} alt="" />
            <dl className="img-right">
              <dt className={isCenter}>
                <span className="name ellipsis">{name}</span>
              </dt>
              <Tooltip title={description}>
                <dd className="create ellipsis">{description}</dd>
              </Tooltip>

            </dl>
          </div>
          {isShowBtn ? <div className="card-right">
            <span className="btn-style">停用</span>
            <span className="btn-style">编辑</span>
            <span>移动到</span>
          </div> : null}

        </div>
      </a>
    );
  }
}

ApplyCard.propTypes = {
  isShowBtn: PropTypes.bool, // 按钮显示
  config: PropTypes.object, // 卡片数据
};

ApplyCard.defaultProps = {
  isShowBtn: false,
  config: {}
};

export default ApplyCard;
