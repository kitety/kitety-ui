import React, { CSSProperties, PropsWithChildren, ReactNode, useEffect, useMemo, useRef, } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { typography } from '../shared/style';

import { createPortal } from 'react-dom';
import { useStateAnimation, useStopScroll } from './util';
import { Button } from '../..';
import { Icon } from '../icon';

export const modalOpenAnimate = keyframes`
  0% {
    opacity: 0;
    transform: scaleY(0,0);
  }
  100% {
    opacity: 1;
    transform: scale(1,1);
    transform-origin: center;
  }
`;

export const modalCloseAnimate = keyframes`
  0% {
    opacity: 1;
    transform: scale(1,1);
    transform-origin: center;
  }
  100% {
    opacity: 0;
    transform: scaleY(0,0);
  }
`;


const ModalWrapper = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  position: fixed;
`;
const ModalViewPort = styled.div<{ visible: boolean; delay: number }>`
  background: #fff;
  border: none;
  border-radius: 5px;
  box-shadow: 2px 2px 4px #9d9d9d;
  text-shadow: 1px 1px 4px #d9d9d9, -1px -1px 4px #fff;
  margin: 0 auto;
  min-width: 320px;
  overflow: hidden;
  padding: 8px;
  position: relative;
  top: 100px;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  width: 30%;
  z-index: 1001;
  ${(props) => props.visible && css`animation: ${modalOpenAnimate} ${props.delay / 1000}s ease-in`}
  ${(props) => !props.visible && css`animation: ${modalCloseAnimate} ${props.delay / 1000}s ease-in`}
`;

const ModalMask = styled.div`
  background-color: rgba(0, 0, 0, 0.45);
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  position: fixed;
`;
const CloseBtn = styled.div`
  position: absolute;
  right: 5px;
  top: 16px;
`;
const ConfirmWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
`;
const ChildrenWrapper = styled.div`
  min-height: 100px;
  padding: 10px;
`;
const TitleWrapper = styled.div`
  height: 30px;
  line-height: 30px;
  font-size: ${typography.size.m2}px;
  font-weight: ${typography.weight.bold};
  padding: 5px;
`;
export type ModalProps = {
  /** 父组件用来控制的状态 */
  visible: boolean;
  /** 容器位置 */
  container?: Element;
  /** 父组件setState */
  parentSetState?: (v: boolean) => void;
  /** 弹出框标题 */
  title?: ReactNode;
  /** 是否有确认按钮 */
  confirm?: boolean;
  /** 改变确认按钮文本 */
  okText?: ReactNode | string;
  /** 改变取消按钮文本 */
  cancelText?: ReactNode | string;
  /** 点了确认的回调，如果传了，需要自行处理关闭 */
  onOk?: (set: (v: boolean) => void) => void
  /** 点了取消的回调，如果传了，需要自行处理关闭 */
  onCancel?: (set: (v: boolean) => void) => void
  /** 点确认或者取消都会走的回调 */
  callback?: (v: boolean) => void;
  /** 点击mask是否关闭模态框 */
  maskClose?: boolean;
  /** 是否有mask */
  mask?: boolean;
  /** 自定义模态框位置 */
  style?: CSSProperties;
  /** 是否有右上角关闭按钮 */
  closeButton?: boolean;
  /** 动画时间 */
  delay?: number;
  /** 是否停止滚动 */
  stopScroll?: boolean;
  /** portalstyle */
  portalStyle?: CSSProperties;
  /** portal回调 */
  refCallback?: (ref: HTMLDivElement) => void;
  /** 没点确认与取消，直接关闭的回调 */
  closeCallback?: () => void;
};

export function Modal(props: PropsWithChildren<ModalProps>) {
  const { visible, maskClose, closeButton, delay, mask, container = document.body, confirm, okText, cancelText, style, onOk, onCancel, title, parentSetState, stopScroll, portalStyle, refCallback, closeCallback, callback } = props
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState, unmount] = useStateAnimation(parentSetState, delay)
  const render = useMemo(() => {
    if (!visible) {
      unmount()
      return null
    } else {
      return createPortal(<ModalWrapper ref={ref} style={portalStyle}>
        <ModalViewPort style={style} visible={state} delay={delay!}>
          <div>
            {title && <TitleWrapper>{title}</TitleWrapper>}
            {closeButton && <CloseBtn>
              <Button style={{ background: '#fff', borderRadius: '5px', padding: '5px' }} onClick={() => {
                setState(false);
                closeCallback?.();
              }}><Icon icon="closeAlt" /></Button>
            </CloseBtn>
            }
          </div>
          {<ChildrenWrapper>{props.children}</ChildrenWrapper>}
          {confirm && <ConfirmWrapper>
            <Button appearance="secondary" onClick={() => {
              onOk ? onOk(setState) : setState(false)
              callback?.(true)
            }}>{okText || '确认'}</Button>
            <Button appearance="secondary" style={{ marginLeft: 10 }} onClick={() => {
              onCancel ? onCancel(setState) : setState(false)
              callback?.(true)
            }}>{cancelText || '取消'}</Button>
          </ConfirmWrapper>}
        </ModalViewPort>
        {mask && <ModalMask onClick={() => {
          if (maskClose) {
            setState(false)
            closeCallback?.()
          }
        }}></ModalMask>}
      </ModalWrapper >, container!)
    }
  }, [
    callback,
    cancelText,
    closeButton,
    closeCallback,
    confirm,
    container,
    mask,
    maskClose,
    okText,
    onCancel,
    onOk,
    portalStyle,
    props.children,
    setState,
    style,
    title,
    state,
    visible,
    delay,
    unmount,
  ])

  useStopScroll(visible!, 300, stopScroll)

  useEffect(() => {
    if (refCallback && ref?.current) {
      refCallback(ref.current)
    }
  }, [refCallback])

  return <>{render}</>
}
Modal.defaultProps = {
  visible: false,
  container: document.body,
  title: '标题',
  confirm: true,
  okText: "确定",
  cancelText: '取消',
  maskClose: true,
  mask: true,
  closeButton: true,
  delay: 300,
  stopScroll: true,
}
