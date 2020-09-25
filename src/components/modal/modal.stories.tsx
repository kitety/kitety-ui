import React, { PropsWithChildren, useState } from 'react';
import { Modal } from './index';
import { withKnobs, text, boolean, color, select, number } from '@storybook/addon-knobs';
import { createPortal } from 'react-dom';
import { action } from '@storybook/addon-actions';
import { Button } from '../..';

export default {
  title: 'Modal',
  component: Modal,
  decorators: [withKnobs],
};

function KnobsModal() {
  const [state, setState] = useState(false);
  const title = text("title", "标题");
  const child = text("children", "sdsdsssda");
  const confirm = boolean("confirm", true);
  const okText = text("okText", "");
  const cancelText = text("cancelText", "");
  return (
    <div>
      <Modal
        refCallback={action("refcallback")}
        stopScroll={boolean("stopScroll", true)}
        delay={number("delay", 200)}
        closeButton={boolean("closeButton", true)}
        mask={boolean("mask", true)}
        maskClose={boolean("maskClose", true)}
        callback={action("callback")}
        cancelText={cancelText}
        okText={okText}
        confirm={confirm}
        title={title}
        parentSetState={setState}
        visible={state}
      >
        {child}
      </Modal>
      <Button onClick={() => setState(!state)}>toggle</Button>
    </div >
  );
}

export const knobsModal = () => <KnobsModal></KnobsModal>;
