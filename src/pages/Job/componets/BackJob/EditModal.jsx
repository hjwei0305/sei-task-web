import React, { PureComponent } from "react";
import { Form, Input, Checkbox, Row, Col } from "antd";
import { formatMessage, } from "umi-plugin-react/locale";
import { ExtModal, CronInput } from 'seid'

const TextArea = Input.TextArea;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 10
  },
  wrapperCol: {
    span: 14
  }
};

@Form.create()
class EditModal extends PureComponent {

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

  render() {
    const { form, editData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    const title = editData
      ? formatMessage({
        id: "global.edit",
        defaultMessage: "编辑"
      })
      : formatMessage({ id: "global.add", defaultMessage: "新建" });
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
              style={{display: "none"}}
              label="id">
              {getFieldDecorator('id', {
                  initialValue: editData && editData.id,
              })(
                  <Input/>
              )}
          </FormItem>

          <FormItem
              labelCol={{span: 5}}
              wrapperCol={{span: 19}}
              label='作业名称'
          >
              {getFieldDecorator('name', {
                initialValue: editData ? editData.name : "",
                rules: [{required: true, message: '请填写作业名称!'}]
              })(
                  <Input/>
              )}
          </FormItem>
          <Row>
              <Col span={12}>
                  <FormItem
                      {...formItemLayout}
                      label='应用模块代码'>
                      {getFieldDecorator('appModuleCode', {
                          initialValue: editData ? editData.appModuleCode : "",
                          rules: [{required: true, message: '请填写应用模块代码!'}]
                      })(
                          <Input/>
                      )}
                  </FormItem>
              </Col>
              <Col span={12}>
                  <FormItem
                      {...formItemLayout}
                      label='应用模块名称'
                  >
                      {getFieldDecorator('appModuleName', {
                          initialValue: editData ? editData.appModuleName : "",
                          rules: [{required: true, message: '请填写应用模块名称!'}]
                      })(
                          <Input/>
                      )}
                  </FormItem>
              </Col>
          </Row>
          <FormItem
            labelCol={{span: 5}}
            wrapperCol={{span: 19}}
            label='Cron表达式'
          >
              {getFieldDecorator('cronExp', {
                  initialValue: editData ? editData.cronExp : "",
                  rules: [{required: true, message: '请填写Cron表达式!'}]
              })(
                 <CronInput/>
              )}
          </FormItem>
          <Row>
              <Col span={12}>
                  <FormItem
                      {...formItemLayout}
                      label='API服务路径'
                  >
                      {getFieldDecorator('apiPath', {
                          initialValue: editData ? editData.apiPath : "",
                          rules: [{required: true, message: '请填写API服务路径!'}]
                      })(
                          <TextArea autoSize={{minRows: 3, maxRows: 3}}/>
                      )}
                  </FormItem>
              </Col>
              <Col span={12}>
                  <FormItem
                      {...formItemLayout}
                      label='作业说明'
                  >
                      {getFieldDecorator('remark', {
                          initialValue: editData ? editData.remark : "",
                          rules: [{required: true, message: '请填写作业说明!'}]
                      })(
                          <TextArea autoSize={{minRows: 3, maxRows: 3}}/>
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
                          initialValue: editData ? editData.methodName : "",
                          rules: [{required: true, message: '请填写API服务方法名!'}]
                      })(
                          <Input/>
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
                          <Checkbox/>
                      )}
                  </FormItem>
              </Col>
          </Row>
          <FormItem
              labelCol={{span: 5}}
              wrapperCol={{span: 19}}
              label='输入参数'
          >
              {getFieldDecorator('inputParam', {
                  initialValue: editData ? editData.inputParam : "",
              })(
                  <TextArea autoSize={{minRows: 3, maxRows: 3}}/>
              )}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default EditModal;
