import React, {
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';
import { color, typography } from '../shared/style';
import { progressFlash } from '../shared/animation';

export type ProgressProps = {
  /**传入数字 */
  count: number;
  /**是否要末尾计数文本 */
  countNumber?: boolean;
  /**环状不生效 进度条高度 */
  height?: number;
  /**是否是环状 */
  circle?: boolean;
  /**环状大小 */
  size?: number;
  /**环状进度条文本内容 */
  circleText?: string;
  /**自定义长条进度条文本内容 */
  progressText?: string | number | ReactNode;
  /**长条闪烁动画颜色 */
  flashColor?: string;
  /**主色 */
  primary?: string;
  /**副色 */
  secondary?: string;
  /**底座色 */
  bottomColor?: string;
  /**外层容器style */
  style?: CSSProperties;
  /**外层容器类型 */
  className?: string;
};

interface BarMainProps {
  state: number;
  height?: number;
  flashColor: string;
  primary: string;
  secondary: string;
}
const BarWrapper = styled.div`
  display: flex;
  padding: 5px;
  align-items: center;
`;
const BarMain = styled.div<BarMainProps>`
  width: ${(props) => props.state}%;
  height: ${(props) => props.height || 8}px;
  background-color: ${(props) => props.primary};
  background-image: linear-gradient(
    to right,
    ${(props) => props.primary},
    ${(props) => props.secondary}
  );
  transition: all 0.4s cubic-bezier(0.08, 0.82, 0.17, 1) 0s;
  border-radius: 5px;
  position: relative;
  &::before {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    content: '';
    border-radius: 10px;
    position: absolute;
    background: ${(props) => props.flashColor};
    animation: ${progressFlash} 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite;
  }
`;
const BarMainWrapper = styled.div<{ bottomColor: string; height?: number }>`
  width: 100%;
  border-radius: 5px;
  position: relative;
  background: ${(props) => props.bottomColor};
  height: ${(props) => props.height || 8}px;
`;
const BarText = styled.div<{ height?: number }>`
  line-height: ${(props) => props.height || 8}px;
  font-weight: ${typography.weight.bold};
  text-align: center;
  display: inline-block;
  margin-left: 10px;
  min-width: 55px;
`;
const CircleWrapper = styled.div`
  position: relative;
  display: inline-block;
  border-radius: 50%;
`;
const CircleText = styled.div<{ size: number }>`
  line-height: ${(props) => props.size * 0.62}px;
  width: ${(props) => props.size * 0.62}px;
  height: ${(props) => props.size * 0.62}px;
  border-radius: 50%;
  font-weight: ${typography.weight.bold};
  display: inline-block;
  left: 50%;
  position: absolute;
  text-align: center;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
`;
export function Progress(props: PropsWithChildren<ProgressProps>) {
  const {
    count,
    countNumber,
    height,
    circle,
    size,
    circleText,
    progressText,
    style,
    className,
    bottomColor,
    flashColor,
    primary,
    secondary,
  } = props;
  const [state, setState] = useState<number>(0);
  const [dasharray, setDashArray] = useState<string>('');
  // 限定范围
  useEffect(() => {
    if (count < 0) {
      setState(0);
    } else if (count > 100) {
      setState(100);
    } else {
      setState(count);
    }
  }, [count]);
  useEffect(() => {
    if (circle) {
      let percent = state / 100;
      let perimeter = Math.PI * 2 * 170; //周长
      let dasharray = perimeter * percent + ' ' + perimeter * (1 - percent);
      setDashArray(dasharray);
    }
  }, [count, circle, state]);
  const render = useMemo(() => {
    if (circle) {
      return (
        <CircleWrapper style={style} className={className}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 420 420"
            style={{ transform: 'rotate(270deg)' }}
          >
            <defs>
              <radialGradient id="linear" r="100%" cx="100%" cy="100%" spreadMethod="pad">
                <stop offset="0%" stopColor={primary}></stop>
                <stop offset="100%" stopColor={secondary}></stop>
              </radialGradient>
            </defs>
            <circle
              cx="210"
              cy="210"
              r="170"
              strokeWidth="40"
              stroke={bottomColor}
              fill="none"
            ></circle>
            <circle
              cx="210"
              cy="210"
              r="170"
              strokeWidth="40"
              stroke="url(#linear)"
              fill="none"
              opacity={state === 0 ? 0 : 1}
              strokeLinecap="round"
              strokeDasharray={dasharray}
              strokeDashoffset="0px"
              style={{
                transition:
                  'stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s ease 0s, stroke-width 0.06s ease 0.3s',
              }}
            ></circle>
          </svg>
          <CircleText size={size!}>{progressText || circleText || `${state}%`}</CircleText>
        </CircleWrapper>
      );
    } else {
      return (
        <BarWrapper style={style} className={className}>
          <BarMainWrapper bottomColor={bottomColor!} height={height}>
            <BarMain
              flashColor={flashColor!}
              primary={primary!}
              secondary={secondary!}
              state={state}
              height={height}
            />
          </BarMainWrapper>
          {countNumber && <BarText height={height}>{progressText || `${state}%`}</BarText>}
        </BarWrapper>
      );
    }
  }, [
    circle,
    circleText,
    countNumber,
    dasharray,
    height,
    progressText,
    size,
    state,
    bottomColor,
    className,
    flashColor,
    primary,
    secondary,
    style,
  ]);
  return <>{render}</>;
}
Progress.defaultProps = {
  countNumber: true,
  circle: false,
  size: 100,
  primary: color.primary,
  secondary: color.gold,
  flashColor: color.lightest,
  bottomColor: color.medium,
};
