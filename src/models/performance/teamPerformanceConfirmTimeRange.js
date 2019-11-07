/*
 * @Description: 团队绩效确认列表
 * @Author: qianqian
 * @Date: 2019-02-15 18:24:19
 * @Last Modified by: danding
 * @Last Modified time: 2019-07-10 17:23:32
 */
export default {
  namespace: 'teamPerformanceConfirmTimeRange',

  state: {
    list: [], // 列表
  },

  effects: {
    *getList({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/performance/teamPerformanceConfirmTimeRangeQuery.json', payload);
        const { timeRange, team = {} } = res;
        const list = timeRange.map(i => {
          return {
            ...i,
            teamId: team.id
          };
        });
        yield put({ type: 'updateList', payload: list || [] });
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
