import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Icon, IconProps } from '..';
import { icons } from '../../shared/icons';

function IconTest(icon: IconProps['icon']) {
  const wrapper = render(<Icon icon={icon} />);
  const path = wrapper.queryByTestId('icon-path');
  expect(path).toHaveAttribute('d', icons[icon]);
  cleanup();
}

describe('test Icon component', () => {
  it('should render the correct icon', () => {
    Object.keys(icons).forEach((key) => {
      IconTest(key as IconProps['icon']);
    });
  });
  it('should render block', () => {
    const wrapper = render(<Icon icon="mobile" />);
    const svg = wrapper.getByTestId('icon-svg');
    expect(svg).toHaveStyle('display:block');
  });
  it('should render correct color ', () => {
    let wrapper = render(<Icon icon="mobile" />);
    let path = wrapper.queryByTestId('icon-path');
    expect(path).toHaveStyle('display:block');
    cleanup();
    wrapper = render(<Icon icon="mobile" color="blue" />);
    path = wrapper.queryByTestId('icon-path');
    expect(path).toHaveAttribute('color', 'blue');
  });
});
