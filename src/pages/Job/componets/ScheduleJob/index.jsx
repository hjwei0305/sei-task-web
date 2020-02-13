import React, { Component, } from 'react';
import { connect, } from 'dva';
import { Popconfirm, Button, } from 'antd';
import { ExtTable, ExtIcon } from 'seid';
import moment from 'moment';
import { formatMessage, FormattedMessage, } from "umi-plugin-react/locale";
import cls from 'classnames';
import { constants } from '@/utils';

const { TASK_SERVER_PATH, } = constants;

@connect(( job, ) => ({ job, }))
class ScheduleJob extends Component {

  reloadData = () => {
    this.tableRef && this.tableRef.remoteDataRefresh();
  }

  handleEvent = (scheduleType, row) => {
    const { dispatch, } = this.props;
    dispatch({
      type: 'job/scheduleJob',
      payload: {
        scheduleType,
        id: row.id,
      },
    }).then(res => {
      if (res.success) {
        this.reloadData();
      }
    });
  }

  getExtTableProps = () => {
    const columns = [
      {
        title: formatMessage({ id: "global.operation", defaultMessage: "操作" }),
        key: "operation",
        width: 150,
        align: "center",
        dataIndex: "id",
        className: "action",
        required: true,
        render: (text, record) => (
          <span className={cls("action-box")}>
            <ExtIcon
              onClick={_ => this.handleEvent('triggerJob', record)}
              type="caret-right"
              ignore='true'
              tooltip={
                { title: '立即执行' }
              }
              antd
            />
            <Popconfirm
              placement="topLeft"
              title="确定要暂停吗？"
              onConfirm={_ => this.handleEvent('pauseJob', record)}
            >
              <ExtIcon
                type="pause"
                tooltip={
                  { title: '暂停' }
                }
                antd
              />
            </Popconfirm>
            <ExtIcon
              type="fire"
              onClick={_ => this.handleEvent('resumeJob', record)}
              tooltip={
                { title: '唤醒' }
              }
              antd
            />
            <ExtIcon
              type="highlight"
              antd
              tooltip={
                { title: '更新Corn' }
              }
              onClick={_ => this.handleEvent('rescheduleJob', record)}
            />
          </span>
        )
      },
      {
        title: "作业名称",
        dataIndex: "name",
        width: 160,
        required: true,
      },
      {
        title: "作业组",
        dataIndex: "group",
        width: 160,
        required: true,
      },
      {
        title: "作业状态",
        dataIndex: "stateRemark",
        width: 100,
        required: true,
      },
      {
        title: "下一次执行时间",
        dataIndex: "nextFireTime",
        width: 200,
        required: true,
        render: (text) => (moment(text).format('YYYY-MM-DD HH:mm:ss'))
      },
      {
        title: "调度周期",
        dataIndex: "cronExpression",
        width: 220,
        required: true,
      },
      {
        title: "作业说明",
        dataIndex: "remark",
        width: 180,
        required: true,
      },
    ];

    const toolBar = {
      left: (
        <Button onClick={this.reloadData}>
          <FormattedMessage id="global.refresh" defaultMessage="刷新" />
        </Button>
      ),
    };


    return {
      toolBar,
      columns,
      bordered: false,
      store: {
        url: `${TASK_SERVER_PATH}/scheduleJob/getJobStates`,
      }
    };
  }

  render() {
    return (
      <ExtTable onTableRef={inst => this.tableRef = inst} {...this.getExtTableProps()} />
    );
  }
}

export default ScheduleJob;
