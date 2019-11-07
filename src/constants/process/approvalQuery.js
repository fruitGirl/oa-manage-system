import { APPROVE, APPROVED, VETOED, RECALLED } from './index';

// 审批查询列
export const columns = ({ detail }) => {
  return [
    {
      title: '申请人',
      dataIndex: 'nickName',
      width: '18%',
      className: 'table-center'
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
      width: '18%',
      className: 'table-center'
    },
    {
      title: '发起时间',
      dataIndex: 'gmtCreate',
      width: '18%',
      className: 'table-center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '16%',
      className: `table-center`,
      render: (status) => {
        const { name, message='' } = status;
        let TableStatusClass = '';
        // 状态字体颜色显示
        if (name === APPROVE) {
          TableStatusClass = 'ft-orange';
        } else if (name === APPROVED) {
          TableStatusClass = 'ft-gray';
        } else {
          TableStatusClass = 'ft-red';
        }
  
        return <div className={TableStatusClass}>{message}</div>;
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: '8%',
      className: 'table-center',
      render: (text, row) => {
        return (
          <a
            className="modify-span"
            style={{ display: 'block' }}
            onClick={() => detail(row)}
          >
            详情
          </a>
        );
      }
    }
  ];
};

// 审批状态
export const APPROVAL_STATUS = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '待审批',
    value: APPROVE
  },
  {
    label: '已审批',
    value: APPROVED
  },
  {
    label: '已否决',
    value: VETOED
  },
  {
    label: '已撤回',
    value: RECALLED
  },
];
