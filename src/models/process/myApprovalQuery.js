/*
 * @Description: 我的审批
 * @Author: moran 
 * @Date: 2019-09-17 17:34:50 
 * @Last Modified by: moran
 * @Last Modified time: 2019-09-29 14:44:00
 */
import {
  UPLOAD_FILE_COMPONENT_TYPE,
  UPLOAD_IMG_COMPONENT_TYPE,
  USER_COMPONENT_TYPE
} from 'constants/components/businessCommon/dragForm/index';

export default {
  namespace: 'myApprovalQuery',

  state: {
    myApprovalLists: [], // 我的审批列表
    paginator: {}, // 分页
    showProcessDetailDrawer: false,
    processFormDataList: [], // 流程form表单展示
    processNodeInstanceInfoList: [] // 审批流程list
  },

  effects: {
    // 我的审批列表
    *getMyApproval({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/process/myApprovalQuery.json', payload);
        const { pageQueryResult } = res.outputParameters;
        const { list, paginator } = pageQueryResult;
        yield put({
          type: 'setMyApprovalLists',
          payload: { list, paginator }
        });
        
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 审批详情
    *getProcessDetail({ payload }, { call, put }) {
      try {
        yield put({ type: 'displayProcessDrawer', payload: true }); 
        const res = yield call(T.get, '/process/processDetailQuery.json', payload);
        
        const { processFormDataList, processNodeInstanceInfoList } = res.outputParameters;
        // 流程表单数据转换成label，value以及需要的形式
        const needProcessFormLists = processFormDataList.map(i => {
          const { dataValues, props, type } = i;
          let imgLists = [];
          let userInfoLists = [];
          let fileDatas;
          let needValues = dataValues ? dataValues : '-'; // 需要展示数据

          // 图片url
          if (type === UPLOAD_IMG_COMPONENT_TYPE) {
            const imgValues = dataValues ? JSON.parse(dataValues) : [];
            imgLists = imgValues.map(i => {
              return `/process/imageDownload.resource?resourceId=${i}`;
            });
          }

          // 用户信息list
          if (type === USER_COMPONENT_TYPE) {
            const userValues = dataValues ? JSON.parse(dataValues) : [];
            userInfoLists = userValues.length ? [
              {
                label: '花名',
                value: userValues[0]
              },
              {
                label: '姓名',
                value: userValues[1]
              },
              {
                label: '部门',
                value: userValues[2]
              },
              {
                label: '职位',
                value: userValues[3]
              }
            ] : [];
          }

          // 附件信息
          if (type === UPLOAD_FILE_COMPONENT_TYPE) {
            fileDatas = dataValues ? JSON.parse(dataValues) : undefined;
          }
          
          const formProps = JSON.parse(props);
          const { label = "默认名称" } = formProps;
          return {
            label,
            value: needValues,
            imgLists,
            userInfoLists,
            fileDatas
          };
        });
        
        yield put({
          type: 'setProcessDetail',
          payload: { needProcessFormLists, processNodeInstanceInfoList }
        });
        
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 流程审批
    *processApprove({ payload }, { call, put, select }) {
      try {
        const { resultEnum, memo, processApproveNodeInstanceDetailId, id, statusEnum } = payload;
        const params = { resultEnum, memo, processApproveNodeInstanceDetailId };
        let paginator = yield select(state => state.myApprovalQuery.paginator);
        yield call(T.post, '/process/processApprove.json', params);
        yield put({ type: 'getProcessDetail', payload: { processInstanceId: id } });
        yield put({ type: 'getMyApproval', payload: { currentPage: paginator.page, statusEnum } });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
  },


  reducers: {
    // 我的审批列表
    setMyApprovalLists(state, { payload }) {
      const { list, paginator } = payload;
      return { ...state, myApprovalLists: list, paginator };
    },

    // 审批详情
    setProcessDetail(state, { payload }) {
      const { needProcessFormLists, processNodeInstanceInfoList } = payload;
      return { ...state, processFormDataList: needProcessFormLists, processNodeInstanceInfoList };
    },

    // 控制我的审批抽屉显示
    displayProcessDrawer(state, { payload }) {
      return { ...state, showProcessDetailDrawer: payload };
    }
  }
};
