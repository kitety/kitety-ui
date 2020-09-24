import React from 'react';
import { Progress } from './index';
import { withKnobs, text, boolean, color, number } from '@storybook/addon-knobs';
import { Icon } from '../icon';

export default {
  title: 'Progress',
  component: Progress,
  decorators: [withKnobs],
};

export const knobsProgress = () => (
  <Progress
    count={number('count', 50, { range: true, min: 0, max: 100, step: 1 })}
    height={number('height', 0)}
    size={number('size', 100)}
    countNumber={boolean('countNumber', true)!}
    circle={boolean('circle', false)}
    primary={color('primary', '#ff0000')}
    secondary={color('secondary', '#FFAE00')}
    bottomColor={color('bottomColor', '#DDDDDD')}
    flashColor={color('flashColor', '#FFFFFF')}
    progressText={text('progressText', '')}
  />
);

export const circle = () => <Progress count={20} circle={true}></Progress>;
export const progressText = () => <Progress count={20} progressText="hello"></Progress>;
export const changeColor = () => (
  <Progress count={20} primary="blue" secondary="yellow" bottomColor="brown"></Progress>
);

export const withIcon = () => (
  <Progress
    count={11}
    progressText={
      <span>
        <Icon icon="admin"></Icon>
      </span>
    }
  ></Progress>
);
