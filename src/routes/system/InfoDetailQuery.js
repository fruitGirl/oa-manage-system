/*
 * @Description: 文章详情
 * @Author: danding
 * @Date: 2019-04-22 14:54:53
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 17:53:33
 */

import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import CustomBreadcrumb from 'components/common/CustomBreadcrumb';
import Article from 'components/businessCommon/Article';

class InfoDetailQuery extends React.PureComponent {
  componentDidMount() {
    const { channel } = T.tool.getSearchParams();
    this.channel = channel;
    this.config = [
      { link: '/index.htm', label: '首页'},
      { label: this.channel },
      { label: '文章详情' }
    ];
  }

  render() {
    const data = { ...CONFIG.pageDetail, files: CONFIG.attachments };
    return (
      <BasicLayout>
        <CustomBreadcrumb config={this.config} />
        <Article wrapperClass="info-detail-article" data={data} />
      </BasicLayout>
    );
  }
}

export default connect(({ infoDetailQuery, loading }) => ({ ...infoDetailQuery, loading }))(InfoDetailQuery);


