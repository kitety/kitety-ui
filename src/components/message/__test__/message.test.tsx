import { fireEvent } from "@testing-library/react";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Button from "../../button";
import { createMessage, message, MessageType } from "../index";

let container: HTMLDivElement
beforeEach(() => {
  // 创建一个dom作为渲染目标
  container = document.createElement('div');
  document.body.appendChild(container)
})
const clean = () => {
  // 退出的清理
  unmountComponentAtNode(container)
}

afterEach(() => {
  clean()
})
const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(() => { resolve(); }, delay)
  })
}

async function changeIcon(type: MessageType) {
  clean();
  act(() => {
    render(< Button id="btn" onClick={() => message[type](<span className="test3">11</span>)
    } >btn</Button>, container)
  })
  const btn = container.querySelector('#btn');
  await act(async () => {
    fireEvent.click(btn!)
    await sleep(500)
  })
  expect(document.querySelector('.test3')).toBeTruthy()
  expect(container).toMatchSnapshot()
}
const fn = jest.fn();
describe("test Message component", () => {
  it("render basic func", async () => {
    act(() => {
      render(<Button id="btn" onClick={() => {
        message.default(<span className="test">11</span>)
      }}>btn</Button>, container)
    })
    const btn = container.querySelector('#btn')
    await act(async () => {
      fireEvent.click(btn!)
      await sleep(500)
    })
    expect(document.querySelector('.test')).toBeTruthy();
    expect(container).toMatchSnapshot()
    await act(async () => {
      await sleep(1500)
      expect(document.querySelector('.test')).toBeNull();
      expect(container).toMatchSnapshot()
    })
  })
  it('it can change color', async () => {
    act(() => {
      render(<Button id="btn" onClick={() => {
        message.default(<span className="test2">22</span>, { background: 'blue', color: 'red' })
      }}>btn</Button>, container)
    })
    const btn = container.querySelector('#btn');
    await act(async () => {
      fireEvent.click(btn!)
      await sleep(500)
    })
    expect(document.querySelector('.test2')).toBeTruthy();
    expect(container).toMatchSnapshot()
  })
  it('callback test', async () => {
    act(() => {
      render(<Button id="btn" onClick={() => {
        message.default(<span className="test2">22</span>, { callback: fn })
      }}>btn</Button>, container)
    })
    const btn = container.querySelector('#btn');
    expect(fn).not.toHaveBeenCalled()
    await act(async () => {
      fireEvent.click(btn!)
      await sleep(2100)
    })
    expect(fn).toHaveBeenCalled()
    expect(container).toMatchSnapshot()
  })
  it('can change icon', async () => {
    await changeIcon('default')
    await changeIcon('error')
    await changeIcon('info')
    await changeIcon('loading')
    await changeIcon('success')
    await changeIcon('warning')
  })
  it('icon type default', async () => {
    act(() => {
      render(<Button id="btn" onClick={() => {
        createMessage('asd' as MessageType)('ff')
      }}>btn</Button>, container)
    })
    const btn = container.querySelector('#btn');
    await act(async () => {
      fireEvent.click(btn!)
      await sleep(2100)
    })
    expect(container).toMatchSnapshot()
  })
  it('animate duration', async () => {
    act(() => {
      render(<Button id="btn" onClick={() => {
        message.default(<span className="callback">22</span>, { animationDuring: 1000, delay: 3000 })
      }}>btn</Button>, container)
    })
    const btn = container.querySelector('#btn');
    await act(async () => {
      fireEvent.click(btn!)
      await sleep(2100)
    })
    expect(container).toMatchSnapshot()
    await act(async () => {
      await sleep(1100)
    })
    expect(container).toMatchSnapshot()

  })
  it("animation lg delay", async () => {
    act(() => {
      render(
        <Button
          id="btn"
          onClick={() =>
            message.default(<span className="callback">22</span>, {
              animationDuring: 2000,
              delay: 1000,
            })
          }
        >
          but
				</Button>,
        container
      );
    });
    let btn = container.querySelector("#btn");
    await act(async () => {
      fireEvent.click(btn!);
      await sleep(1000);
    });
    expect(container).toMatchSnapshot();
  });
})