import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Avatar, AvatarSize } from '../index';

describe('AvatarComponent', () => {
  it('should render default avatar', () => {
    let wrapper = render(<Avatar />);
    expect(wrapper).toMatchSnapshot();
    let div = wrapper.getByTestId('avatar-div');
    expect(div).toBeInTheDocument();
    let username = wrapper.getByText('h');
    expect(username).toBeTruthy();
  });
  it('should render the correct size', () => {
    let wrapper = render(<Avatar />);
    let div = wrapper.getByTestId('avatar-div');
    expect(div).toHaveStyle(`height:${AvatarSize.medium}px`);
    expect(div).toHaveStyle(`width:${AvatarSize.medium}px`);
    expect(div).toHaveStyle(`line-height:${AvatarSize.medium}px`);
    let username = wrapper.getByTestId('avatar-div');
    expect(username).toHaveStyle(`line-height:${AvatarSize.medium}px`);
    cleanup();

    wrapper = render(<Avatar size="large"></Avatar>);
    expect(wrapper).toMatchSnapshot();
    div = wrapper.getByTestId('avatar-div');
    expect(div).toHaveStyle(`height:${AvatarSize.large}px`);
    expect(div).toHaveStyle(`width:${AvatarSize.large}px`);
    expect(div).toHaveStyle(`line-height:${AvatarSize.large}px`);
    username = wrapper.getByTestId('avatar-div');
    expect(username).toHaveStyle(`line-height:${AvatarSize.large}px`);
    cleanup();

    wrapper = render(<Avatar size="medium"></Avatar>);
    expect(wrapper).toMatchSnapshot();
    div = wrapper.getByTestId('avatar-div');
    expect(div).toHaveStyle(`height:${AvatarSize.medium}px`);
    expect(div).toHaveStyle(`width:${AvatarSize.medium}px`);
    expect(div).toHaveStyle(`line-height:${AvatarSize.medium}px`);
    username = wrapper.getByTestId('avatar-div');
    expect(username).toHaveStyle(`line-height:${AvatarSize.medium}px`);
    cleanup();

    wrapper = render(<Avatar size="small"></Avatar>);
    expect(wrapper).toMatchSnapshot();
    div = wrapper.getByTestId('avatar-div');
    expect(div).toHaveStyle(`height:${AvatarSize.small}px`);
    expect(div).toHaveStyle(`width:${AvatarSize.small}px`);
    expect(div).toHaveStyle(`line-height:${AvatarSize.small}px`);
    username = wrapper.getByTestId('avatar-div');
    expect(username).toHaveStyle(`line-height:${AvatarSize.small}px`);
    cleanup();

    wrapper = render(<Avatar size="tiny"></Avatar>);
    expect(wrapper).toMatchSnapshot();
    div = wrapper.getByTestId('avatar-div');
    expect(div).toHaveStyle(`height:${AvatarSize.tiny}px`);
    expect(div).toHaveStyle(`width:${AvatarSize.tiny}px`);
    expect(div).toHaveStyle(`line-height:${AvatarSize.tiny}px`);
    username = wrapper.getByTestId('avatar-div');
    expect(username).toHaveStyle(`line-height:${AvatarSize.tiny}px`);
    cleanup();
  });

  it('should render loading', () => {
    let wrapper = render(<Avatar isLoading />);
    expect(wrapper).toMatchSnapshot();
    let svg = wrapper.getByTestId('icon-svg');
    expect(svg).toBeVisible();
    cleanup();
    wrapper = render(<Avatar isLoading username="123" src="/" size="tiny" />);
    svg = wrapper.getByTestId('icon-svg');
    expect(svg).toBeVisible();
  });

  it('should render correct img', () => {
    let wrapper = render(<Avatar src="www.google.com" />);
    let img = wrapper.getByTestId('avatar-img');
    expect(img.tagName).toEqual('IMG');
    expect(img).toHaveStyle('width:100%;');
    expect(img).toHaveAttribute('src', 'www.google.com');
    expect(img).toHaveAttribute('alt', 'hello');
    cleanup();

    wrapper = render(<Avatar src="www.google1.com" username="test" />);
    img = wrapper.getByTestId('avatar-img');
    expect(img).toHaveAttribute('src', 'www.google1.com');
    expect(img).toHaveAttribute('alt', 'test');
  });

  it('should render correct username', () => {
    let wrapper = render(<Avatar username="tomorrow" />);
    expect(wrapper).toMatchSnapshot();
    let div = wrapper.getByTestId('avatar-div');
    expect(div).toHaveStyle('text-transform:uppercase');
    let username = wrapper.getByText('t');
    expect(username).toBeVisible();
    cleanup();
    wrapper = render(<Avatar username="明天" />);
    username = wrapper.getByText('明');
    expect(username).toBeVisible();
    cleanup();
  });
});
