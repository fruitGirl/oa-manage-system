/*
 * @Description: 个人-我的工资条-工资明细
 * @Author: danding
 * @Date: 2019-03-20 16:36:02
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-26 17:57:27
 */
import React from 'react';
import PropTypes from 'prop-types';
import { SALARY_CONFIGS } from 'constants/components/salary/salaryModal';
import 'styles/components/salary/mySalaryQuery/salaryModal.less';
import Separate from 'components/common/Separate';

const { Modal, Button, Spin } = window.antd;

// 工资信息的展示
const renderData = (data, openEye) => {
  return openEye ? (data || '无') : '***';
};

// 创建明细项
const createItem = (dataProvider, visibleFields, openEye) => {
  let items = [];
  SALARY_CONFIGS.forEach(i => {
    if (visibleFields.includes(i.field)) {
      items.push(
        <div className="clearfix salary-item">
          <span className="pull-left">{ i.label }</span>
          <span className="pull-right">
            { renderData(dataProvider[i.field], openEye) }
          </span>
        </div>
      );
    }
  });
  return (
    <div className="desc-wrapper">
      {items}
    </div>
  );
};

// 底部按钮
const createFooter = ({ onPrev, onNext, curIdx }) => {
  const listLen = CONFIG.userSalaryList.length;
  const disabledPrev = curIdx === 0;
  const disabledNext = curIdx === (listLen - 1);

  return (
    <div className="footer">
      <Button
        disabled={disabledPrev}
        onClick={onPrev}
      >上一条</Button>
      <Button
        disabled={disabledNext}
        type="primary"
        onClick={onNext}
      >下一条</Button>
    </div>
  );
};

class SalaryModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openEye: false, // 是否可以查看工资
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // 切换工资条时，眼睛关闭
    if (this.props.dataProvider !== nextProps.dataProvider) {
      this.setState({ openEye: false });
    }
  }

  // 是否展示工资信息
  dispalySalary = () => {
    const { openEye } = this.state;
    this.setState({
      openEye: !openEye
    });
  }

  render() {
    const { openEye } = this.state;
    const {
      visible,
      dataProvider,
      onPrev,
      onNext,
      hideModal,
      curLookSalaryIdx,
      visibleFields,
      loading
    } = this.props;
    const itemTit = CONFIG.userSalaryList[curLookSalaryIdx]
      ? CONFIG.userSalaryList[curLookSalaryIdx].title
      : '';

    const title = (
      <React.Fragment>
        <span>{itemTit}</span>
        <Separate size={5} isVertical={false} />
        <span>薪资明细</span>
      </React.Fragment>
    );

    return (
      <Modal
        title={title}
        visible={visible}
        width={500}
        footer={createFooter({
          onPrev,
          onNext,
          curIdx: curLookSalaryIdx
        })}
        destroyOnClose={true}
        onCancel={() =>{
          this.setState({openEye: false});
          hideModal();
        }}
      >
        <Spin spinning={loading}>
          <div className="clearfix attention-wrapper">
            <p className="attention-content pull-left">
              <span className="label">实发工资：</span>
              <span className="val">
                {renderData(dataProvider.realAmountValue, openEye)}
              </span>
            </p>
            <div className="pull-right">
              <span
                onClick={this.dispalySalary}
                className={`eye ${openEye ? 'eye-open' : 'eye-close'}`}
              />
            </div>
          </div>
          <h6 className="tip">工资条属于敏感信息，请注意保密</h6>
          { createItem(dataProvider, visibleFields, openEye) }
        </Spin>
      </Modal>
    );
  }
}

SalaryModal.propTypes = {
  visible: PropTypes.bool, // 弹框显隐
  dataProvider: PropTypes.array, // 工资详情
  onPrev: PropTypes.func, // 上一页
  onNext: PropTypes.func, // 下一页
  hideModal: PropTypes.func, // 关闭弹窗
  curLookSalaryIdx: PropTypes.number, // 当前查看工资的索引值
  visibleFields: PropTypes.array, // 可见工资列集合
  loading: PropTypes.bool, //是否加载动画
};



SalaryModal.defaultProps = {
  visible: false,
  dataProvider: {},
  onNext: () => {},
  onPrev: () => {},
  hideModal: () => {},
  curLookSalaryIdx: 0,
  visibleFields: [],
  loading: false
};

export default SalaryModal;

