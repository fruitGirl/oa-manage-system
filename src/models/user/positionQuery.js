/*
 * @Description: 系统-职位管理
 * @Author: qianqian
 * @Date: 2019-02-15 19:30:59
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-15 19:31:26
 */
export default {
  namespace: 'positionQuery',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      // eslint-disable-line
      yield put({ type: 'save' });
      yield call({ type: 'save' });
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },

    pictureWall(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
