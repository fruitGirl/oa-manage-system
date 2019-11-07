/*
 * @Description: 编辑文章
 * @Author: danding
 * @Date: 2019-04-23 09:39:34
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 18:06:15
 */

import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import NormalForm from 'components/system/infoCreate/NormalForm';
import PreviewArticle from 'components/businessCommon/PreviewArticle';
import CustomBreadcrumb from 'components/common/CustomBreadcrumb';
import Separate from 'components/common/Separate';

class InfoCreate extends React.PureComponent {
  componentDidMount() {
    const { id } = T.tool.getSearchParams();
    this.config = [
      { link: '/system/infoManage.htm', label: '文章管理'},
      { label: id ? '文章编辑' : '文章新增' }
    ];
  }

  hidePreview = () => {
    this.props.dispatch({
      type: 'infoCreate/hidePreview'
    });
  }

  render() {
    const { showPreview, previewData, } = this.props;

    return (
      <BasicLayout>
        <CustomBreadcrumb config={this.config} />
        <Separate />
        <NormalForm />
        <PreviewArticle
          hideModal={this.hidePreview}
          visible={showPreview}
          data={previewData}
        />
      </BasicLayout>
    );
  }
}

export default connect(({ infoCreate, loading }) => ({ ...infoCreate, loading }))(InfoCreate);


