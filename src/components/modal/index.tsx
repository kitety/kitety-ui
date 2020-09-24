import React, { PropsWithChildren, ReactNode, useMemo, useState } from 'react';
import styled from 'styled-components';
import { color, typography } from '../shared/style';
import { darken, rgba, opacify } from 'polished';
import { easing } from '../shared/animation';
import { createPortal } from 'react-dom';
import { number } from '@storybook/addon-knobs';

export type ModalProps = {};

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
  widows: 30%;
  z-index: 1001;
  ${(props) => props.visible && `animation: ${modalOpenAnimate} ${props.delay / 1000} ease-in`}
  ${(props) => !props.visible && `animation: ${modalCloseAnimate} ${props.delay / 1000} ease-in`}
`;

const ModalMask = styled.div`
  background-color: rgba(0, 0, 0, 0.45);
  bottom: 0;
  top: 0;
  left: 0;
  top: 0;
  position: fixed;
`;
const closeBtn = styled.div`
  position: absolute;
  right: 5px;
  top: 5px;
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

export function Modal(props: PropsWithChildren<ModalProps>) {
  const [visible, setVisible] = useState(false);
  const render = () => {
    if (visible) {
      return <div>111</div>;
    }
    return null;
  };
  const mount = document.body;
  return (
    <div id="test">
      {createPortal(render(), mount)} <button onClick={() => setVisible(!visible)}>++++</button>
    </div>
  );
}
