import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Checkbox, Row, Col, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { ExtModal, CronInput, ComboGrid } from 'suid';
import TriggerTimesPopover from '../TriggerTimesPopover';

const TextArea = Input.TextArea;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

@connect(({ job, loading }) => ({ job, loading }))
@Form.create()
class EditModal extends PureComponent {

  firstIn = true;

  editCron = null;

  onFormSubmit = _ => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      let params = {};
      Object.assign(params, editData || {});
      Object.assign(params, formData);
      onSave(params);
    });
  };

  getComboGridProps = () => {
    const { form } = this.props;
    return {
      form,
      name: 'appModuleName',
      store: {
        autoLoad: false,
        url: `/sei-basic/appModule/findAllUnfrozen`,
      },
      field: ['appModuleCode'],
      columns: [
        {
          title: '代码',
          width: 80,
          dataIndex: 'code',
        },
        {
          title: '名称',
          width: 120,
          dataIndex: 'name',
        },
        {
          title: '服务名',
          width: 220,
          dataIndex: 'apiBaseAddress',
        },
      ],
      searchProperties: ['code', 'name'],
      rowKey: 'id',
      reader: {
        name: 'name',
        field: ['apiBaseAddress'],
      },
    };
  };

  getPopoverProps = () => {
    const { job, dispatch, loading, form, editData } = this.props;
    let cron = form.getFieldValue('cronExp');
    if (editData && this.editCron) {
      cron = this.editCron;
      this.editCron = null;
    }
    return {
      loading: loading.effects['job/getTriggerTimes'],
      placement: 'left',
      dataSource: job.triggerTimes,
      onVisibleChange: (visible) => {
        if (visible) {
          dispatch({
            type: 'job/getTriggerTimes',
            payload: {
              cron,
            },
          });
        } else {
          dispatch({
            type: 'job/updateState',
            payload: {
              triggerTimes: [],
            },
          });
        }
      },
    };
  };

  getCronLabel = () => {
    const { form, editData } = this.props;
    let cron = form.getFieldValue('cronExp');

    if (this.firstIn && editData) {
      cron = editData.cronExp;
      this.firstIn = false;
      this.editCron = editData.cronExp;
    }

    let compoent = (
      <a onClick={(e) => {
        message.warn('最近十次的执行时间清单前, 请先选择cron表达式!');
      }}>Cron表达式</a>
    );

    if (cron) {
      compoent = <TriggerTimesPopover
        {...this.getPopoverProps()}
      >
        <a>Cron表达式</a>
      </TriggerTimesPopover>;
    }
    return compoent;
  };

  render() {
    const { form, editData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    const title = editData
      ? formatMessage({
        id: 'global.edit',
        defaultMessage: '编辑',
      })
      : formatMessage({ id: 'global.add', defaultMessage: '新建' });
    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        width={650}
        onOk={this.onFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">

          <FormItem
            style={{ display: 'none' }}
            label="id">
            {getFieldDecorator('id', {
              initialValue: editData && editData.id,
            })(
              <Input/>,
            )}
          </FormItem>

          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            label='作业名称'
          >
            {getFieldDecorator('name', {
              initialValue: editData ? editData.name : '',
              rules: [{ required: true, message: '请填写作业名称!' }],
            })(
              <Input/>,
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            label='应用模块'
          >
            {getFieldDecorator('appModuleName', {
              initialValue: editData ? editData.appModuleName : '',
              rules: [{ required: true, message: '请选择应用模块' }],
            })(
              <ComboGrid {...this.getComboGridProps()}/>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            style={{ display: 'none' }}
            label='应用模块代码'>
            {getFieldDecorator('appModuleCode', {
              initialValue: editData ? editData.appModuleCode : '',
            })(
              <Input/>,
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            label={this.getCronLabel()}
          >
            {getFieldDecorator('cronExp', {
              initialValue: editData ? editData.cronExp : '',
              rules: [{ required: true, message: '请填写Cron表达式!' }],
            })(
              <CronInput/>,
            )}
          </FormItem>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label='API服务路径'
              >
                {getFieldDecorator('apiPath', {
                  initialValue: editData ? editData.apiPath : '',
                  rules: [{ required: true, message: '请填写API服务路径!' }],
                })(
                  <TextArea autoSize={{ minRows: 3, maxRows: 3 }}/>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label='作业说明'
              >
                {getFieldDecorator('remark', {
                  initialValue: editData ? editData.remark : '',
                  rules: [{ required: true, message: '请填写作业说明!' }],
                })(
                  <TextArea autoSize={{ minRows: 3, maxRows: 3 }}/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="API服务方法名"
              >
                {getFieldDecorator('methodName', {
                  initialValue: editData ? editData.methodName : '',
                  rules: [{ required: true, message: '请填写API服务方法名!' }],
                })(
                  <Input/>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="禁用"
              >
                {getFieldDecorator('disable', {
                  valuePropName: 'checked',
                  initialValue: editData ? editData.disable : false,
                })(
                  <Checkbox/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            label='输入参数'
          >
            {getFieldDecorator('inputParam', {
              initialValue: editData ? editData.inputParam : '',
            })(
              <TextArea autoSize={{ minRows: 3, maxRows: 3 }}/>,
            )}
          </FormItem>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="执行人租户代码"
              >
                {getFieldDecorator('exeTenantCode', {
                  initialValue: editData ? editData.exeTenantCode : '',
                  // rules: [{required: true, message: '请填写执行人租户代码!'}]
                })(
                  <Input/>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="执行人账号"
              >
                {getFieldDecorator('exeAccount', {
                  initialValue: editData ? editData.exeAccount : '',
                })(
                  <Input/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="异常通知邮箱"
              >
                {getFieldDecorator('errorNotifyEmail', {
                  initialValue: editData ? editData.errorNotifyEmail : '',
                  rules: [
                    {
                      type: 'email',
                      message: '输入格式错误，不是有效邮箱地址',
                    },
                  ],
                })(
                  <Input/>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label='异步执行'
              >
                {getFieldDecorator('asyncExe', {
                  valuePropName: 'checked',
                  initialValue: editData ? editData.asyncExe : false,
                })(
                  <Checkbox/>,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </ExtModal>
    );
  }
}

export default EditModal;
