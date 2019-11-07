/*
 * @Description: 发起审批入口页
 * @Author: moran
 * @Date: 2019-09-10 15:37:27
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-14 16:01:43
 */
import { connect } from 'dva';
import React from 'react';
import BasicLayout from 'layouts/BasicLayout';
import ApplyCard from 'components/businessCommon/ApplyCard';
import 'styles/process/processInit.less';
const { Spin } = window.antd;

class ProcessInit extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'processInit/getProcessStartInit',
      payload: ''
    });
  }
  render() {
    const { processInitLists, loading } = this.props;
    const processInitLoading = loading.effects['processInit/getProcessStartInit'];
    return (
      <BasicLayout>
        <Spin spinning={processInitLoading}>
          {
            processInitLists.map((item, inex) => {
              const { name, processConfigs } = item;
              const configNum = processConfigs.length;
              return (
                <div className="process-init-box">
                  <div className="title">{name}({configNum})</div>
                  {
                    processConfigs.map(i => {
                      const { id } = i;
                      return (
                        <ApplyCard key={id} config={i}/>
                      );
                    })
                  }
                </div>
              );
            })
          }
        </Spin>
      </BasicLayout>
    );
  }
}

export default connect(({ processInit, loading }) => ({ ...processInit, loading }))(ProcessInit);
