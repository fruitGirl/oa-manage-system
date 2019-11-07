/*
 * @Description: 个人-用户主页
 * @Author: danding
 * @Date: 2019-03-19 16:06:47
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 18:20:07
 */

import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import EssentialInfo from 'components/businessCommon/EssentialInfo';
import qs from 'qs';

const { Row, Col, Spin } = window.antd;
class UserHomePage extends React.PureComponent {
  componentDidMount() {
    this.getInfo();
  }

  // 获取他人信息
  getInfo() {
    const { userId } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    const payload = { userId };
    this.props.dispatch({
      type: 'userHomePage/getInfo',
      payload
    });
  }

  // 查看手机号
  queryCell = (payload) => {
    this.props.dispatch({
      type: 'userHomePage/queryCell',
      payload
    });
  }

  render() {
    const { userInfo, isQueryCell, loading, } = this.props;
    const pageLoading = loading.effects['userHomePage/getInfo'];

    return (
      <BasicLayout>
        <Spin spinning={pageLoading}>
        <Row>
          <Col span={12}>
            <EssentialInfo
                info={userInfo}
                isAbleEdit={false}
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

export default connect(({ userHomePage, loading, }) => ({ ...userHomePage, loading, }))(UserHomePage);
