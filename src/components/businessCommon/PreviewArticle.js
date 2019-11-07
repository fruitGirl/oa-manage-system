import React from 'react';
import Article from 'components/businessCommon/Article';
import 'styles/components/common/previewArticle.less';

const { Modal } = window.antd;

const PreviewArticle = ({ hideModal, visible, data }) => {
  return (
    <Modal
      visible={visible}
      onCancel={hideModal}
      footer={null}
      width={800}
    >
      <Article data={data} wrapperClass="preview-article-wrapper" />
    </Modal>
  );
};

export default PreviewArticle;
