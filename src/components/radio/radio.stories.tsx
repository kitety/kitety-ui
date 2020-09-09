import React, { useState } from 'react';
import { Radio } from './index';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { color } from '../shared/style';
import { Icon } from '../icon';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Radio',
  component: Radio,
  decorators: [withKnobs],
};
const onChange = action('change');

export const knobsRadio = () => (
  <Radio
    appearance={select<keyof typeof color>(
      'color',
      Object.keys(color) as Array<keyof typeof color>,
      'primary',
    )}
    onChange={onChange}
    label={text('label', 'i am radio')}
    error={text('error', '')}
    description={text('description', '')}
    hideLabel={boolean('hideLabel', false)}
    disabled={boolean('disabled', false)}
  ></Radio>
);

export const testColors = () => (
  <div>
    {Object.keys(color).map((v, i) => (
      <Radio
        key={i}
        name="group2"
        label={v}
        appearance={v as keyof typeof color}
        style={{ marginBottom: 4 }}
      />
    ))}
  </div>
);
export const testOnchange = () => (
  <form>
    <Radio name="group1" label="apple" onChange={onChange} />
    <Radio name="group1" label="banana" onChange={onChange} />
    <Radio name="group1" label="pear" onChange={onChange} />
    <Radio name="group1" label="mongo" onChange={onChange} />
    <Radio name="group1" label="watermelon" onChange={onChange} />
  </form>
);

export const testDisabled = () => <Radio label="disabled" disabled />;
export const testExtraText = () => <Radio label="text1" error="error" description="description" />;
export const testHiddenLabel = () => <Radio label="text1" hideLabel description="description" />;
export const widthIcon = () => (
  <Radio
    label={
      <span>
        <Icon icon="redux" />
        With Icon
      </span>
    }
  />
);

function ParentControl() {
  const [state, setState] = useState(() => new Array(5).fill(false));
  const onClick = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const target = e.target as HTMLInputElement;
    const index = (target.value as unknown) as number;
    let newArr = new Array(5).fill(false);
    newArr[index] = true;
    setState(newArr);
  };
  return (
    <div>
      <Radio label="apple" onClick={onClick} value="0" checked={state[0]} onChange={() => {}} />
      <Radio label="banana" onClick={onClick} value="1" checked={state[1]} onChange={() => {}} />
      <Radio label="pear" onClick={onClick} value="2" checked={state[2]} onChange={() => {}} />
      <Radio label="mongo" onClick={onClick} value="3" checked={state[3]} onChange={() => {}} />
      <Radio
        label="watermelon"
        onClick={onClick}
        value="4"
        checked={state[4]}
        onChange={() => {}}
      />
    </div>
  );
}

export const testParentControl = () => <ParentControl></ParentControl>;
