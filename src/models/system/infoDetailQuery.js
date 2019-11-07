export default {
  namespace: 'infoDetailQuery',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    }
  },

  effects: {

  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
