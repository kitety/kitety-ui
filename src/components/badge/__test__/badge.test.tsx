import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { Badge, badgeBackground, badgeColor, BadgeProps } from '../index';
import { color, typography } from '../../shared/style';

const testonClick = jest.fn();
const testThemeFunc = (status: BadgeProps['status']) => {
  cleanup();
  let wrapper = render(<Badge status={status}>111</Badge>);
  const text = wrapper.getByText('111');
  expect(text).toHaveStyle(`color:${badgeColor[status]}`);
  expect(text).toHaveStyle(`background:${badgeBackground[status]}`);
};
describe('test Badge component', () => {
  it('should render the default style', () => {
    let wrapper = render(<Badge>111</Badge>);
    expect(wrapper).toMatchSnapshot();
    const text = wrapper.getByText('111');
    expect(text).toHaveStyle(`color:${badgeColor.neutral}`);
    expect(text).toHaveStyle(`background:${badgeBackground.neutral}`);
  });
  it('should render correct theme', () => {
    testThemeFunc('positive');
    testThemeFunc('warning');
    testThemeFunc('negative');
    testThemeFunc('neutral');
    testThemeFunc('error');
  });
  it('should render the correct attr', () => {
    let wrapper = render(
      <Badge className="testClass" onClick={testonClick}>
        attr
      </Badge>,
    );
    const text = wrapper.getByText('attr');
    expect(text.className.includes('testClass')).toBeTruthy();
    fireEvent.click(text);
    expect(testonClick).toHaveBeenCalled();
  });
});
