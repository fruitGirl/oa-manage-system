/*
 * @Description: 主管周报-上传图片
 * @Author: danding
 * @Date: 2019-05-16 11:53:32
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 15:53:35
 */

import React from 'react';
import PropTypes from 'prop-types';
import 'styles/components/workReport/weekReportForManageEdit/uploadImg.less';

const { Upload, Icon, Modal, message } = window.antd;
const uploadButton = (
  <div>
    <Icon type="plus" />
  </div>
);

class UploadImg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false, // 是否展示弹框
      previewImage: '', // 预览图片地址
      fileList: this.props.defaultValue || [], // 图片队列
      activeIndex: 0, // 当前选中的图片索引数
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.defaultValue !== nextProps.defaultProps) {
      this.setState({
        fileList: nextProps.defaultValue
      });
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    const activeIndex = this.state.fileList.indexOf(file);
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
      activeIndex
    });
  };

  handleChange = (info) => {
    let { fileList }= info;
    fileList = fileList.filter(file => {
      // 上传错误
      if (file.response && (file.response.success === false)) {
        T.showErrorMessage(file.response.error.message);
        return false;
      }
      return true;
    });
    this.props.onChange && this.props.onChange(fileList);
    this.setState({ fileList });
  }

  handleRemove = (file) => {
    const index = this.state.fileList.indexOf(file);
    this.props.onDelete && this.props.onDelete(file, index);
    return false;
  }

  beforeUpload = (file) => {
    const { maxSize = 5 } = this.props;
    const isImgType = (/image\/(gif|jpg|jpeg|png)$/).test(file.type);
    if (!isImgType) {
      message.error('请上传图片类型');
    }
    const isLtSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtSize) {
      message.error(`图片不能大于${maxSize}M`);
    }
    return isImgType && isLtSize;
  }

  imgThumbnail = (active) => {
    const { fileList } = this.state;
    return fileList.map((item, index) => {
      const isActive = active == index; // eslint-disable-line

      return (
        <span key={index} className={isActive ? 'active img_wrapper' : 'img_wrapper'}>
          <img src={item.url || item.thumbUrl} className="img_item" data-index={index} alt="" />
        </span>
      );
    });
  }

  switchImg = (e) => {
    let thisDom = e.target;
    let src = thisDom.getAttribute('src');
    let activeIndex = thisDom.getAttribute('data-index');
    this.setState({
      previewImage: src,
      activeIndex
    });
  }

  render() {
    const { maxCount = 1, action, data, name } = this.props;
    const { previewVisible, previewImage, fileList, activeIndex, } = this.state;

    return (
      <div className="clearfix">
        <Upload
          action={action}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
          beforeUpload={this.beforeUpload}
          data={data}
          name={name}
        >
          {fileList.length >= maxCount ? null : uploadButton}
        </Upload>
        <Modal
          width={600}
          footer={null}
          visible={previewVisible}
          onCancel={this.handleCancel}
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
      </div>
    );
  }
}

UploadImg.propTypes = {
  maxCount: PropTypes.number,
  action: PropTypes.string.isRequired,
  maxSize: PropTypes.number,
  data: PropTypes.object,
  name: PropTypes.string,
};

UploadImg.defaultProps = {
  maxCount: 1, // 最多上传数
  action: '', // 请求接口
  maxSize: 5, // 单张最大上传大小
  data: {}, // 请求参数
  name: 'file', // 请求文件参数
};
export default UploadImg;
