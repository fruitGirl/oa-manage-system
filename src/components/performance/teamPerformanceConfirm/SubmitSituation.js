import React from 'react';
import PropTypes from 'prop-types';
import 'styles/components/performance/submitSituation.less';

const { Modal, Row, Col, Collapse, Icon, Spin, message, } = window.antd;
const { Panel } = Collapse;

export default class SubmitSituation extends React.PureComponent {
  goDetail = (payload) => {
    const { authorityResult = {} } = this.props.info;
    const { performanceAssessmentId, statusEnum, userId } = payload;
    if (authorityResult[userId]) { // 有权限访问
      window.open(`/performance/performanceReviewEdit.htm?id=${performanceAssessmentId}&status=${statusEnum.name}`);
    } else {
      message.warning('权限不足');
    }
  }

  render() {
    const { visible, info, onHide, loading } = this.props;
    const {
      submitNum,
      unSubmitNum,
      unSubmitDetail = [], // 未提交人员信息
      submitDetail = [], // 提交人员信息
      name,
    } = info;

    return (
      <Modal
        title={name}
        visible={visible}
        footer={false}
        width={700}
        onCancel={onHide}
        destroyOnClose={true}
      >
        <Spin spinning={loading}>
          <Row gutter={48} className="submit-situation-wrapper">
            <Col span={12} className="left-content">
              <p className="panel-title">已提交（{submitNum || 0}）</p>
              <Collapse
                bordered={false}
                expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} style={{color: '#999'}} />}
              >
                {
                  submitDetail.map(i => {
                    const {
                      scope,
                      userNum,
                      percent,
                      userInfoSimpleList = []
                    } = i;
                    return (
                      <Panel
                        className="panel"
                        key={scope}
                        header={(
                          <div className="panel-title clearfix">
                            <div className="pull-left">{scope}分</div>
                            <div className="pull-right">{userNum || 0}人 {percent}%</div>
                          </div>
                        )}
                      >
                        <div className="panel-content">
                          {
                            userInfoSimpleList.map(i => {
                              const { departmentName, nickName } = i;
                              return (
                                <div className="content-item clearfix" onClick={() => this.goDetail(i)}>
                                  <span className="pull-left">{nickName}</span>
                                  <span className="pull-right">{departmentName}</span>
                                </div>
                              );
                            })
                          }
                        </div>
                      </Panel>
                    );
                  })
                }
              </Collapse>
            </Col>
            <Col span={12} className="right-content">
              <p className="panel-title">未提交（{unSubmitNum || 0}）</p>
              <div>
                {
                  unSubmitDetail.map(i => {
                    return <p className="panel-content">{i}</p>;
                  })
                }
              </div>
            </Col>
          </Row>
        </Spin>
      </Modal>
    );
  }
}

SubmitSituation.propTypes = {
  visible: PropTypes.bool, // 是否显示弹窗
  info: PropTypes.object, // 绩效提交信息
  onHide: PropTypes.func, // 隐藏弹窗
  loading: PropTypes.bool, // 弹窗加载信息的loading
};

SubmitSituation.defaultProps = {
  visible: false,
  info: {},
  onHide: () => {},
  loading: false
};
