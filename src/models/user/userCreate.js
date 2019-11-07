/*
 * @Description: 系统-员工创建
 * @Author: qianqian
 * @Date: 2019-02-15 18:42:09
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-15 18:42:39
 */
export default {
  namespace: 'userCreate',

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
