import React from 'react';
import { connect, } from 'dva';
import { Tabs, } from 'antd';
import { PageWrapper, } from '@/components';
import BackJob from './componets/BackJob';
import cls from 'classnames';
import ScheduleJob from './componets/ScheduleJob';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ job, loading,}) => ({ job, loading, }))
class Job extends React.PureComponent {

  render() {
    const { loading, } = this.props;

    return (
      <PageWrapper className={cls(styles['container-box'])} loading={loading.global}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="作业配置" key="1">
            <BackJob />
          </TabPane>
          <TabPane tab="作业监控" key="2">
            <ScheduleJob />
          </TabPane>
        </Tabs>
      </PageWrapper>
    );
  }
}

export default Job;
