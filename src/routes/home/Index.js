/*
 * @Description: 首页
 * @Author: danding
 * @Date: 2019-04-15 16:43:43
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-30 14:57:45
 */

import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import Swiper from 'components/home/Swiper';
import EnterLinks from 'components/home/EnterLinks';
import Todo from 'components/home/Todo';
import Notice from 'components/home/Notice';
import QrcodeCard from 'components/home/QrcodeCard';
import Separate from 'components/common/Separate';

const { LocaleProvider, zh_CN } = window.antd;

class Index extends React.PureComponent {
  componentDidMount() {
    this.getSwiper();
    this.getEnterLinks();
    this.getMenu();
  }

  shiftMenu = (payload) => {
    this.props.dispatch({
      type: 'index/getNoticeList',
      payload
    });
  }

  getMenu() {
    this.props.dispatch({
      type: 'index/getMenu'
    });
  }

  getSwiper() {
    this.props.dispatch({
      type: 'index/getSwiper'
    });
  }

  getEnterLinks() {
    this.props.dispatch({
      type: 'index/getEnterLinks'
    });
  }

  render() {
    const {
      swiperData,
      enterLinks,
      noticeList,
      selectedMenu,
      menuData,
      loading
    } = this.props;
    const swiperLoading = loading.effects['index/getSwiper'];
    const noticeLoading = loading.effects['index/getNoticeList'];
    const enterLoading = loading.effects['index/getEnterLinks'];

    return (
      <LocaleProvider locale={zh_CN}>
        <BasicLayout>
          <div className="clearfix home-wrapper">
            <div className="pull-left left-wrapper">
              <Swiper loading={swiperLoading} dataProvider={swiperData} />
              <Separate size={14} />
              <Notice
                loading={noticeLoading}
                selectedMenu={selectedMenu}
                list={noticeList}
                menuData={menuData}
                shiftMenu={this.shiftMenu}
              />
            </div>
            <div className="pull-right right-wrapper">
              <EnterLinks loading={enterLoading} dataProvider={enterLinks} />
              <Separate size={10} />
              <div className="clearfix">
                <div className="pull-left todo-item">
                  <Todo />
                </div>
                <div className="pull-right qr-item">
                  <QrcodeCard />
                </div>
              </div>
            </div>
          </div>
        </BasicLayout>
      </LocaleProvider>
    );
  }
}

export default connect(({ loading, index }) => ({ loading, ...index }))(Index);

