/*
 * @Description: 周报月报统计
 * @Author: danding
 * @Date: 2019-05-14 16:59:13
 * @Last Modified by: juyang
 * @Last Modified time: 2019-05-22 18:29:50
 */

import { WEEK_REPORT } from 'constants/workReport/statusNav';

export default {
  namespace: 'workReportStatisticQuery',

  state: {
    departmentTreeData: [],
    departmentName: '',
    selectedNavKey: WEEK_REPORT,
    myUnSbmitReport: {},
    needSubDepartment: true
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    }
  },

  reducers: {
    changeNav(state, { payload }) {
      return { ...state, selectedNavKey: payload };
    },

    changeGetState(state, {payload}){

      return {...state, ...payload};

    },

    getUserDepartmentTree(state, {payload}){

      return {...state, ...payload};
    },

    updateList(state, {payload}){
      return {...state, ...payload};
    }
  },

  effects: {
    // *getDepartmentInfo({ payload }, { call, put }) {

    //   const data = yield call(T.get, '/workReport/workReportStatisticQuery.json', param);
    // },

    *getInfo({ payload }, { call, put }) {

      /** 过滤 isSelfDepartment， departmentName */
      const {isSelfDepartment, ...param} = payload;
      const {departmentId, reportTime,needSubDepartment } = param;

      try {

        /** 清空 */
        yield put({ type: 'updateList', payload: {
          submitList: [],
          unSubmitList: []
        }});

        yield put({type: 'changeGetState', payload: {
          /** 正在请求数据 */
          isGetingInfo: isSelfDepartment ? false : true,
          isGetingSelfDepartmentInfo: isSelfDepartment ? true : false,
          isSelfDepartment: isSelfDepartment,
          departmentId: departmentId,
          reportTime: reportTime,
          needSubDepartment: needSubDepartment,
          /** 已经获得数据 */
          isGotInfo: false
        }});

        const data = yield call(T.get, '/workReport/workReportStatisticQuery.json', param);

        const {userIdAndLoginNameMap,canNotSeeUserIds, workReportByOnlineUser, workReportSubmitList, workReportUnSubmitList, deptIdsCompanyNameAndDeptNameMap } = data;

        const nameMap = userIdAndLoginNameMap;
        const submitList = [];
        const unSubmitList = [];
        const departmentName = deptIdsCompanyNameAndDeptNameMap[departmentId] || '';

        /** 已经提交 */
        workReportSubmitList.forEach((item) => {

          submitList.push({
            id: item.id,
            userId: item.userId,
            userName: nameMap[item.userId],
            canView: canNotSeeUserIds.indexOf(item.userId) === -1
          });

        });

        /** 未提交 */
        workReportUnSubmitList.forEach((item) => {

          unSubmitList.push({
            id: item.id,
            userId: item.userId,
            userName: nameMap[item.userId],
            canView: canNotSeeUserIds.indexOf(item.userId) === -1
          });

        });

        /** 自己是否有保存未提交的 */
        const myUnSbmitReport = {};

        if(workReportByOnlineUser && workReportByOnlineUser.status.name !== 'SUBMITTED'){
          myUnSbmitReport['id'] = workReportByOnlineUser['id'];
        }

        yield put({ type: 'updateList', payload: {
          submitList,
          unSubmitList,
          myUnSbmitReport
        }});

        yield put({type: 'changeGetState', payload: {
          departmentName: departmentName
        }});

      } catch (err) {

        T.showErrorMessage(err);

      } finally {

        yield put({type: 'changeGetState', payload: {
          /** 正在请求数据 */
          isGetingInfo: false,
          isGetingSelfDepartmentInfo: false,
          isGotInfo:true
        }});

      }

    }
  }
};
