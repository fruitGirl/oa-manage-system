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
        let title;
        const { year, timeRange, performanceTypeCode } = r;
        if (performanceTypeCode === 'QUARTER_PERFORMANCE') {
          title =  `${year}年季度考核-${timeRange}`;
        } else if (performanceTypeCode === 'ANNUAL_PERFORMANCE') {
          title = `${year}年度考核`;
        }
        return <a href={`/performance/hrPerformanceConfirm.htm?timeRange=${timeRange}&year=${year}&performanceTypeCode=${performanceTypeCode}&title=${title}`}>详情</a>;
      }
    }
  ];
};

