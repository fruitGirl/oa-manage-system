import React from 'react';
import 'styles/components/common/uploadFile.less';

const { message, Icon, Input } = window.antd;

class UploadImg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: []
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      const { value } = nextProps;
      value && this.setState({
        fileList: value || []
      });
    }
  }

  async handleChange(e) {
    const { action, name, size = 5, resFileName } = this.props;
    const _val = e.target.value.toLowerCase(); //把上传的图片格式变成小写
    if (!/\.(gif|jpg|jpeg|png)$/.test(_val)) {
      message.error('只支持JPG、PNG、GIF图片格式');
    } else {
      //可不可以上传
      var _canUpLoad = true;

      //如果支持\html5读取图片的体积
      if (e.target.files) {
        const isLtM = e.target.files[0].size / 1024 / 1024 < size;
        if (!isLtM) {
          _canUpLoad = false;
          message.error(`对不起！上传的图片大小不能超过${size}M！`);
        }
      }
      //如果可以上传
      if (_canUpLoad) {
        //请求接口
        let formData = new FormData();
        formData.append(name, e.target.files[0]);
        const fileCache = e.target.files[0];
        // 请求查询接口
        try {
          const res = await T.upload(action, formData);
          var _read = new FileReader();
          _read.readAsDataURL(fileCache);
          _read.onload = (e) => {
            const fileList = [{
              url: e.target.result,
              [resFileName]: res[resFileName]
            }];
            this.setState({
              fileList
            });
            this.props.onChange(fileList);
          };
        } catch (err) {
          T.showError(err);
        }
      }
    }
  }

  onRemove = () => {
    this.props.remove && this.props.remove(this.state.fileList);
    this.props.onChange([]);
    this.setState({
        fileList: []
    });
  }

  render() {
    const { fileList } = this.state;

    return (
      <div>
        <div className="upload-wrapper">
        { fileList.length
            ? null
            : (
                <div>
                    <div className="upload-container">
                      <Icon type="plus" />
                    </div>
                    <Input
                      className="file-input"
                      type="file"
                      title="点击上传新图片"
                      name="imageContent"
                      accept="image/gif,image/png,image/jpeg"
                      onChange={(e) => this.handleChange(e)}
                    />
                </div>
            )
        }
        {
          fileList.length
            ? (
                <div className="img-wrapper">
                  <img
                    className="img-content"
                    src={fileList[0].url}
                    alt="图片"
                  />
                  <div className="remove-icon-wrapper">
                    <Icon
                      onClick={this.onRemove}
                      className="remove-icon"
                      type="delete"
                    />
                  </div>
                </div>
            )
            : null
        }
        </div>
      </div>
    );
  }
}

export default UploadImg;
