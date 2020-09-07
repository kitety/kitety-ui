import React, { PropsWithChildren, ReactNode, useMemo } from 'react';
import styled from 'styled-components';
import { color, typography, background } from '../shared/style';
import { darken, rgba, opacify } from 'polished';
import { easing } from '../shared/animation';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  status: 'positive' | 'negative' | 'neutral' | 'warning' | 'error';
}

export const badgeColor = {
  positive: color.positive,
  negative: color.negative,
  neutral: color.dark,
  warning: color.warning,
  error: color.lightest,
};
export const badgeBackground = {
  positive: background.positive,
  negative: background.negative,
  neutral: color.mediumlight,
  warning: background.warning,
  error: color.negative,
};

const BadgeWrapper = styled.div<BadgeProps>`
  display: inline-block;
  padding: 4px 12px;
  font-weight: ${typography.weight.bold};
  font-size: 11px;
  line-height: 12px;
  vertical-align: top;
  border-radius: 3em;

  svg {
    width: 12px;
    height: 12px;
    margin-top: -2px;
    margin-right: 4px;
  }
  ${props=>props.status}
`;

export function badge(props: PropsWithChildren<BadgeProps>) {
  const { children } = props;
  return <div></div>;
}
