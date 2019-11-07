/*
 * @Description: 周报-主管模板
 * @Author: danding
 * @Date: 2019-05-15 19:22:20
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-30 11:19:38
 */

 import cloneDeep from 'lodash.clonedeep';
 import { delay } from 'dva/saga';

 const { message } = window.antd;

// 初始化三条空白行
const INIT_NEXT_LIST = [
  { key: "next_week_key_1" },
  { key: "next_week_key_2" },
  { key: "next_week_key_3" }
];

export default {
  namespace: 'weekReportForManageEdit',

  state: {
    nextWeekList: INIT_NEXT_LIST, // 下周工作要点列表
    projectAnalyse: {}, // 项目复盘
    teamThinking: {}, // 团队思考
    projectPlan: {}, // 项目计划
    fileList: [], // 图片列表
  },

  effects: {
    *saveCurrentItem({ payload }, { call, put, select }) {
      try {
        let { content = '' } = payload;
        content = content && T.return2Br(content);
        const data = yield call(T.post, '/workReport/workReportNowContentTimeSave.json', { ...payload, content });

        // 更新id值（新增）
        let { id, supplyId, moduleCode } = payload;
        const { operateResult } = data || {};
        id = id || (operateResult && operateResult.id);
        supplyId = supplyId || (operateResult && operateResult.supplyId);

        if (moduleCode === 'PROJECT_ANALYSE') { // 项目复盘
          yield put({
            type: 'updateProjectAnalyse',
            payload: { ...payload, id, supplyId, }
          });
        } else if (moduleCode === 'TEAM_THINKING') { // 团队思考
          yield put({
            type: 'updateTeamThinking',
            payload: { ...payload, id, supplyId }
          });
        }
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *savePlan({ payload }, { call, put, select }) {
      try {
        let { content = '' } = payload;
        content = content && T.return2Br(content);
        const data = yield call(T.post, '/workReport/workReportNextContentTimeSave.json', { ...payload, content });

        // 更新id值（新增）
        let { id, supplyId } = payload;
        const { operateResult } = data || {};
        id = id || (operateResult && operateResult.id);
        supplyId = supplyId || (operateResult && operateResult.supplyId);
        yield put({
          type: 'updateProjectPlan',
          payload: { ...payload, id, supplyId }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *deleteNextItem({ payload }, { call, put, select }) {
      try {
        // 删除意义行数据
        if (payload.contentId) {
          yield call(T.post, '/workReport/workReportContentDelete.json', payload);
        }

         // 删除行，更新列表
         let { nextWeekList } = yield select(state => state.weekReportForManageEdit);
         nextWeekList = cloneDeep(nextWeekList);
         const matchIdx = nextWeekList.findIndex(i => i.key === payload.key);
         nextWeekList.splice(matchIdx, 1);

         yield put({
            type: 'updateNextList',
            payload: nextWeekList
         });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *saveNextItem({ payload }, { call, put, select }) {
      try {
        let { content = '' } = payload;
        content = content && T.return2Br(content);
        const data = yield call(T.post, '/workReport/workReportNextContentTimeSave.json', { ...payload, content });

        // 更新id值（新增）
        let { id, supplyId, } = payload;
        const { operateResult } = data || {};
        id = id || (operateResult && operateResult.id);
        supplyId = supplyId || (operateResult && operateResult.supplyId);

        // 更新列表
        let { nextWeekList } = yield select(state => state.weekReportForManageEdit);
        nextWeekList = cloneDeep(nextWeekList);
        const matchIdx = nextWeekList.findIndex(i => i.key === payload.key);
        nextWeekList[matchIdx] = { ...payload, id, supplyId };

        yield put({
          type: 'updateNextList',
          payload: nextWeekList
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *deleteImg({ payload }, { call, put, select }) {
      try {
        let id;
        const { file } = payload;
        if (file.id) {
          id = file.id;
        } else if (file.response
          && file.response.operateResult
          && file.response.operateResult.id
        ) {
          id = file.response.operateResult.id;
        }

        yield call(T.post, '/workReport/workReportImageDelete.json', { id });
        let { fileList } = yield select(state => state.weekReportForManageEdit);
        const newFileList = cloneDeep(fileList);
        newFileList.splice(payload.index, 1);
        yield put({
          type: 'updateFileList',
          payload: newFileList
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *submitPage({ payload }, { call, select, }) {
      try {
        const { nextWeekList } = yield select(state => state.weekReportForManageEdit);
        const hasNextList = nextWeekList.some(i => i.id);
        if (!hasNextList) {
          message.warn('请填写执行要点');
          return;
        }

        yield call(T.post, '/workReport/workReportSubmit.json', payload);
        message.success("提交成功");
        yield delay(500);
        T.tool.redirectTo('/workReport/myWorkReportQuery.htm');
      } catch (err) {
        T.showErrorMessage(err);
      }
    }
  },

  reducers: {
    updateProjectAnalyse(state, { payload }) {
      return { ...state, projectAnalyse: payload };
    },
    updateTeamThinking(state, { payload }) {
      return { ...state, teamThinking: payload };
    },
    updateProjectPlan(state, { payload }) {
      return { ...state, projectPlan: payload };
    },
    addNextItem(state) {
      const nextWeekList = cloneDeep(state.nextWeekList);
      nextWeekList.push({
        key: `next_week_key_${Date.now()}`
      });
      return { ...state, nextWeekList };
    },
    updateNextList(state, { payload }) {
      return { ...state, nextWeekList: payload };
    },
    updateFileList(state, { payload }) {
      return { ...state, fileList: payload };
    },
    initList(state, { payload }) {
      let { currentWeekList, nextWeekList, imgList } = payload;
      nextWeekList = nextWeekList.map((i, idx) => {
        return {
          ...i,
          key: `next_week_key_${idx}`
        };
      });

      let projectAnalyse = {};
      let teamThinking = {};
      let projectPlan = {};
      let fileList = [];

      // 重组数据
      currentWeekList.forEach(i => {
        const { moduleCode, content = '' } = i;
        switch (moduleCode) {
          case 'PROJECT_ANALYSE': { // 项目复盘
            projectAnalyse = i;
            projectAnalyse.content = T.return2n(T.escape2Html(content));
            break;
          }
          case 'TEAM_THINKING': { // 团队思考
            teamThinking = i;
            teamThinking.content = T.return2n(T.escape2Html(content));
            break;
          }
          default:
            break;
        }
      });

      nextWeekList.forEach(i => {
        const { moduleCode, content = '' } = i;
        switch (moduleCode) {
          case 'PROJECT_PLAN': { // 项目计划
            projectPlan = i;
            projectPlan.content = T.return2n(T.escape2Html(content));
            break;
          }
          default:
            break;
        }
      });

      // 执行要点
      nextWeekList = nextWeekList.filter(i => {
        return i.moduleCode === 'EXECUTE_POINT';
      });
      nextWeekList = nextWeekList.map(i => {
        const { content = '' } = i;
        return {
          ...i,
          content: T.return2n(T.escape2Html(content))
        };
      });

      // 转换用户id类型为 string（解决无法回显问题）
      nextWeekList = nextWeekList.map(i => {
        let { userIds } = i;
        userIds = userIds.map(j => String(j));
        return {
          ...i,
          userIds
        };
      });
      nextWeekList = nextWeekList.length
        ? nextWeekList
        : INIT_NEXT_LIST;

      // 初始化图片列表
      fileList = imgList.map(i => {
        const { id, resourceId } = i;
        return {
          ...i,
          uid: id,
          status: 'done',
          type: "image",
          url: `${window.location.origin}/workReport/workReportImage.resource?resourceId=${resourceId}`,
        };
      });

      return { ...state, nextWeekList, projectAnalyse, teamThinking, projectPlan, fileList };
    }
  }
};
