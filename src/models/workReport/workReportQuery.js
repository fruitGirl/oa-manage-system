/*
 * @Description: 周报月报查询
 * @Author: danding
 * @Date: 2019-05-14 16:58:59
 * @Last Modified by: juyang
 * @Last Modified time: 2019-05-22 15:27:17
 */

import { WEEK_REPORT } from 'constants/workReport/statusNav';

export default {
  namespace: 'workReportQuery',

  state: {
    list: [],
    selectedNavKey: WEEK_REPORT,
    pagination: {},
    isLoadingData: false,
    isSearched: false, // 是否操作过检索
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    }
  },

  effects: {
    *getList({ payload }, { call, put }) {

      yield put({ type: 'changeLoadingStatus', payload: {
        isLoadingData: true
      }});

      try {
        const data = yield call(T.get, '/workReport/workReportPageQuery.json', payload);

        const { canNotSeeUserIds, deptIdsCompanyNameAndDeptNameMap, queryResult, userIdAndLoginNameMap, userIdsDeptIdMap, commentCountMap = {} } = data;

        /** 格式化为表格数据 */
        const workReportData = [];
        const pagination = {};

        /** 有可能以上的数据是没有的 */
        if(canNotSeeUserIds !== undefined){

          const {paginator, workReportList} = queryResult;
          pagination.current = paginator.page;
          pagination.pageSize = paginator.itemsPerPage;
          pagination.total = paginator.items;

          for(let i = 0, l = workReportList.length; i < l ; i++){
            let item = workReportList[i];

            let newItem = Object.create(null);

            let itemId = item['id'];
            let userId = item['userId'];

            newItem['id'] = itemId;
            newItem['key'] = itemId;
            newItem['data'] = '第' + (item['reportTime'].split('-')[1]) + '周 ' + item['gmtStart'].substr(0, 10) + '/' + item['gmtEnd'].substr(0, 10);
            newItem['nickName'] = userIdAndLoginNameMap[userId];
            newItem['deptName'] = deptIdsCompanyNameAndDeptNameMap[userIdsDeptIdMap[userId]];
            newItem['submitTime'] = item['gmtSubmit'];
            newItem['status'] = item['status']['message'];
            newItem['canView'] = canNotSeeUserIds.indexOf(userId) === -1;
            newItem['commitCount'] = commentCountMap[item.id];

            workReportData.push(newItem);

          }

        }

        /** 分页 */
        yield put({ type: 'updateList', payload: {
          workReportData,
          pagination
        }});
        yield put({ type: 'isSearched' });

      } catch (err) {
        T.showErrorMessage(err);
      }finally{
        yield put({ type: 'changeLoadingStatus', payload: {
          isLoadingData: false
        }});
      }



    },
    // *remind({ payload }, { call, put }) {
    //   try {
    //     const data = yield call(T.post, '', payload)

    //   } catch (err) {
    //     T.showErrorMessage(err)
    //   }
    // },
  },

  reducers: {
    isSearched(state) {
      return { ...state, isSearched: true };
    },
    updateList(state, { payload }) {
      return { ...state, ...payload };
    },
    changeNav(state, { payload }) {
      return { ...state, selectedNavKey: payload, isSearched: false };
    },
    changeLoadingStatus(state, { payload }){
      return { ...state, ...payload };
    }
  }
};
