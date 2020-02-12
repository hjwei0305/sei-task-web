import React, { PureComponent } from "react";
import { Dropdown, Button, Menu } from "antd";
import { FormattedMessage, } from "umi-plugin-react/locale";
import { ExtModal, ExtTable, } from 'seid';
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
        width: 160
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
        render: (text, record, index) => (
          <div style={{textAlign: "center"}}>
            <input type="checkbox" checked={record.successful} disabled={true}/>
          </div>
        )
      },
      {
        title: '执行消息',
        dataIndex: 'message'
      },
      {
        title: '异常消息',
        dataIndex: 'exceptionMessage',
        width: 160,
        render: (text) => (
          <Dropdown
            overlayStyle={{width: 300}}
            overlay={
              <Menu>
                <Menu.Item>
                  <div  style={{whiteSpace:"normal",wordBreak:"break-all"}}>{text}</div>
                </Menu.Item>
              </Menu>
            }
          >
            {text}
          </Dropdown>
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
