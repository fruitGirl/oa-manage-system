/*
 * @Description: 事项提醒
 * @Author: danding
 * @Date: 2019-04-23 09:41:44
 * @Last Modified by: moran
 * @Last Modified time: 2019-09-24 09:43:04
 */

import React from 'react';
import InfoCard from 'components/common/InfoCard';
import 'styles/components/home/todo.less';

const { Row, Col, Badge } = window.antd;

class Todo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      approvingCount: 0,
      handingCount: 0
    };
    this.timer = null;
  }

  getInitData() {
    const url = `${T['processPath']}/messageNoticeQuery.json`;
    T.get(url, {}, false)
      .then((data) => {
        const acssCodeAndNewCoutMap = data['accessCodeAndNewCountMap'];
        const approvingCount = acssCodeAndNewCoutMap['APPROVING'] ? acssCodeAndNewCoutMap['APPROVING'] : 0; // 审批
        const handingCount = acssCodeAndNewCoutMap['HANDLING'] ? acssCodeAndNewCoutMap['HANDLING'] : 0; // 经办
        this.setState({
          approvingCount,
          handingCount
        });
      })
      .catch(() => {});
  }

  componentDidMount() {
    this.getInitData();
    this.getMsgCount();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  getMsgCount() {
    this.timer = setInterval(() => {
      const approvingCount = document.querySelector('.J-APPROVING').innerText;
      const handingCount = document.querySelector('.J-HANDLING').innerText;
      this.setState({
        approvingCount,
        handingCount
      });
    }, 7000);
  }

  render() {
    const { approvingCount } = this.state;

    return (
      <InfoCard wrapperClass="todo-wrapper" title="待办事项">
        <Row gutter={16}>
          <Col span={12}>
            <a href="/process/myApprovalQuery.htm" className="todo-content">
              <Badge offset={[8, 0]} count={approvingCount}>
                <div>待我审批</div>
              </Badge>
            </a>
          </Col>
          <Col span={12}>
            {/* <a href="/process/myHandleQuery.htm" className="todo-content">
              <Badge offset={[8, 0]} count={handingCount}>
                <div>待我经办</div>
              </Badge>
            </a> */}
          </Col>
        </Row>
      </InfoCard>
    );
  }
}

export default Todo;
