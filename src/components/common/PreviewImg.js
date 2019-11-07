/*
 * @Description: 图片预览组件
 * @Author: danding
 * @Date: 2019-05-21 15:12:29
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 18:01:00
 */

import React from 'react';
import PropTypes from 'prop-types';
import 'styles/components/common/previewImg.less';

const { Modal } = window.antd;

class PreviewImg extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0, // 当前选中的图片索引数
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.activeIndex !== nextProps.activeIndex) {
      this.setState({
        activeIndex: nextProps.activeIndex
      });
    }
  }

  imgThumbnail = (active) => {
    const { fileList } = this.props;
    return fileList.map((item, index) => {
      const isActive = active == index; // eslint-disable-line
      return (
        <span
          key={index}
          className={isActive
            ? 'active img_wrapper'
            : 'img_wrapper'
          }
        >
          <img
            src={item}
            className="img_item"
            data-index={index}
            alt=''
          />
        </span>
      );
    });
  }

  switchImg = (e) => {
    let thisDom = e.target;
    let activeIndex = thisDom.getAttribute('data-index');
    this.setState({
      activeIndex
    });
  }

  render() {
    const { activeIndex } = this.state;
    const { previewVisible, hideModal, fileList, } = this.props;
    const previewImage = fileList[activeIndex];

    return (
      <Modal
        width={600}
        footer={null}
        visible={previewVisible}
        onCancel={hideModal}
      >
        <div className="img_box">
          <div className="img_preview">
            <img
              alt="example"
              style={{ maxWidth: '100%' }}
              src={previewImage}
            />
          </div>
        </div>
        <div
          onClick={this.switchImg}
          className="thumbnail_footer clearfix"
        >
          {this.imgThumbnail(activeIndex)}
        </div>
      </Modal>
    );
  }
}

PreviewImg.propTypes = {
  fileList: PropTypes.array,
  hideModal: PropTypes.func,
  previewVisible: PropTypes.bool,
  activeIndex: PropTypes.number
};

PreviewImg.defaultProps = {
  fileList: [], // 文件数据集合
  hideModal: () => {}, // 隐藏弹窗
  previewVisible: false, // 弹窗是否可见
  activeIndex: 0, // 预览图片的索引值默认值
};

export default PreviewImg;

