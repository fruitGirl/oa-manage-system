/*
 * @Description: 个人-个人主页
 * @Author: danding
 * @Date: 2019-03-18 17:09:49
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 18:03:06
 */

 import React from 'react';
 import { connect } from 'dva';
 import BasicLayout from 'layouts/BasicLayout';
 import EssentialInfo from 'components/businessCommon/EssentialInfo';

 const { Row, Col, Spin } = window.antd;

 class UserPersonHomePage extends React.PureComponent {
  componentDidMount() {
    this.getInfo();
  }

  // 获取个人信息
  getInfo() {
    this.props.dispatch({
      type: 'userPersonalHomePage/getInfo'
    });
  }

  // 上传头像
  uploadAvatar = (e) => {
    this.props.dispatch({
      type: 'userPersonalHomePage/uploadAvatar',
      payload: e
    });
  }

  // 查看手机号
  queryCell = (payload) => {
    this.props.dispatch({
      type: 'userPersonalHomePage/queryCell',
      payload
    });
  }

  render() {
    const { userInfo, isQueryCell, loading } = this.props;
    const pageLoading = loading.effects['userPersonalHomePage/getInfo'];

    return (
        <BasicLayout>
          <Spin spinning={pageLoading}>
            <Row gutter={16}>
              <Col span={12}>
                <EssentialInfo
                  info={userInfo}
                  isAbleEdit={true}
                  handleChange={this.uploadAvatar}
                  queryCell={this.queryCell}
                  isQueryCell={isQueryCell}
                />
              </Col>
            </Row>
          </Spin>
        </BasicLayout>
    );
  }
 }

 export default connect(({ userPersonalHomePage, loading }) => ({ ...userPersonalHomePage, loading }))(UserPersonHomePage);
