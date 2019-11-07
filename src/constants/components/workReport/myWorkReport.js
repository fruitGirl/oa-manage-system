import moment from 'moment';
import Separate from 'components/common/Separate';

const SUBMITTED = 'SUBMITTED'; // 已提交
const UNSUBMIT = 'UNSUBMIT'; // 未提交
const UNDERWAY = 'UNDERWAY'; // 进行中
const UNSTART = 'UNSTART'; // 未开始

export const STATUS = [
  {
    label: '未开始',
    value: UNSTART
  },
  {
    label: '进行中',
    value: UNDERWAY
  },
  {
    label: '已提交',
    value: SUBMITTED
  },
  {
    label: '未提交',
    value: UNSUBMIT
  }
];

// 列配置
export const createColumns = ({ withdraw }) => {
  return [
    {
      title: '日期',
      dataIndex: 'reportTime',
      className: 'table-center',
      render: (t, r) => {
        let { gmtStart, gmtEnd } = r;
        gmtStart = gmtStart.slice(0, 10);
        gmtEnd = gmtEnd.slice(0, 10);
        return `${t}周 （${gmtStart} / ${gmtEnd}）`;
      }
    },
    {
      title: '状态',
      dataIndex: 'status.message',
      className: 'table-center'
    },
    {
      title: '评论数',
      dataIndex: 'commitCount',
      className: 'table-center',
      render(n) {
        return n || 0;
      }
    },
    {
      title: '提交时间',
      dataIndex: 'gmtSubmit',
      className: 'table-center',
      render: (t) => {
        return t || '—';
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      className: 'table-center',
      render: (o, r) => {
        let { id, status, reportTime } = r;
        const { name } = status;
        const curWeek = moment().week();
        const week = reportTime.split('-')[1];

        // 是否当前周
        const isCurWeek = curWeek == week; // eslint-disable-line

        // 是否上一周
        const isLastWeek = (curWeek - 1) == week; // eslint-disable-line
        const showWithdraw = (name === SUBMITTED)
          && (isCurWeek || isLastWeek);

        return (
          <div>
            {
              ((name === UNDERWAY) || (name === UNSTART))
                ? <a href={`/workReport/weekReportEdit.htm?workReportId=${id}`}>编辑</a>
                : null
            }
            {
              name === SUBMITTED
              ? <a href={`/workReport/userWorkReportQuery.htm?workReportId=${id}`}>查看</a>
              : null
            }
            {
              name === UNSUBMIT
                ? <a href={`/workReport/weekReportEdit.htm?workReportId=${id}`}>补交</a>
                : null
            }
            <Separate isVertical={false} />
            { showWithdraw
                ? <a onClick={() => withdraw({ workReportId: id })} href="javascript:;">撤回</a>
                : null
            }
          </div>
        );
      }
    },
  ];
};


