import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { Progress } from '../index';
import { color, typography } from '../../shared/style';

describe('test Progress component', () => {
  it(' should render by count', () => {
    let wrapper = render(<Progress count={11} />);
    let text = wrapper.getByText('11%');
    expect(wrapper).toMatchSnapshot();
    expect(text).toBeTruthy();
    cleanup();
    wrapper = render(<Progress count={111} />);
    text = wrapper.getByText('100%');
    expect(wrapper).toMatchSnapshot();
    expect(text).toBeTruthy();
    cleanup();
    wrapper = render(<Progress count={-111} />);
    text = wrapper.getByText('0%');
    expect(wrapper).toMatchSnapshot();
    expect(text).toBeTruthy();
    cleanup();
    wrapper = render(<Progress count={11} circle />);
    text = wrapper.getByText('11%');
    expect(wrapper).toMatchSnapshot();
    expect(text).toBeTruthy();
    cleanup();
    wrapper = render(<Progress count={111} circle />);
    text = wrapper.getByText('100%');
    expect(wrapper).toMatchSnapshot();
    expect(text).toBeTruthy();
    cleanup();
    wrapper = render(<Progress count={-111} circle />);
    text = wrapper.getByText('0%');
    expect(wrapper).toMatchSnapshot();
    expect(text).toBeTruthy();
    cleanup();
  });
  it('should change color ', () => {
    let wrapper = render(
      <Progress
        count={11}
        primary={color.primary}
        secondary={color.purple}
        bottomColor={color.ultraviolet}
        flashColor={color.seafoam}
      />,
    );
    expect(wrapper).toMatchSnapshot();
    cleanup();
    wrapper = render(
      <Progress
        count={11}
        primary={color.orange}
        secondary={color.purple}
        bottomColor={color.ultraviolet}
        flashColor={color.seafoam}
      />,
    );
    expect(wrapper).toMatchSnapshot();
    cleanup();
    wrapper = render(
      <Progress
        circle
        count={11}
        primary={color.orange}
        secondary={color.purple}
        bottomColor={color.ultraviolet}
        flashColor={color.seafoam}
      />,
    );
    expect(wrapper).toMatchSnapshot();
    cleanup();
  });
  it(' should change text', () => {
    let wrapper = render(<Progress count={11} progressText="hello" />);
    let text = wrapper.getByText('hello');
    expect(text).toBeTruthy();
    cleanup();
    wrapper = render(<Progress count={11} progressText="hello" circle />);
    text = wrapper.getByText('hello');
    expect(text).toBeTruthy();
    cleanup();
  });
  it('should change size', () => {
    let wrapper = render(<Progress count={11} height={500}></Progress>);
    expect(wrapper).toMatchSnapshot();
    cleanup();
    wrapper = render(<Progress circle={true} count={11} size={400}></Progress>);
    expect(wrapper).toMatchSnapshot();
  });
});
