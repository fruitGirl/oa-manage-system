/*
 * @Description: hr绩效确认列表
 * @Author: qianqian
 * @Date: 2019-02-15 18:24:19
 * @Last Modified by: danding
 * @Last Modified time: 2019-07-10 18:41:50
 */
export default {
  namespace: 'hrTeamPerformanceConfirmTimeRange',

  state: {
    list: [], // 列表
  },

  effects: {
    *getList({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/performance/hrPerformanceConfirmTimeRangeQuery.json', payload);
        const { timeRange, } = res;
        yield put({ type: 'updateList', payload: timeRange || [] });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
  },

  reducers: {
    updateList(state, { payload }) {
      return { ...state, list: payload };
    },
  }
};
