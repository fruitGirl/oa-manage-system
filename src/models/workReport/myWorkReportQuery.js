/*
 * @Description: 我的周报月报
 * @Author: danding
 * @Date: 2019-05-16 14:27:28
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-16 21:04:52
 */

import { WEEK_REPORT } from 'constants/workReport/statusNav';

export default {
  namespace: 'myWorkReportQuery',

  state: {
    list: [],
    paginator: {},
    searchData: {},
    selectedNavKey: WEEK_REPORT, // 周报月报
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    }
  },

  effects: {
    *getList({ payload }, { call, put, select }) {
      try {
        const data = yield call(T.get, '/workReport/myWorkReportQuery.json', payload);
        const { queryResult, commentCountMap = {} } = data;
        let { workReportList = [], paginator = {} } = queryResult;
        workReportList = workReportList.map(i => {
          const commitCount = commentCountMap[i.id];
          return { ...i, commitCount };
        });
        yield put({
          type: 'updateList',
          payload: {
            list: workReportList,
            paginator,
          }
        });
        yield put({ type: 'searchData', payload });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *withdraw({ payload }, { call, put, select }) {
      try {
        yield call(T.post, '/workReport/workReportRecall.json', payload);
        const { searchData } = yield select(state => state.myWorkReportQuery);
        yield put({ type: 'getList', payload: searchData });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
  },

  reducers: {
    updateList(state, { payload }) {
      return { ...state, ...payload };
    },
    searchData(state, { payload }) {
      return { ...state, searchData: payload };
    }
  }
};
