import React from 'react';
import { Avatar, AvatarSize } from './index';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';

export default {
  title: 'Avatar',
  component: Avatar,
  decorators: [withKnobs],
};
type AvatarSizeType = keyof typeof AvatarSize;
export const knobsAvatar = () => (
  <Avatar
    size={select<AvatarSizeType>('size', Object.keys(AvatarSize) as AvatarSizeType[], 'medium')}
    username={text('username', 'hello')}
    src={text('src', 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png')}
    isLoading={boolean('isLoading', false)}
  />
);

export const large = () => (
  <div>
    <Avatar isLoading size="large" />
    <Avatar username="kitety" size="large" />
    <Avatar
      username="kitety"
      size="large"
      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
    />
  </div>
);

export const medium = () => (
  <div>
    <Avatar isLoading />
    <Avatar username="你好" />
    <Avatar
      username="kitety"
      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
    />
  </div>
);
export const small = () => (
  <div>
    <Avatar isLoading size="small" />
    <Avatar username="你好" size="small" />
    <Avatar
      size="small"
      username="kitety"
      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
    />
  </div>
);
export const tiny = () => (
  <div>
    <Avatar isLoading size="tiny" />
    <Avatar username="你好" size="tiny" />
    <Avatar
      size="tiny"
      username="kitety"
      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
    />
  </div>
);
