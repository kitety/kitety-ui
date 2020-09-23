import React from 'react';
import { render as trender, fireEvent, cleanup, act } from '@testing-library/react';
import { Carousel } from '../index';
import { color, typography } from '../../shared/style';
import { unmountComponentAtNode, render } from 'react-dom';

const testAutoplay = function () {
  return (
    <Carousel height={300} autoplayDelay={1000}>
      <span id="test1">1</span>
      <span id="test2">2</span>
      <span id="test3">3</span>
    </Carousel>
  );
};

const testReverseAuto = function () {
  return (
    <Carousel height={300} autoplayDelay={1000} autoplayReverse>
      <span id="test1">1</span>
      <span id="test2">2</span>
      <span id="test3">3</span>
    </Carousel>
  );
};

const testHeight = function () {
  return (
    <Carousel height={100} autoplay={false}>
      <span id="test1">1</span>
      <span id="test2">2</span>
      <span id="test3">3</span>
    </Carousel>
  );
};
const testDefaultIndex = function () {
  return (
    <Carousel height={300} autoplay={false} defaultIndex={2}>
      <span id="test1">1</span>
      <span id="test2">2</span>
      <span id="test3">3</span>
    </Carousel>
  );
};

const testRadioColor = function () {
  return (
    <div>
      <Carousel height={100} autoplay={false} radioAppear="positive">
        <span id="test1">1</span>
        <span id="test2">2</span>
        <span id="test3">3</span>
      </Carousel>{' '}
      <Carousel height={100} autoplay={false}>
        <span id="test1">1</span>
        <span id="test2">2</span>
        <span id="test3">3</span>
      </Carousel>{' '}
      <Carousel height={100} autoplay={false} radioAppear="purple">
        <span id="test1">1</span>
        <span id="test2">2</span>
        <span id="test3">3</span>
      </Carousel>
    </div>
  );
};

const testTouch = function () {
  return (
    <Carousel height={100} autoplay={false}>
      <span id="test1" style={{ height: '100%', width: '100%' }}>
        1
      </span>
      <span id="test2" style={{ height: '100%', width: '100%' }}>
        2
      </span>
      <span id="test3" style={{ height: '100%', width: '100%' }}>
        3
      </span>
    </Carousel>
  );
};
const testOneItem = function () {
  return (
    <Carousel height={100} autoplay={false}>
      <span id="test1" style={{ height: '100%', width: '100%' }}>
        1
      </span>
    </Carousel>
  );
};
const testResize = function () {
  return (
    <Carousel height={100} autoplay={false}>
      <span id="test1" style={{ height: '100%', width: '100%' }}>
        1
      </span>
      <span id="test2" style={{ height: '100%', width: '100%' }}>
        2
      </span>
      <span id="test3" style={{ height: '100%', width: '100%' }}>
        3
      </span>
    </Carousel>
  );
};
const sleep = (delay: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, delay);
  });
};

