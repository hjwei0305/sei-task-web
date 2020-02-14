import React from 'react';
import { Popover, Skeleton, List, } from 'antd';
import { ScrollBar, } from 'seid';

export default class TriggerTimesPopover extends React.PureComponent {

  state = {
    visible: false,
  }

  handleVisibleChange = (visible) => {
    const { onVisibleChange, } = this.props;
    this.setState({
      visible,
    }, () => {
      if (onVisibleChange) {
        onVisibleChange(visible);
      }
    });
  }

  getContent = () => {
    const { dataSource, } = this.props;

    return (
        <div style={{ width: 250, height: 300}}>
          <ScrollBar>
            <List
              itemLayout="vertical"
              size="large"
              dataSource={dataSource}
              renderItem={(item, index) => {
                return (<List.Item>
                  {`第${index+1}次： ${item}`}
                </List.Item>)
              }}
            />
          </ScrollBar>
        </div>
    );
  }

  render() {
    const { children, } = this.props;
    const { visible,} = this.state;

    return (
      <Popover
        placement="right"
        title={'未来最近10次的执行时间'}
        content={this.getContent()}
        trigger="click"
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
      >
        {children}
      </Popover>
    );
  }
}
