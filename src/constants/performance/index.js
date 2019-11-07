// 绩效年度的数据
export const createPerformanceYears = (startYear = 2017) => {
  let performanceYears = [];
  const nowYear = new Date().getFullYear();
  const endYear = nowYear + 2; // 显示至当前年的后两年
  for (let i = endYear; i >= startYear; i--) {
    performanceYears.unshift(i);
  }

  performanceYears = performanceYears.map(i => {
    return {
      label: `${i}年`,
      value: i
    };
  });

  return performanceYears;
};

// 解析部门树的函数
export const parseDepartmentTreeData = (res) => {
  const { departmentSimpleList = [] } = res.outputParameters;
  return combineDepartmentData(departmentSimpleList);
};

// 重新组合部门树
function combineDepartmentData(data = []) {
  return data.map(i => {
    const { name, id, directSubDepartment = [] } = i;
    const children = combineDepartmentData(directSubDepartment);
    return {
      title: name,
      value: id,
      key: id,
      children,
    };
  });
}

// 解析公司树的函数
export const parseCompanyTreeData = (res) => {
  const { companySimpleList = [] } = res.outputParameters;
  return combineCompanyData(companySimpleList);
};

// 重新组合公司树
function combineCompanyData(data = []) {
  return data.map(i => {
    const { shortName, id, directCompany = [] } = i;
    const children = combineCompanyData(directCompany);
    return {
      title: shortName,
      value: id,
      key: id,
      children,
    };
  });
}

export const QUARTER_PERFORMANCE = 'QUARTER_PERFORMANCE'; // 季度
export const ANNUAL_PERFORMANCE = 'ANNUAL_PERFORMANCE'; // 年度

// 考核类型
export const PERFORMANCE_TYPE = [
  {
    label: '季度考核',
    value: QUARTER_PERFORMANCE
  },
  {
    label: '年度考核',
    value: ANNUAL_PERFORMANCE
  }
];

// 季度枚举
export const PERFORMANCE_RANGE = [
  {
    label: '第一季度',
    value: '第一季度'
  },
  {
    label: '第二季度',
    value: '第二季度'
  },
  {
    label: '第三季度',
    value: '第三季度'
  },
  {
    label: '第四季度',
    value: '第四季度'
  },
];

