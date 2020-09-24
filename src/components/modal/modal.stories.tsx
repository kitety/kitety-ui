import React, { PropsWithChildren, useState } from 'react';
import { Modal, ModalProps } from './index';
import { withKnobs, text, boolean, color, select } from '@storybook/addon-knobs';
import { createPortal } from 'react-dom';

export default {
  title: 'Modal',
  component: Modal,
  decorators: [withKnobs],
};

export function kk(props: PropsWithChildren<ModalProps>) {
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
