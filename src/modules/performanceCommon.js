// 初始化表单数据
const initFormData = (fieldsValue = {}) => {
  const { name = '', performanceTypeCode = 'QUARTER_PERFORMANCE', timeRange = '', keys = [1], year } = fieldsValue;
  let performanceContent = [];
  let count = 0;
  let count1 = 0;
  keys.forEach((item, index) => {
    // 描述
    let goalDescription = T.return2Br(fieldsValue[`goalDescription_${item}`] || '');
    goalDescription = goalDescription.replace(/\"/g, "“");

    // 自评
    let goalSummary = T.return2Br(fieldsValue[`goalSummary_${item}`] || '');
    goalSummary = goalSummary.replace(/\"/g, "“");

    const str = {
      id: fieldsValue[`id_${item}`],
      assessmentItem: fieldsValue[`goalName_${item}`],
      assessmentContent: goalDescription,
      selfWeight: fieldsValue[`goalWeight_${item}`],
      assessmentSummary: goalSummary,
      selfScore: fieldsValue[`selfScore_${item}`],
      superiorWeight: fieldsValue[`superiorWeight_${item}`],
      superiorScore: fieldsValue[`superiorScore_${item}`]
    };

    performanceContent.push(str);
    if (fieldsValue[`goalWeight_${item}`]) {
      count = count + parseInt(fieldsValue[`goalWeight_${item}`], 10);
      count1 = count1 + parseInt(fieldsValue[`superiorWeight_${item}`], 10);
    }
  });

  performanceContent = JSON.stringify(performanceContent);

  // 解决后端编码问题
  performanceContent = performanceContent.replace(/\\/g, "\\\\");

  return {
    params: {
      name,
      performanceTypeCode,
      timeRange,
      year,
      performanceContent
    },
    count,
    count1
  };
};

/**
 *
 * @param {number} t 结果
 * @param {*} a 乘数
 * @param {*} b 被乘数
 * @param {number} w 100%
 */
const totalScore = (t, a, b, w = 0.01) => {
  const a1 = a ? parseFloat(a) : 0;
  const b1 = b ? parseFloat(b) : 0;
  const c = T.math.floatMul(a1, b1);
  const t1 = T.math.floatAdd(t, T.math.floatMul(c, w));
  return t1 ? Number(t1.toFixed(2)) : '';
};
export default { initFormData, totalScore };
