import { QUARTER_PERFORMANCE, ANNUAL_PERFORMANCE } from 'constants/performance/index';
export const columns = ({ showPerformance, editPerformance, open }) => {
  return [
    {
      title: '考核年度',
      dataIndex: 'year',
      className: 'table-center'
    },
    {
      title: '考核类型',
      dataIndex: 'performanceTypeCode',
      className: 'table-center',
      render(t) {
        let typeName = '-';
        if (t === QUARTER_PERFORMANCE) {
          typeName = '季度考核';
        } else if (t === ANNUAL_PERFORMANCE) {
          typeName = '年度考核';
        }
        return typeName;
      }
    },
    {
      title: '季度',
      dataIndex: 'timeRange',
      className: 'table-center',
      render(t, row) {
        let rangeName = '-';

        // 年度考核显示'-'， 季度考核显示季度
        if (row.performanceTypeCode !== ANNUAL_PERFORMANCE) {
          rangeName = t;
        }
        return rangeName;
      }
    },
    {
      title: '考核范围',
      dataIndex: 'assessRange',
      className: 'table-center',
      render(t, row) {
        const value = t.message || '-';
        return <a href="javascript:;" className="assessRange" onClick={() => showPerformance({id: row.id})}>{value}</a>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      className: 'table-center',
      render(t) {
        return t.message || '-';
      }
    },
    {
      title: '开启人',
      dataIndex: 'openPerson',
      className: 'table-center',
      render(t) {
        return t || '-';
      }
    },
    {
      title: '开启时间',
      dataIndex: 'gmtCreate',
      className: 'table-center',
      render(t) {
        return t || '-';
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      className: 'table-center',
      render: (o, row) => {
        const { name } = row.status;
        return (
          <div className="operate">
            { name !== 'END'
                ? <a href="javascript:;" onClick={() => editPerformance({id: row.id})}>编辑</a>
                : null
            }
            { name === 'UNSTART'
                ? <a href="javascript:;" onClick={() => open({id: row.id})}>开启</a>
                : null
            }
          </div>
        );
      }
    }
  ];
};

