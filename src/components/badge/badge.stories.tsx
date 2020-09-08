import React from 'react';
import { Badge, BadgeProps, badgeColor } from './index';
import { withKnobs, text, boolean, color, select } from '@storybook/addon-knobs';
import { Icon } from '../icon';

export default {
  title: 'Badge',
  component: Badge,
  decorators: [withKnobs],
};
type selectType = BadgeProps['status'];
export const knobsBtn = () => (
  <Badge
    status={select<BadgeProps['status']>(
      'status',
      Object.keys(badgeColor) as selectType[],
      'neutral',
    )}
  >
    {text('children', 'i am a badge')}
  </Badge>
);

export const all = () => (
  <div>
    <Badge status="positive">positive</Badge>
    <Badge status="negative">negative</Badge>
    <Badge status="neutral">neutral</Badge>
    <Badge status="error">error</Badge>
    <Badge status="warning">warning</Badge>
  </div>
);
export const withIcon = () => (
  <Badge status="warning">
    <Icon icon="check" />
    with icon
  </Badge>
);