const { message } = window.antd;

export default {
  namespace: 'infoCreate',

  state: {
    columnData: [], // 栏目数据
    showPreview: false, // 是否显示预览
    previewData: {}, // 预览数据
    formData: {}
  },

  effects: {
    *submit({ payload }, { call, put }) {
      try {
        const url = payload.id ? 'infoModify' : 'infoCreate';
        yield call(T.post, `/system/${url}.json`, payload);
        message.success('保存成功');
        window.history.back();
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *getColumnTree({ payload }, { call, put }) {
      try {
        const data = yield call(T.get, '/system/infoTreeQuery.json');
        const { channelList = [] } = data;
        const columnData = channelList.map(i => {
          return {
            label: i.title,
            value: i.id
          };
        });
        yield put({ type: 'columnData', payload: columnData });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *removeImg({ payload }, { call, put }) {
      try {
        yield call(T.post, '/system/infoImageDelete.json', payload);
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *removeFile({ payload }, { call, put }) {
      try {
        yield call(T.post, '/system/infoFileDelete.json', payload);
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
  },

  reducers: {
    columnData(state, { payload }) {
      return { ...state, columnData: payload };
    },
    showPreview(state, { payload }) {
      const { nickName, title, content, attachmentFileNames } = payload;
      const params = {
        publishTime: T.date.format(new Date()),
        creater: nickName,
        title,
        content,
        files: attachmentFileNames
      };
      return { ...state, showPreview: true, previewData: params };
    },
    hidePreview(state, { payload }) {
      return { ...state, showPreview: false };
    },
  }
};
