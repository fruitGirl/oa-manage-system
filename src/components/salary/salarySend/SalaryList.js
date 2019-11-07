/*
 * @Description: 工具-工资单发放-工资发放列表
 * @Author: danding
 * @Date: 2019-03-22 19:45:28
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-01 17:57:48
 */

import { PureComponent } from 'react';
import { connect } from 'dva';
import Separate from 'components/common/Separate';
import 'styles/components/salary/salarySend/salaryList.less';
import { UPLOAD_FILE_MODULE, } from 'constants/salary/salarySend';

const { Button, Card, Modal } = window.antd;

class SalaryList extends PureComponent {
  editColumn(id) {
    T.tool.redirectTo(`${CONFIG.frontPath}/salary/salaryModify.htm?id=${id}`);
  }

  removeSalary(payload) {
    Modal.confirm({
      title: '确定删除',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'salarySend/removeSalary',
          payload
        });
      }
    });
  }

  createList = (salaryListObj) => {
    let listEl = [];
    for (let key in salaryListObj) {
      listEl.push((
        <div className="item-wrapper">
          <div className="title-wrapper clearfix">
            <h6 className="pull-left">{key}</h6>
            <div className="line">
              <div className="line-content"></div>
            </div>
          </div>
          <div className="clearfix">
          {
            salaryListObj[key].map(i => {
              const { sentNumber, title, sendTotalNumber, id } = i;
              const isAllSend = sentNumber === sendTotalNumber;
              return (
                <Card
                  className="card pull-left"
                  title={title}
                  extra={(
                    <div>
                      <a href="javascript:;" onClick={() => this.editColumn(id)}>编辑</a>
                      <Separate isVertical={false} />
                      <a className="remove-mark" href="javascript:;" onClick={() => this.removeSalary(id)}>删除</a>
                    </div>
                  )}
                >
                  <div className="clearfix">
                    <div className="pull-left desc">
                      <div className="desc-count">
                        <span className={isAllSend ? '' : "send-number-color" }>{sentNumber || 0}</span>
                        /
                        <span>{sendTotalNumber || 0}</span>
                      </div>
                      <div className="send-status">{ Number(sentNumber) ? '已发送' :  '未发送' }</div>
                    </div>
                    <Button
                      className="pull-right jump-btn"
                      type={isAllSend ? 'default' : 'primary'}
                      onClick={() => this.goDetail(id, title)}
                    >
                      { isAllSend ? '查看发放' : '前往发放'}
                    </Button>
                  </div>
                </Card>
              );
            })
          }
          </div>
        </div>
      ));
    }
    return listEl;
  }

  goDetail(id, title) {
    T.tool.redirectTo(`${CONFIG.frontPath}/salary/salaryManage.htm?salaryBaseInfoId=${id}&title=${window.btoa(encodeURIComponent(title))}`);
  }

  switchModule(payload) {
    this.props.dispatch({
      type: 'salarySend/switchModule',
      payload
    });
  }

  render() {
    const { salaryListObj } = this.props;

    return (
      <div>
        <h5>工资条发放</h5>
        <Separate size={15} />
        <Button type="primary" onClick={() => this.switchModule(UPLOAD_FILE_MODULE)}>Excel发工资条</Button>
        <Separate size={35}/>
        <div>
          {
            this.createList(salaryListObj)
          }
        </div>
      </div>
    );
  }
}

export default connect(({ salarySend }) => ({ ...salarySend }))(SalaryList);
