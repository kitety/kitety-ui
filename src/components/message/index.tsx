import React, { PropsWithChildren, ReactNode, useEffect, useMemo, useState } from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import styled, { css, keyframes } from 'styled-components';
import { Icon } from '../icon';
import { icons } from '../shared/icons';
import { color, typography } from '../shared/style';

export type MessageType = 'info' | 'success' | 'error' | 'warning' | 'loading' | 'default';

export interface MessageConfig {
  /** 挂载点 */
  mount: HTMLElement;
  /** 动画延迟时间 */
  delay: number;
  /** 结束后的回调 */
  callback: any;
  /** 动画持续时间 */
  animationDuring: number;
  /** 底色 */
  background: string;
  /** 文字颜色 */
  color: string;
}
export const messageOpenAnimate = keyframes`
  0%{
    opacity: 0;
    margin-top:-30px;
  }
  50%{
    opacity: 0.5;
    margin-top:-15px;
  }
  100%{
    opacity: 1;
    margin-top:0;
  }
`;
export const messageCloseAnimate = keyframes`
  0%{
    opacity: 1;
    margin-top:0;
  }
  100%{
    opacity: 0;
    margin-top:-30px;
  }
`;
export const iconSpin = keyframes`
  0%{
    transform:rotate(0deg)
  }
  100%{
    transform:rotate(360deg)
  }
`;
export const messageBoxShadow = css`
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
`;

const MessageText = styled.span<{ bg: string; fc: string }>`
  display: inline-block;
  padding: 10px 16px;
  background: ${(props) => props.bg};
  color: ${(props) => props.fc};
  font-size: ${typography.size.s2}px;
  font-weight: ${typography.weight.bold};
  margin: 10px;
  ${messageBoxShadow}
  border-radius:2px;
`;

const IconWrapper = styled.span<{ spin?: boolean }>`
  margin-right: 10px;
  & > svg {
    font-size: ${typography.size.s2}px;
    ${(props) =>
    props?.spin &&
    css`
        animation: ${iconSpin} 2s linear infinite;
      `}
  }
`;

const MessageTextWrapper = styled.div<{
  openState: boolean;
  closeState: boolean;
  ani: number;
}>`
  ${(props) =>
    props?.openState &&
    css`
      animation: ${messageOpenAnimate} ${props?.ani / 1000}s ease-in;
    `}
  ${(props) =>
    props?.closeState &&
    css`
      animation: ${messageCloseAnimate} ${props?.ani / 1000}s ease-in;
    `}
`;
const defaultConfig: MessageConfig = {
  mount: document.body,
  delay: 2000,
  callback: null,
  animationDuring: 300,
  background: color.lightest,
  color: color.dark,
};

export type MessageProps = {
  rootDom: HTMLElement; //这个用来干掉parentDom 这个可以常驻
  parentDom: Element | DocumentFragment; //这个是挂载点 要unmount卸载 完毕后卸载挂载点 注意！一共2步卸载，别漏了
  content: ReactNode;
  fconfig: MessageConfig;
  iconType: MessageType;
};

const IconConfig: { [key in MessageType]: { icon: keyof typeof icons; color: string } } = {
  info: {
    icon: 'info',
    color: 'primary',
  },
  success: {
    icon: 'check',
    color: 'positive',
  },
  error: {
    icon: 'closeAlt',
    color: 'negative',
  },
  warning: {
    icon: 'info',
    color: 'warning',
  },
  loading: {
    icon: 'sync',
    color: '',
  },
  default: {
    icon: 'info',
    color: '',
  },
};
export function Message(props: PropsWithChildren<MessageProps>) {
  const { rootDom, content, parentDom, fconfig, iconType } = props;
  const [close, setClose] = useState(false);

  const renderIcon = useMemo(() => {
    let icon: ReactNode | null
    // default 或者没有这个颜色
    if (['default'].includes(iconType) || (!IconConfig[iconType]?.color)) {
      icon = null;
    } else {
      icon = <Icon
        icon={IconConfig[iconType].icon}
        color={color[IconConfig[iconType].color as keyof typeof color]}
      />
    }
    return (
      <IconWrapper spin={['loading'].includes(iconType)}>
        {icon}
      </IconWrapper>
    );

  }, [iconType]);

  const unmount = useMemo(() => {
    return () => {
      if (rootDom && parentDom) {
        unmountComponentAtNode(parentDom);
        rootDom.removeChild(parentDom);
      }
    };
  }, [rootDom, parentDom]);
  useEffect(() => {
    let closeStart = fconfig.delay - fconfig.animationDuring;
    let timer1 = window.setTimeout(() => {
      setClose(true);
    }, Math.max(closeStart, 0));
    let timer2 = window.setTimeout(() => {
      setClose(false);
      unmount();
      fconfig.callback?.();
    }, fconfig.delay);
    return () => {
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
    };
  }, [unmount, fconfig]);
  return (
    <MessageTextWrapper openState={true} closeState={close} ani={fconfig.animationDuring}>
      <MessageText bg={fconfig.background} fc={fconfig.color}>
        {renderIcon}
        {content}
      </MessageText>
    </MessageTextWrapper>
  );
}

let wrap: HTMLElement;
export const createMessage = (type: MessageType) => {
  return (content: ReactNode, config: Partial<MessageConfig> = {}) => {
    const fconfig = { ...defaultConfig, ...config };
    if (!wrap) {
      //如果有的话，说明已经调用过这个函数了，这个空div就可以一直复用
      wrap = document.createElement('div');
      wrap.style.cssText = `
      line-height:1.5;
      text-align:center;
      color:#333;
      box-sizing: border-box;
      margin:0;
      padding:0;
      list-style:none;
      position:fixed;
      z-index:100000;
      width:100%;
      top:16px;
      left:0;
      pointer-events: none;
      `;
      document.body?.appendChild(wrap);
    }
    const div = document.createElement('div');
    wrap.appendChild(div);
    ReactDOM.render(
      <Message
        rootDom={wrap}
        parentDom={div}
        content={content}
        iconType={type}
        fconfig={fconfig}
      />,
      div,
    );
  };
};
export const message = {
  info: createMessage('info'),
  success: createMessage('success'),
  error: createMessage('error'),
  warning: createMessage('warning'),
  loading: createMessage('loading'),
  default: createMessage('default'),
};
