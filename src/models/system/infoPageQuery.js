export default {
  namespace: 'infoPageQuery',

  state: {
    list: [],
    paginator: {}
  },

  effects: {
    *getList({ payload }, { call, put }) {
      // eslint-disable-line
      try {
        const data = yield call(T.post, '/system/infoPageQuery.json', payload);
        const { list, paginator } = data.result;
        yield put({
          type: 'updateList',
          payload: { list, paginator }
        });
      } catch(err) {
        T.showErrorMessage(err);
      }
    }
  },

  reducers: {
    updateList(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
