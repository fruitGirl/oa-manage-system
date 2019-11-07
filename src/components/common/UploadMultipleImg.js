/*
 * @Description: 上传一张或者多张图片
 * @Author: moran 
 * @Date: 2019-09-16 15:25:50 
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-12 12:41:07
 */
import React from 'react';
import 'styles/components/common/uploadMultipleImg.less';
const { Upload, Icon, message } = window.antd;

class UploadMultipleImg extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileList: []
    };
  }
  
  // 上传前的校验
  beforeUpload = (file) => {
    const { size, accept, imgType } = this.props;
    const isFileType = accept.includes(file.type);
    const imgTypeString = imgType.join('、');
    if (!isFileType) {
      message.error(`只支持${imgTypeString}图片格式`);
      return false;
    }
    const isLtM = file.size / 1024 / 1024 < size;
    if (!isLtM) {
      message.error(`对不起！上传的图片大小不能超过${size}M！`);
      return false;
    }
    return true;
  }

  handleChange = ({ fileList }) => {
    // 解决上传时，图片预览不出来的问题
    fileList = fileList.map(i => {
      if (i.status === 'done') i.url = i.response.url;
      return i;
    });
    // 过滤上传成功的
    fileList = fileList.filter(i => i.status);
    this.setState({ fileList });
    this.props.onChange(fileList);
  }

  render() {
    const { fileList } = this.state;
    const { amount, action } = this.props;
    
    // 上传按钮
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text"></div>
      </div>
    );
    const showUploadList = {
      showPreviewIcon: false
    };
    return (
      <div className="clearfix">
        <Upload
          action={action}
          listType="picture-card"
          fileList={fileList}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
          showUploadList={showUploadList}
        >
          {fileList.length >= amount ? null : uploadButton}
        </Upload>
      </div>
    );
  }
}

UploadMultipleImg.propTypes = {
  amount: PropTypes.number, // 上传个数
  action: PropTypes.string, // 上传接口
  accept: PropTypes.Array, // 上传图片接受的类型
  size: PropTypes.number, // 上传接受的最大尺寸
  imgType: PropTypes.Array, // 上传图片接受的类型
};

UploadMultipleImg.defaultProps = {
  amount: 9,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  accept: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
  size: 20,
  imgType: ['png']
};

export default UploadMultipleImg;

