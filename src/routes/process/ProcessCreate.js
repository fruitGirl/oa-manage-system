/*
 * @Description: 流程-发起申请
 * @Author: moran
 * @Date: 2019-09-12 10:48:05
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-09 15:43:05
 */
import React from 'react';
import BasicLayout from 'layouts/BasicLayout';
import ApprovalCreate from "components/process/processCreate/ApprovalCreate";

class ProcessCreate extends React.PureComponent {
  render() {
    return(
      <BasicLayout>
        <ApprovalCreate/>
      </BasicLayout>
    );
  }
}

export default ProcessCreate;
