import React from 'react';
import { createMessage, message, Message, MessageType } from './index';
import { withKnobs, text, boolean, color, select, number } from '@storybook/addon-knobs';
import { Button } from '../..';
import { Icon } from '../icon';

export default {
  title: 'Message',
  component: Message,
  decorators: [withKnobs],
};

const Option: MessageType[] = ['info', 'success', 'error', 'warning', 'loading', 'default'];

export const knobsMessage = () => {
  const se = select<MessageType>('iconType', Option, 'default');
  const op = {
    delay: number('delay', 2000),
    animationDuring: number('animationDuring', 300),
    background: color('background', '#fff'),
    color: color('color', '#333'),
  };
  const tx = text('content', 'hello');
  const onClick = () => {
    message[se](tx, op);
  };

  return (
    <div>
      <Button onClick={onClick}>click</Button>
    </div>
  );
};
export const callbackTest = () => (
  <div>
    <Button
      onClick={() =>
        message.loading('加载中', {
          callback: () => message.success('加载完成'),
        })
      }
    >
      callback
    </Button>
  </div>
);
export const withIcon = () => (
  <div>
    <Button
      onClick={() =>
        message.default(
          <span>
            <Icon icon="admin"></Icon>111
          </span>,
        )
      }
    >
      callback
    </Button>
  </div>
);