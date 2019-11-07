/*
 * @Description: 新闻预览
 * @Author: danding
 * @Date: 2019-04-23 09:42:32
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 17:53:25
 */

import React from 'react';
import PropTypes from 'prop-types';
import Article from 'components/businessCommon/Article';

const { Modal } = window.antd;

const PreviewArtical = ({ hideModal, visible, data }) => {
  return (
    <Modal
      visible={visible}
      onCancel={hideModal}
      footer={null}
      width={800}
    >
      <Article data={data} />
    </Modal>
  );
};

PreviewArtical.propTypes = {
  hideModal: PropTypes.func,
  visible: PropTypes.bool,
  data: PropTypes.object
};

PreviewArtical.defaultProps = {
  hideModal: () => {},
  visible: false,
  data: {}
};

export default PreviewArtical;
