/**
 * 创建审核列表列配置项
 * @param {string} selectedColumn 选中的实发工资列
 */
export const createColumns = (selectedColumn) => {
  return [
    {
      title: '工号',
      dataIndex: 'jobNumber',
      className: (selectedColumn === 'jobNumber')
      ? 'table-center highlight-column'
      : 'table-center',
      width: 120,
      fixed: true,
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
      width: 130,
      className: (selectedColumn === 'departmentName')
        ? 'table-center highlight-column'
        : 'table-center',
      fixed: true,
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      width: 120,
      className: (selectedColumn === 'realName')
        ? 'table-center highlight-column'
        : 'table-center',
      fixed: true,
    },
    {
      title: '花名',
      dataIndex: 'nickName',
      width: 130,
      className: (selectedColumn === 'nickName')
        ? 'table-center highlight-column'
        : 'table-center',
      fixed: true,
    },
    {
      title: '应出勤',
      width: 120,
      dataIndex: 'shouldAttendance',
      className: (selectedColumn === 'shouldAttendance')
        ? 'table-center highlight-column'
        : 'table-center',
    },
    {
      title: '实际出勤',
      dataIndex: 'actualAttendance',
      width: 100,
      className: (selectedColumn === 'actualAttendance')
        ? 'table-center highlight-column'
        : 'table-center',
    },
    {
      title: '基本工资',
      width: 100,
      dataIndex: 'basicSalary',
      className: (selectedColumn === 'basicSalary')
        ? 'table-center highlight-column'
        : 'table-center',
    },
    {
      title: '绩效奖金',
      dataIndex: 'performanceBonus',
      width: 100,
      className: (selectedColumn === 'performanceBonus')
        ? 'table-center highlight-column'
        : 'table-center',
    },
    {
      title: '加班补贴',
      dataIndex: 'overtimeSalary',
      width: 100,
      className: (selectedColumn === 'overtimeSalary')
        ? 'table-center highlight-column'
        : 'table-center',
    },
    {
      title: '病假工资',
      dataIndex: 'sickLeaveSalary',
      width: 100,
      className: (selectedColumn === 'sickLeaveSalary')
        ? 'table-center highlight-column'
        : 'table-center',
    },
    {
      title: '其他扣除项',
      dataIndex: 'otherDeductItems',
      width: 120,
      className: (selectedColumn === 'otherDeductItems')
        ? 'table-center highlight-column'
        : 'table-center',
    },
    {
      title: '应发工资',
      width: 100,
      dataIndex: 'dueSalary',
      className: (selectedColumn === 'dueSalary')
        ? 'table-center highlight-column'
        : 'table-center',
    },
    {
      title: '个人承担的养老保险',
      dataIndex: 'selfPensionInsurance',
      width: 200,
      className: (selectedColumn === 'selfPensionInsurance')
        ? 'table-center highlight-column'
        : 'table-center',
    },
    {
      title: '个人承担的医疗保险',
      dataIndex: 'selfMedicalInsurance',
      width: 200,
      className: (selectedColumn === 'selfMedicalInsurance')
        ? 'table-center highlight-column'
        : 'table-center',
    },
    {
      title: '个人承担的失业保险',
      dataIndex: 'selfUnemploymentInsurance',
      width: 200,
      className: (selectedColumn === 'selfUnemploymentInsurance')
        ? 'table-center highlight-column'
        : 'table-center',
    },
    {
      title: '个人承担的公积金',
      dataIndex: 'selfAccumulationFund',
      width: 200,
      className: (selectedColumn === 'selfAccumulationFund')
        ? 'table-center highlight-column'
        : 'table-center',
    },
    {
      title: '本月应交个税',
      dataIndex: 'individualIncomeTax',
      width: 150,
      className: (selectedColumn === 'individualIncomeTax')
        ? 'table-center highlight-column'
        : 'table-center',
    },
    {
      title: '实发工资',
      dataIndex: 'realSalary',
      width: 100,
      className: (selectedColumn === 'realSalary')
        ? 'table-center highlight-column'
        : 'table-center',
    },
    {
      title: '工资卡号',
      dataIndex: 'cardNumber',
      width: 200,
      className: (selectedColumn === 'cardNumber')
        ? 'table-center highlight-column'
        : 'table-center',
    },
  ];
};
