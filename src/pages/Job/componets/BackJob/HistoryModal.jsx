import React, { PureComponent } from "react";
import { Button, Tooltip, Tag, } from "antd";
import { FormattedMessage, } from "umi-plugin-react/locale";
import { ExtModal, ExtTable, } from 'seid';
import moment from 'moment';
import { constants } from '@/utils';

const { TASK_SERVER_PATH, } = constants;

class HistoryModal extends PureComponent {

  reloadData = () => {
    this.tableRef && this.tableRef.remoteDataRefresh();
  }

  getExtableProps = () => {
    const { editData, } = this.props;
    const columns = [
      {
        title: '开始时间',
        dataIndex: 'startTime',
        width: 180,
        render: (text) => (moment(text).format('YYYY-MM-DD HH:mm:ss')),
      },
      {
        title: '耗时',
        dataIndex: 'elapsed',
        width: 80,
        render(text) {
          return <div style={{textAlign: "right"}}>{text}</div>
        }
      },
      {
        title: '执行成功',
        width: 80,
        dataIndex: 'successful',
        render: (text) => (
          <Tag color={text ? 'green' : 'red' }>{text? '是' : '否'}</Tag>
        )
      },
      {
        title: '执行消息',
        dataIndex: 'message'
      },
      {
        title: '异常消息',
        dataIndex: 'exceptionMessage',
        width: 220,
        render: (text) => (
          <Tooltip title={text}>
            <a href="">{text}</a>
          </Tooltip>
        )
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
      remotePaging: true,
      searchProperties: ['message', 'exceptionMessage'],
      store: {
        type: 'POST',
        url: `${TASK_SERVER_PATH}/jobHistory/findByPage`,
        params: {
          filters: [{
            fieldName: "job.id",
            value: editData && editData.id,
            operator: "EQ",
            fieldType: "String",
          }],
        },
      }
    };
  }

  render() {
    const { editData, onClose, visible } = this.props;
    const title = `查看任务【${editData.name}】的执行历史`;

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        maskClosable={false}
        title={title}
        width={750}
        footer={null}
      >
        <ExtTable onTableRef={inst => this.tableRef = inst} {...this.getExtableProps()}/>
      </ExtModal>
    );
  }
}

export default HistoryModal;
