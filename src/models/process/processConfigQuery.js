/*
 * @Description: 流程管理
 * @Author: danding
 * @Date: 2019-09-10 12:33:08
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-27 16:38:22
 */
const { message } = window.antd;

export default {
  namespace: 'processConfigQuery',

  state: {
    showClassifMsgModal: false, // 显示分类弹窗
    editingClassifMsg: {}, // 正在编辑的分类信息
    showClassifSortModal: false, // 显示分类排序弹窗
    classifsMsg: [], // 当前的分类集合
    classificList: [], // 分类列表
    dragingClassifiId: '', // 正在排序审批的分类模块ID
    showProcessMoveModal: false, // 显示审批
    movingProcessMsg: {}, // 正在移动的审批信息
    curSortClassifiId: '', // 当前正在排序的分类id
  },

  effects: {
    // 获取分类集合
    *getClassifsMsg({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/process/processConfigQuery.json', payload);
        const { processTypeInfos } = res.outputParameters;
        yield put({
          type: 'setClassifsMsg',
          payload: processTypeInfos
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 保存分类名称
    *saveClassifMsg({ payload }, { call, put }) {
      try {
        const { id } = payload;
        const url = id
          ? '/process/processTypeRename.json'
          : '/process/processTypeCreate.json';
        yield call(T.post, url, payload);
        message.success(id ? '重命名成功' : '新增成功');
        yield put({
          type: 'displayClassifMsgModal',
          payload: false
        });

        // 刷新列表
        yield put({
          type: 'getClassifsMsg',
          payload: {}
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 保存分类排序
    *saveClassifSort({ payload }, { call, put }) {
      try {
        yield call(T.post, '/process/processTypeReSort.json', payload);
        yield put({
          type: 'displayClassifSortModal',
          payload: false
        });
        message.success('排序成功');

        // 刷新列表
        yield put({
          type: 'getClassifsMsg',
          payload: {}
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 移动到
    *saveProcessMove({ payload }, { call, put }) {
      try {
        yield call(T.post, '/process/processConfigChangeType.json', payload);
        yield put({
          type: 'showProcessMoveModal',
          payload: false
        });
        message.success('移动成功');

        // 刷新列表
        yield put({
          type: 'getClassifsMsg',
          payload: {}
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 删除分类
    *removeClassification({ payload }, { call, put }) {
      try {
        yield call(T.post, '/process/processTypeDelete.json', payload);
        message.success('删除成功');

        // 刷新列表
        yield put({
          type: 'getClassifsMsg',
          payload: {}
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 停用启用
    *handleUseStatus({ payload }, { put, call }) {
      try {
        yield call(T.post, '/process/processConfigSetStatus.json', payload);
        message.success('操作成功');

        // 刷新列表
        yield put({
          type: 'getClassifsMsg',
          payload: {}
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 流程排序
    *sortProcessItem({ payload }, { put, call }) {
      try {
        yield call(T.post, '/process/processConfigChangeOrderInType.json', payload);
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
  },

  reducers: {
    // 设置分类集合
    setClassifsMsg(state, { payload }) {
      return { ...state, classifsMsg: payload };
    },

    // 设置分类信息弹窗显示与隐藏
    displayClassifMsgModal(state, { payload }) {
      let { editingClassifMsg } = state;

      // 弹窗隐藏，数据清空
      editingClassifMsg = payload ? editingClassifMsg : {};
      return {
        ...state,
        showClassifMsgModal: payload,
        editingClassifMsg
      };
    },

    // 设置当前编辑的分类信息
    setClassifMsg(state, { payload }) {
      return {
        ...state,
        editingClassifMsg: payload
      };
    },

    // 设置分类排序弹窗显示与隐藏
    displayClassifSortModal(state, { payload }) {
      return {
        ...state,
        showClassifSortModal: payload,
      };
    },

    // 设置审批移动弹窗显示与隐藏
    displayProcessMoveModal(state, { payload }) {
      return { ...state, showProcessMoveModal: payload };
    },

    // 设置当前移动的审批信息
    setMoveProcessData(state, { payload }) {
      return { ...state, movingProcessMsg: payload };
    },

    // 设置当前正在排序的分类id
    setCurSortClassifiId(state, { payload }) {
      return { ...state, curSortClassifiId: payload };
    }
  }
};
