export default {
  namespace: 'monthReportCreate',

  state: {},

  effects: {
    *fetch({ payload }, { call, put }) {
      // eslint-disable-line
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
