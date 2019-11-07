/*
 * @Description: 流程-基本信息-模板图标
 * @Author: danding
 * @Date: 2019-09-12 16:28:53
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-12 16:56:57
 */

import React from 'react';
import 'styles/components/process/processConfigEdit/iconTemplate.less';
import Separate from 'components/common/Separate';

const { Button, Col, Row, Modal } = window.antd;

class IconTemplate extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataProvider: this.getDataProvider(30), // 图片集合
      visible: false,
      selectedIconKey: props.value
    };
  }

  // 获取图标集
  getDataProvider = (count) => {
    let dataProvider = [];
    for (let i = 1; i < (count + 1); i++) {
      dataProvider.push(`approval_${i}.png`);
    }
    return dataProvider;
  }

  hideModal = () => {
    this.setState({
      visible: false
    });
  }

  onSubmit = () => {
    this.props.onChange(this.state.selectedIconKey);
    this.hideModal();
  }

  // 显示弹窗
  showModal = () => {
    const { value } = this.props;
    this.setState({
      visible: true,
      selectedIconKey: value
    });
  }

  // 选择图标
  onSelect = (val) => {
    this.setState({
      selectedIconKey: val
    });
  }

  render() {
    const { value } = this.props;
    const { visible, selectedIconKey, dataProvider } = this.state;

    return (
      <div>
        <img
          className="template-icon selected-template-icon"
          src={value ? window.T.getImg(`process/approval-logo/${value}`) : ''}
          alt="选中的图标"
        />
        <Separate isVertical={false} />
        <Button onClick={this.showModal}>图标选择</Button>
        <Modal
          title="选择图标"
          visible={visible}
          width={550}
          onCancel={this.hideModal}
          onOk={this.onSubmit}
          destroyOnClose={true}
        >
          <Row
            type="flex"
            style={{justifyContent: 'space-between'}}
            gutter={32}
          >
            {
              dataProvider.map(i => {
                const isSelected = i === selectedIconKey;
                return (
                  <Col className="icon-template-wrapper">
                    <img
                      className={`template-icon ${isSelected ? 'selected-template-icon' : ''}`}
                      src={window.T.getImg(`process/approval-logo/${i}`)}
                      alt="图标"
                      onClick={() => { this.onSelect(i); }}
                    />
                    { isSelected && <div className="icon-selected"></div>}
                  </Col>
                );
              })
            }
          </Row>
        </Modal>
      </div>
    );
  }
}

export default IconTemplate;
