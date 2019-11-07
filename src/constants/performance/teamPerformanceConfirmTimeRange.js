export const createColumns = () => {
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
        if (t === 'QUARTER_PERFORMANCE') {
          typeName = '季度考核';
        } else if (t === 'ANNUAL_PERFORMANCE') {
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
        if (row.performanceTypeCode !== 'ANNUAL_PERFORMANCE') {
          rangeName = t;
        }
        return rangeName;
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      className: 'table-center',
      render: (o, r) => {
        const { year, timeRange, performanceTypeCode } = r;
        return <a href={`/performance/teamPerformanceConfirm.htm?timeRange=${timeRange}&year=${year}&performanceTypeCode=${performanceTypeCode}&teamId=${r.teamId}`}>详情</a>;
      }
    }
  ];
};

