import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { Radio } from '../index';
import { color, typography } from '../../shared/style';

const testFn = jest.fn();
const disableFn = jest.fn();
describe('test Radio component', () => {
  it('should checked when clicked', () => {
    const wrapper = render(<Radio label="test" onChange={testFn} />);
    expect(wrapper).toMatchSnapshot();
    const input = wrapper.container.querySelector('input')!;
    expect(testFn).not.toHaveBeenCalled();
    fireEvent.click(input);
    expect(testFn).toHaveBeenCalled();
  });
  it('should render extra text ', () => {
    const wrapper = render(
      <Radio label="test" error="errorText" description="description" onChange={testFn} />,
    );
    expect(wrapper).toMatchSnapshot();
    const errorText = wrapper.getByText('errorText');
    expect(errorText).toHaveStyle(`color:${color.negative}`);
    const description = wrapper.getByText('description');
    expect(description).toHaveStyle(`color:${color.mediumdark}`);
  });
  it('should hide label ', () => {
    const wrapper = render(<Radio label="test" hideLabel onChange={testFn} />);
    expect(wrapper).toMatchSnapshot();
    const test = wrapper.getByText('test');
    expect(test).toHaveStyle(`clip-path: inset(100%)`);
  });
  it('should disabled ', () => {
    const wrapper = render(<Radio label="test" disabled onChange={disableFn} />);
    expect(wrapper).toMatchSnapshot();
    const test = wrapper.getByText('test');
    fireEvent.click(test);
    expect(disableFn).not.toHaveBeenCalled();
  });
});
