// 发送状态
export const SEND_STATUS = 'SENT';
export const UNSEND = 'UN_SENT';
export const RECALL = 'RECALL';
export const SEND_STATUS_CONFIG = {
  [RECALL]: '已撤回',
  [UNSEND]: '未发送',
  [SEND_STATUS]: '已发送'
};

// 列表配置项
export const createColumns = ({ sendSalary, withdrawSalary, queryUserSalary, hoverIdx, }) => {
  return [
    {
      title: '花名',
      dataIndex: 'realNickName',
      className: 'table-center'
    },
    {
      title: '员工状态',
      dataIndex: 'jobStatus',
      className: 'table-center'
    },
    {
      title: '实发工资',
      dataIndex: 'realAmountValue',
      className: 'table-center'
    },
    {
      title: '发送状态',
      dataIndex: 'sendStatus',
      className: 'table-center',
      render: (s) => (<span>{SEND_STATUS_CONFIG[s] || '未知'}</span>)
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: 200,
      className: 'table-center',
      render: (o, r, index) => {
        const { sendStatus, id } = r;
        const hoverCurRow = index === hoverIdx;
        return (
          <div className="operate-wrapper">
            { sendStatus === UNSEND
              ? <a href="javascript:;" onClick={() => sendSalary([id])}>发送</a>
              : null
            }
            { sendStatus === RECALL
              ? <a href="javascript:;" onClick={() => sendSalary([id])}>重新发送</a>
              : null
            }
            { sendStatus === SEND_STATUS
              ? <a href="javascript:;" className="withdraw" onClick={() => withdrawSalary(id)}>撤回</a>
              : null
            }
             { ((sendStatus !== SEND_STATUS) && hoverCurRow)
              ? <a href="javascript:;" onClick={() => queryUserSalary(id)}>编辑</a>
              : null
            }
          </div>
        );
      }
    },
  ];
};

