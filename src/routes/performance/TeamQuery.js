/*
 * @Description: 团队配置
 * @Author: danding
 * @Date: 2019-07-09 10:16:56
 * @Last Modified by: danding
 * @Last Modified time: 2019-07-09 10:59:15
 */

import { PureComponent } from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import TeamTable from 'components/performance/teamQuery/TeamTable';
import EditTeamModal from 'components/performance/teamQuery/EditTeamModal';

class TeamQuery extends PureComponent {
  componentDidMount() {
    this.getList();
  }

  getList = () => {
    this.props.dispatch({
      type: 'teamQuery/getList',
      payload: { currentPage: 1, }
    });
  }

  render() {
    return (
      <BasicLayout>
        <TeamTable />
        <EditTeamModal />
      </BasicLayout>
    );
  }
}

export default connect(({ teamQuery }) => ({ ...teamQuery }))(TeamQuery);
