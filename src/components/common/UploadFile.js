import React from 'react';
import 'styles/components/common/uploadFile.less';

const { Upload, message } = window.antd;
const uploadButton = (
  <a href="javascript:;">添加附件</a>
);

class UploadFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: []
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      nextProps.fileList && this.setState({
        fileList: nextProps.fileList
      });
    }
  }

  beforeUpload = (file, fileList) => {
    const { size = 5, accept } = this.props;
    let isFileType = true;
    if (accept) {
      isFileType = accept.includes(file.type);
      if (!isFileType) {
        message.error('请上传正确的文件格式!');
      }
    }
    const isLtSize = file.size / 1024 / 1024 < size;
    if (!isLtSize) {
      message.error(`文件上传最大${size}M`);
    }

    if (!isFileType || !isLtSize) {
      fileList.shift();
    }

    return isFileType && isLtSize;
  }

  handleChange = (info) => {
    const { count = 1, resFileName } = this.props;
    let { fileList }= info;
    fileList = fileList.slice(-(1 + count));

    fileList = fileList.map((file) => {
      if (file.response && file.response.success) {
        file[resFileName] = file.response[resFileName];
      }
      return file;
    });

    fileList = fileList.filter(file => {
      if (file.response && (file.response.success === false)) {
        T.showErrorMessage(file.response.error.message);
        return false;
      }
      return true;
    });
    
    this.props.onChange(fileList);
    this.setState({ fileList });
  }

  onRemove = (file) => {
    this.props.onRemove && this.props.onRemove(file);
  }

  render() {
    const { action, count, accept } = this.props;
    const { fileList } = this.state;
    return (
      <Upload
        action={action}
        fileList={fileList}
        accept={accept}
        showUploadList={{showPreviewIcon: false}}
        onChange={this.handleChange}
        beforeUpload={this.beforeUpload}
        withCredentials={true}
        onRemove={this.onRemove}
      >
      { fileList.length >= count ? null : uploadButton }
      </Upload>
    );
  }
}

export default UploadFile;
