/*
 * @Description: 更多文章
 * @Author: danding
 * @Date: 2019-04-19 15:33:19
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-29 19:23:13
 */

import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import CustomBreadcrumb from 'components/common/CustomBreadcrumb';
import List from 'components/system/infoPageQuery/List';

const PAGE_SIZE = 25;

class InfoPageQuery extends React.PureComponent {
  componentDidMount() {
    this.initData();
  }

  initData() {
    const { channel, channelId, } = T.tool.getSearchParams();
    this.channelId = channelId;
    this.initConfig(channel);
    this.getList({
      channelId,
      pageSize: PAGE_SIZE,
      currentPage: 1,
      published: true
    });
  }

  initConfig(channel) {
    this.channel = channel;
    this.config = [
      { link: '/index.htm', label: '首页'},
      { label: this.channel }
    ];
  }

  getList = (payload) => {
    this.props.dispatch({
      type: 'infoPageQuery/getList',
      payload
    });
  }

  changePage = ({ current }) => {
    const { channelId } = this;
    this.getList({
      channelId,
      pageSize: PAGE_SIZE,
      currentPage: current,
      published: true
    });
  }

  render() {
    const { list, paginator } = this.props;

    return (
      <BasicLayout>
        <CustomBreadcrumb config={this.config} />
        <List
          channel={this.channel}
          list={list}
          onChange={this.changePage}
          paginator={paginator}
        />
      </BasicLayout>
    );
  }
}

export default connect(({ infoPageQuery, loading }) => ({ ...infoPageQuery, loading }))(InfoPageQuery);


