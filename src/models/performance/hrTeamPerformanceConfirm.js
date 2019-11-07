/*
 * @Description: 人事绩效管理详情
 * @Author: danding
 * @Date: 2019-07-09 14:52:17
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-12 17:21:57
 */
const { message } = window.antd;

export default {
  namespace: 'hrTeamPerformanceConfirm',

  state: {
    teamPerformanceList: [], // 团队绩效数据
    history: [], // 历史记录
    showRefuseModal: false, // 显示打回原因填写弹窗
    showHistoryListModal: false, // 显示历史记录弹框
    showConfirmModal: false, // 显示确认绩效弹框
  },

  effects: {
    // 获取团队的绩效信息
    *getTeamPerformanceInfo({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/performance/hrPerformanceConfirmDetail.json', payload);
        const { confirmDetails = [] } = res;
        yield put({ type: 'setTeamPerformanceInfo', payload: confirmDetails });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 每个团队的操作日志
    *getHistory({ payload }, { call, put }) {
      try {
        yield put({ type: 'displayHistoryListModal', payload: true });
        const { timeRange, performanceTypeCode, year } = T.tool.getSearchParams();
        const annualPerformance = 'ANNUAL_PERFORMANCE'; // 年度考核
        let needPropValue = timeRange;
        if (performanceTypeCode === annualPerformance) {
          needPropValue = timeRange;
        } else {
          needPropValue = `${year}_${timeRange}`;
        }
        const res = yield call(T.get, '/user/teamPerformanceOperateLogQuery.json', {
          operateObjectType: 'PERFORMANCE',
          prop: 'TIME_RANGE',
          propValue: needPropValue,
          ...payload
        });
        const { teamOperateLogList = [] } = res.outputParameters;
        yield put({ type: 'setHistory', payload: teamOperateLogList });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 打回
    *refuse({ payload }, { call, put }) {
      try {
        yield call(T.post, '/performance/hrPerformanceRefuse.json', payload);
        message.success('打回成功');
        yield put({ type: 'displayRefuseModal', payload: false });
        const { timeRange, performanceTypeCode, year } = T.tool.getSearchParams();
        yield put({
          type: 'getTeamPerformanceInfo',
          payload: {
            year,
            timeRange,
            performanceAssessmentTypeCode: performanceTypeCode
          }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 确认绩效
    *confirm({ payload }, { call, put }) {
      try {
        yield call(T.post, '/performance/hrPerformanceConfirm.json', payload);
        message.success('确认成功');
        const { timeRange, performanceTypeCode, year } = T.tool.getSearchParams();
        yield put({
          type: 'getTeamPerformanceInfo',
          payload: {
            year,
            timeRange,
            performanceAssessmentTypeCode: performanceTypeCode
          }
        });
        yield put({ type: 'displayConfirmModal', payload: false });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
  },

  reducers: {
    // 存储团队绩效信息
    setTeamPerformanceInfo(state, { payload }) {
      return { ...state, teamPerformanceList: payload };
    },
    setHistory(state, { payload }) {
      return { ...state, history: payload };
    },

    // 控制打回弹窗显示
    displayRefuseModal(state, { payload }) {
      return { ...state, showRefuseModal: payload };
    },

    // 控制历史记录弹窗显示
    displayHistoryListModal(state, { payload }) {
      return { ...state, showHistoryListModal: payload };
    },

    // 控制确认绩效弹框显示
    displayConfirmModal(state, { payload }) {
      return { ...state, showConfirmModal: payload };
    },
  }
};
