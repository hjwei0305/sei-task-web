import React, { Fragment, Component, } from 'react';
import { connect, } from 'dva';
import { Popconfirm, Tag, Button, } from 'antd';
import { ExtTable, ExtIcon } from 'seid';
import { formatMessage, FormattedMessage, } from "umi-plugin-react/locale";
import cls from 'classnames';
import EditModal from './EditModal';
import HistoryModal from './HistoryModal';
import { constants } from '@/utils';

const { TASK_SERVER_PATH, } = constants;

@connect(({job, loading, }) => ({ job, loading, }))
class BackJob extends Component {

  state = {
    editVisiable: false,
    editData: null,
    historyVisible: false,
  }

  reloadData = () => {
    this.tableRef && this.tableRef.remoteDataRefresh();
  }

  save = (params) => {
    const { dispatch, } = this.props;
    dispatch({
      type: 'job/saveJob',
      payload: {
        ...params,
      },
    }).then(res => {
      this.setState({
        editVisiable: false,
      }, () => {
        this.reloadData();
      });
    });
  }

  handleEvent = (type, row) => {
    const { dispatch, } = this.props;

    switch(type) {
      case 'add':
      case 'edit':
        this.setState({
          editData: row,
          editVisiable: true,
        });
        break;
      case 'del':
        dispatch({
          type: 'job/delJob',
          payload: row.id,
        });
        break;
      case 'history':
        this.setState({
          editData: row,
          historyVisible: true,
        });
        break;
      case 'append':
        dispatch({
          type: 'job/addJob',
          payload: row,
        });
        break;
      default:
        break;
    }
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
              className="edit"
              onClick={_ => this.handleEvent('edit', record)}
              type="edit"
              ignore='true'
              antd
            />
            <Popconfirm
              placement="topLeft"
              title={formatMessage({ id: "global.delete.confirm", defaultMessage: "确定要删除吗？提示：删除后不可恢复" })}
              onConfirm={_ => this.handleEvent('del', record)}
            >
              <ExtIcon className="del" type="delete" antd />
            </Popconfirm>
            <ExtIcon
              onClick={_ => this.handleEvent('history', record)}
              className="history"
              type="history"
              antd
            />
            <ExtIcon
              onClick={_ => this.handleEvent('append', record)}
              className="plus"
              type="plus"
              antd
            />
          </span>
        )
      },
      {
        title: "作业名称",
        dataIndex: "name",
        width: 180,
        required: true,
      },
      {
        title: "应用模块名称",
        dataIndex: "appModuleName",
        width: 180,
        required: true,
      },
      {
        title: "Cron表达式",
        dataIndex: "cronExp",
        width: 220,
        required: true,
      },
      {
        title: "作业说明",
        dataIndex: "remark",
        width: 180,
        required: true,
      },
      {
        title: "禁用",
        dataIndex: "disable",
        width: 80,
        required: true,
        render: (text) => {
          return <Tag color={text ? 'red' : 'green' }>{text? '是' : '否'}</Tag>
        }
      },
      {
        title: "过期",
        dataIndex: "expired",
        width: 80,
        required: true,
        render: (text) => {
          return <Tag color={text ? 'red' : 'green' }>{text? '是' : '否'}</Tag>
        }
      },
    ];

    const toolBar = {
      left: (
        <Fragment>
          <Button
            type="primary"
            onClick={_ => this.handleEvent('add') }
            ignore='true'
          >
            <FormattedMessage id="global.add" defaultMessage="新建" />
          </Button>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </Fragment>
      ),
    };


    return {
      toolBar,
      columns,
      bordered: false,
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${TASK_SERVER_PATH}/job/findByPage`,
      }
    };
  }

  getEditModalProps = () => {
    const { loading } = this.props;
    const { editVisiable, editData, } = this.state;

    return {
      visible: editVisiable,
      editData,
      saving: loading.effects["job/saveJob"],
      onSave: this.save,
      onClose: () => {
        this.setState({
          editVisiable: false,
          editData: null,
        });
      }
    };
  }

  getHistoryModalProps = () => {
    const { historyVisible, editData, } = this.state;

    return {
      visible: historyVisible,
      editData,
      onClose: () => {
        this.setState({
          historyVisible: false,
          editData: null,
        });
      }
    };
  }

  render() {
    const { editVisiable, historyVisible } = this.state;
    return (
      <Fragment>
        <ExtTable onTableRef={inst => this.tableRef = inst} {...this.getExtTableProps()} />
        {editVisiable ? <EditModal {...this.getEditModalProps()} /> : null}
        {historyVisible ? <HistoryModal {...this.getHistoryModalProps()} /> : null}
      </Fragment>
    );
  }
}

export default BackJob;
