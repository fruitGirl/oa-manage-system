/*
 * @Description: 审批流程
 * @Author: moran 
 * @Date: 2019-09-12 14:56:21 
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-14 17:11:21
 */
import React from 'react';
import AddPersonModal from 'components/businessCommon/AddPersonModal';
import "styles/components/process/processCreate/approvalProcess.less";
const { Row, Col } = window.antd;

class ApprovalProcess extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 选择人员弹框是否显示
      combineConfigs: [], // 渲染需要的审批流程数据
      selectConfigDatas: {} // 选择人员需要传过去的数据
    };
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.configs !== prevProps.configs) {
      const { configs } = this.props;
      this.setState({
        combineConfigs: configs
      });
    }
  }

  // 选择人员
  handleSelectPerson = ({selectUserRange, processNodeConfigId, selfSelectedNumber}) => {
    const selectConfigDatas = { optionDatas: selectUserRange, processNodeConfigId, selfSelectedNumber };
    this.setState({
      visible: true,
      selectConfigDatas
    });
  }

  // 选择自选人提交
  handleSubmit = (values) => {
    const nodeConfigId = Object.keys(values)[0];
    const selectPersonValues = values[nodeConfigId];
    const { configs } = this.props;
    // 组装已经选择的自选人数据
    const combineConfigs = configs.map(i => {
      const { processNodeConfigId, selectUserRange } = i;
      if (nodeConfigId === processNodeConfigId){
        // 获取自选人id
        i.personIds = selectPersonValues;
        // 获取选择的自选人名字
        const personNames = selectPersonValues.map(item => {
          return selectUserRange[item];
        });
        i.personNames = personNames;
      }
      return i;
    });
    this.setState({
      visible: false,
      combineConfigs
    }, () => {
      this.props.submit(values);
    });
    
  }

  // 关闭选择人员弹框
  handleHide = () => {
    this.setState({
      visible: false
    });
  }

  render() {
    const { visible, combineConfigs, selectConfigDatas } = this.state;
    return (
      <div className="approval-process-box">
        {/* <p className="ft-gray">审批流程</p> */}
        {
          combineConfigs.map((i, index) => {
            const {
              name,
              potentialOperatorNickNames = [],
              type,
              selectUserRange,
              processNodeConfigId,
              personNames,
              selfSelectedNumber,
              noticeUserNickNames = []
            } = i;
            return (
              <Row className="row-box" key={index}>
                <Col span={2}>
                  <i className="i-block icon-size waitting_icon" />
                </Col>
                <Col span={22} className="info-main">
                  <Row>
                    <Col span={18} className="left-box">
                      {/* 如果没有自选人员或者自选人员数据字段 */}
                      {!selectUserRange || personNames ?
                        <span className="name-block">
                          {/* 抄送节点的时候拿noticeUserNickNames， 其余拿potentialOperatorNickNames */}
                          {
                            personNames ? personNames.join('、') : 
                            (type.name === 'NOTICE' ? noticeUserNickNames.join('、') :
                            potentialOperatorNickNames.join('、'))
                          }
                        </span>
                        // 有自选人员并且没有选中自选人员显示
                      : <span className="ft-gray"> 
                          发起人自选{selfSelectedNumber}人
                        </span>
                      }
                      <span className="ft-gray name-title">
                        (<div className="content-show">{name}</div>)
                      </span>
                    </Col>
                    {
                      selectUserRange ? (
                        <Col span={6} className="row-right">
                          <a
                            href="javascript:;"
                            onClick={() => this.handleSelectPerson({selectUserRange, processNodeConfigId, selfSelectedNumber })}>
                            请选择人员
                          </a>
                        </Col>
                      ) : null
                    }
                    
                  </Row>
                </Col>
              </Row>
              
            );
          })
        }
        {/* 选择人员弹窗 */}
       <AddPersonModal
          visible={visible}
          cancel={this.handleHide}
          sumbit={this.handleSubmit}
          configs={selectConfigDatas}/>
      </div>
    );
  }
}

ApprovalProcess.propTypes = {
  configs: PropTypes.array.isRequired, // 审批流程块配置
};

ApprovalProcess.defaultProps = {
  configs: [],
};

export default ApprovalProcess;