let container: HTMLDivElement;
beforeEach(() => {
  // 创建一个DOM元素作为渲染目标
  container = document.createElement('div');
  document.body.appendChild(container);
});
afterEach(() => {
  unmountComponentAtNode(container);
});
describe('test Carousel component', () => {
  it('it should autoplay', async () => {
    act(() => {
      render(testAutoplay(), container);
    });
    // 默认索引0
    let text1 = container.querySelector('#test1');
    let text2 = container.querySelector('#test2');
    let text3 = container.querySelector('#test3');
    // 初始环境 只有1可以看见
    expect(text1?.textContent).toEqual('1');
    expect(text2).toBeNull();
    expect(text3).toBeNull();
    //自动播放速度为5000，jest超过5000的定时器直接报错,所以设置1000的定时器
    await act(async () => {
      await sleep(1000);
    });
    text2 = container.querySelector('#test2');
    expect(text2?.textContent).toEqual('2');
    text3 = container.querySelector('#test3');
    expect(text3).toBeNull();
    await act(async () => {
      await sleep(1000);
    });
    text3 = container.querySelector('#test3');
    expect(text3?.textContent).toEqual('3');
    text1 = container.querySelector('#test1');
    expect(text1).toBeNull();
    // 3-->1
    await act(async () => {
      await sleep(1000);
    });
    text1 = container.querySelector('#test1');
    expect(text1?.textContent).toEqual('1');
    text2 = container.querySelector('#test2');
    expect(text2).toBeNull();
  });
  it('should autoplay reverse', async () => {
    act(() => {
      render(testReverseAuto(), container);
    });
    // 默认索引0
    let text1 = container.querySelector('#test1');
    let text2 = container.querySelector('#test2');
    let text3 = container.querySelector('#test3');
    // 初始环境 只有1可以看见
    expect(text1?.textContent).toEqual('1');
    expect(text2).toBeNull();
    expect(text3).toBeNull();
    //3
    await act(async () => {
      await sleep(1000);
    });
    text2 = container.querySelector('#test2');
    text3 = container.querySelector('#test3');
    expect(text3?.textContent).toEqual('3');
    expect(text2).toBeNull();
    // 2
    await act(async () => {
      await sleep(1000);
    });
    text2 = container.querySelector('#test2');
    expect(text2?.textContent).toEqual('2');
    text1 = container.querySelector('#test1');
    expect(text1).toBeNull();
    //3后面直接跳1
    await act(async () => {
      await sleep(1000);
    });
    text1 = container.querySelector('#test1');
    expect(text1).toBeTruthy();
    text3 = container.querySelector('#test3');
    expect(text3).toBeNull();
  });
  it('should render correct height', () => {
    act(() => {
      render(testHeight(), container);
    });
    let text1 = container.querySelector('#test1');
    expect(text1?.parentElement).toHaveStyle('height:100px');
  });

  it('should render correct default index', () => {
    act(() => {
      render(testDefaultIndex(), container);
    });
    let text3 = container.querySelector('#test3');
    expect(text3).toBeTruthy();
    let text1 = container.querySelector('#test1');
    expect(text1).toBeNull();
  });
  it('should render correct when click radio', () => {
    act(() => {
      render(testDefaultIndex(), container);
    });
    const label = container.getElementsByTagName('label');
    // 默认3 3-->1
    fireEvent.click(label[0]);
    let text1 = container.querySelector('#test1');
    let text2 = container.querySelector('#test2');
    let text3 = container.querySelector('#test3');
    expect(text1).toBeTruthy();
    expect(text2).toBeNull();
    expect(text3).toBeTruthy();
    // 1-->2
    fireEvent.click(label[1]);
    text1 = container.querySelector('#test1');
    text2 = container.querySelector('#test2');
    text3 = container.querySelector('#test3');
    expect(text1).toBeTruthy();
    expect(text2).toBeTruthy();
    expect(text3).toBeNull();
    // 2-->2
    fireEvent.click(label[1]);
    text1 = container.querySelector('#test1');
    text2 = container.querySelector('#test2');
    text3 = container.querySelector('#test3');
    expect(text1).toBeTruthy();
    expect(text2).toBeTruthy();
    expect(text3).toBeNull();
  });
  it('should render correct radio style', () => {
    const wrapper = trender(testRadioColor());
    expect(wrapper).toMatchSnapshot();
  });
  it('should turn the page when touch', () => {
    act(() => {
      render(testTouch(), container);
    });
    let text1 = container.querySelector('#test1');
    let text2 = container.querySelector('#test2');
    fireEvent.touchStart(text1!, { touches: [{ clientX: 20 }] });
    fireEvent.touchEnd(text1!, { changedTouches: [{ clientX: 130 }] });
    // 1-3
    let text3 = container.querySelector('#test3');
    text2 = container.querySelector('#test2');
    expect(text2).toBeNull();
    expect(text3).toBeTruthy();
    // 3-2
    fireEvent.touchStart(text3!, { touches: [{ clientX: 20 }] });
    fireEvent.touchEnd(text3!, { changedTouches: [{ clientX: 130 }] });
    text2 = container.querySelector('#test2');
    text1 = container.querySelector('#test1');
    expect(text1).toBeNull();
    expect(text2).toBeTruthy();
    // 2-1
    fireEvent.touchStart(text2!, { touches: [{ clientX: 20 }] });
    fireEvent.touchEnd(text2!, { changedTouches: [{ clientX: 130 }] });
    text3 = container.querySelector('#test3');
    text1 = container.querySelector('#test1');
    expect(text3).toBeNull();
    expect(text1).toBeTruthy();
    // 1-2
    fireEvent.touchStart(text1!, { touches: [{ clientX: 130 }] });
    fireEvent.touchEnd(text1!, { changedTouches: [{ clientX: 20 }] });
    text1 = container.querySelector('#test1');
    text2 = container.querySelector('#test2');
    text3 = container.querySelector('#test3');
    expect(text1).toBeTruthy();
    expect(text2).toBeTruthy();
    expect(text3).toBeNull();
    // 2-3
    fireEvent.touchStart(text2!, { touches: [{ clientX: 130 }] });
    fireEvent.touchEnd(text2!, { changedTouches: [{ clientX: 20 }] });
    text1 = container.querySelector('#test1');
    text2 = container.querySelector('#test2');
    text3 = container.querySelector('#test3');
    expect(text2).toBeTruthy();
    expect(text3).toBeTruthy();
    expect(text1).toBeNull();
    fireEvent.touchStart(text2!, { touches: [{ clientX: 130 }] });
    fireEvent.touchEnd(text2!, { changedTouches: [{ clientX: 130 }] });
    text1 = container.querySelector('#test1');
    text2 = container.querySelector('#test2');
    text3 = container.querySelector('#test3');
    expect(text2).toBeTruthy();
    expect(text3).toBeTruthy();
    expect(text1).toBeNull();
  });
  it('should render one item', () => {
    const wrapper = trender(testOneItem());
    expect(wrapper).toMatchSnapshot();
  });
  it('should test resize', () => {
    act(() => {
      render(testResize(), container);
    });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(container).toMatchSnapshot();
  });
});
