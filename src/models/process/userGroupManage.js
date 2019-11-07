/*
 * @Description: 人员分类
 * @Author: moran
 * @Date: 2019-09-10 12:21:13
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-09 15:38:37
 */
import { ALL_USER_URL } from 'constants/common';

const { message } = window.antd;

export default {
  namespace: 'userGroupManage',

  state: {
    groupInfoList: [], // 公司部门树
    userGroupInfoList: [], // 用户组信息list
    paginator: {},
    userList: [], // 通过标签查询的list
    personLists: [], // 所有用户list
    showAddPersonModal: false // 添加人员弹框显示
  },

  effects: {
    // 公司部门树
    *getDepartMentTrees({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/process/groupInfoQuery.json');
        const { groupInfoList } = res.outputParameters;
        yield put({
          type: 'companyDepartmentTree',
          payload: groupInfoList
        });

      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 组信息创建
    *createGroupInfo({ payload }, { call, put }) {
      try {
        yield call(T.post, '/process/groupInfoCreate.json', payload);
        yield put({ type: 'getDepartMentTrees' });
        message.success('创建成功');
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 组信息删除
    *deleteGroupInfo({ payload }, { call, put }) {
      try {
        yield call(T.post, '/process/groupInfoDelete.json', payload);
        yield put({ type: 'getDepartMentTrees' });
        message.success('删除成功');
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 组信息编辑
    *modifyGroupInfo({ payload }, { call, put }) {
      try {
        yield call(T.post, '/process/groupInfoModify.json', payload);
        yield put({ type: 'getDepartMentTrees' });
        message.success('编辑成功');
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 组信息拖拽
    *reSortGroupInfo({ payload }, { call, put }) {
      try {
        yield call(T.post, '/process/groupInfoReSort.json', payload);
        yield put({ type: 'getDepartMentTrees' });
        message.success('拖拽成功');
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 用户组信息关联分页查询
    *getUserGroupInfoList({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/process/userGroupInfoLinkPageQuery.json', payload);
        const { pageQueryResult } = res.outputParameters;
        const { list, paginator } = pageQueryResult;
        yield put({
          type: 'setUserGroupInfoList',
          payload: { list, paginator }
        });

      } catch (err) {
        T.showErrorMessage(err);
      }
    },

     // 批量移除组内人员
     *removeUserGroup({ payload }, { call, put }) {
      try {
        const { userIds, groupId, searchObj } = payload;
        yield call(T.post, '/process/userGroupLinkMove.json', { userIds, groupId });
        yield put({ type: 'getUserGroupInfoList', payload: searchObj });
        yield put({ type: 'getDepartMentTrees' });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 通过标签员工组信息关联查询
    *getUserGroupInfoLink({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/process/userGroupInfoLinkQuery.json', payload);
        const { userList } = res.outputParameters;
        yield put({
          type: 'setUserGroupInfoLink',
          payload: { userList }
        });

      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 所有用户有效信息
    *getAllEnabledUserBaseInfo({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, ALL_USER_URL);
        const { userList } = res.outputParameters;
        yield put({
          type: 'setAllEnabledUserBaseInfo',
          payload: { userList }
        });

      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 添加人员
    *addUserInfo({ payload }, { call, put }) {
      try {
        const { userIds, groupId, searchObj } = payload;
        yield call(T.post, '/process/userGroupLinkCreate.json', { userIds, groupId });
        yield put({ type: 'getUserGroupInfoList', payload: searchObj });
        yield put({ type: 'getDepartMentTrees' });
        yield put({ type: 'displayAddPersonModal', payload: false });
      } catch (err) {
        T.showErrorMessage(err);
      }
    }

  },

  reducers: {
    // 公司部门树
    companyDepartmentTree(state, { payload }) {
      return { ...state, groupInfoList: payload };
    },

    // 用户组信息关联列表
    setUserGroupInfoList(state, { payload }) {
      const { list, paginator } = payload;
      return { ...state, userGroupInfoList: list, paginator };
    },

    // 通过标签员工组信息关联查询列表
    setUserGroupInfoLink(state, { payload }) {
      const { userList } = payload;
      return { ...state, userList };
    },

    // 所有用户有效信息
    setAllEnabledUserBaseInfo(state, { payload }) {
      const { userList } = payload;
      return { ...state, personLists: userList };
    },

    // 添加人员弹窗显示
    displayAddPersonModal(state, { payload }) {
      return { ...state, showAddPersonModal: payload };
    },

  }
};
