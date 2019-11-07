/*
 * @Description: 文章管理
 * @Author: danding
 * @Date: 2019-04-23 09:39:22
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 18:06:21
 */

import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import SearchBar from 'components/system/infoManage/SearchBar';
import InfoTable from 'components/system/infoManage/InfoTable';
import PreviewArticle from 'components/businessCommon/PreviewArticle';

class InfoManage extends React.PureComponent {
  componentDidMount() {
    this.getColumnData();
  }

  getColumnData() {
    this.props.dispatch({
      type: 'infoManage/getColumnTree'
    });
  }

  handleSubmit = (payload) => {
    this.props.dispatch({
      type: 'infoManage/getList',
      payload: { ...payload, currentPage: 1 }
    });
  }

  hidePreview = () => {
    this.props.dispatch({
      type: 'infoManage/hidePreview'
    });
  }

  render() {
    const { columnData, showPreview, previewData } = this.props;

    return (
      <BasicLayout>
        <SearchBar
          columnData={columnData}
          handleSubmit={this.handleSubmit}
        />
        <InfoTable />
        <PreviewArticle
          hideModal={this.hidePreview}
          visible={showPreview}
          data={previewData}
        />
      </BasicLayout>
    );
  }
}

export default connect(({ infoManage, loading }) => ({ ...infoManage, loading }))(InfoManage);


