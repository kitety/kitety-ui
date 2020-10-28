import React, { PropsWithChildren, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { color, typography } from '../shared/style';
import { darken, rgba, opacify } from 'polished';
import { easing } from '../shared/animation';
import { sign } from 'crypto';

const img = new Image();
img.src = 'https://www.easyicon.net/api/resizeApi.php?id=1200841&size=32';
const source = [
  {
    value: '北京分行',
    children: [
      {
        value: '朝阳支行办事处',
        children: [{ value: '朝阳支行办事处-1' }, { value: '朝阳支行办事处-2' }],
      },
      { value: '海淀支行办事处' },
      { value: '石景山支行办事处' },
    ],
  },
  {
    value: '天津分行',
    children: [
      { value: '和平支行办事处' },
      { value: '河东支行办事处' },
      { value: '南开支行办事处' },
    ],
  },
];

interface ItemProps {
  value: string;
  level?: number;
  expand?: boolean;
  visible?: boolean;
  parent?: ItemProps;
  children?: ItemProps[];
  key?: string;
}
interface ItemPropsRequired extends Omit<Required<ItemProps>, 'children' | 'parent'> {
  children?: ItemPropsRequired[];
  parent: ItemPropsRequired;
}
// 将数据翻译为数组，并且设置一些默认值，通过level控制缩进
const flatten = function (
  list: Array<ItemProps>,
  level = 1,
  parent: ItemProps,
  defaultExpand = true,
): ItemPropsRequired[] {
  const arr: ItemPropsRequired[] = [];
  list.forEach((item) => {
    item.level = level;
    if (item.expand === undefined) {
      item.expand = defaultExpand;
    }
    if (item.visible === undefined) {
      item.visible = true;
    }
    if (!parent?.visible || !parent?.expand) {
      item.visible = false;
    }
    if (parent?.key == undefined) {
      item.key = item.value + Math.random();
    }
    item.parent = parent;
    arr.push(item as ItemPropsRequired);
    if (item['children']) {
      arr.push(...flatten(item['children'], level + 1, item, defaultExpand));
    }
  });
  return arr;
};

const root = { level: 0, visible: true, expand: true, children: source, value: 'root' };
export type TreeProps = {};

// 递归设置visible
const changeVisible = (item: ItemPropsRequired, callback: Function) => {
  // 给点击的children设置visible
  if (item.children) {
    let visible: boolean;
    // 避免children有显示行为不一致
    const depth = (item: ItemPropsRequired[]) => {
      item.forEach((v) => {
        if (visible === undefined) {
          visible = !v.visible;
        }
        v.visible = visible;
        if (v.children) {
          depth(v.children);
        }
      });
    };
    depth(item.children);
    callback();
  }
};
const checkParent = (g: ItemPropsRequired) => g.level === 1;
const levelSpace = 20;
const switchInsert = (diff: number, g: ItemPropsRequired) => {
  if (!isNaN(diff)) {
    const origin = g.level * 10; // 目标原本的padding
    if (diff < origin) {
      //移动到padding前全部算上级
      if (checkParent(g)) {
        // 排除最顶级
        return 2;
      }
      return 1;
    } else if (diff < origin + levelSpace) {
      return 2;
    } else {
      return 3;
    }
  } else {
    return 0;
  }
};

const findOrigin = (key: string, data: ItemPropsRequired[]): ItemPropsRequired | undefined => {
  const res = data.filter((v) => v.key === key);
  return res[0];
};
const getParent = (g: ItemPropsRequired) => {
  return g.parent?.parent || g.parent;
};
// 比较children
const judgeChildren = (origin: ItemPropsRequired, target: ItemPropsRequired) => {
  let sign = true; //如果有孩子就是false

  const fn = (child: ItemPropsRequired) => {
    if (child.children) {
      child.children.forEach((v) => {
        if (v === target) {
          sign = false;
          return;
        }
        fn(v);
      });
    }
  };
  fn(origin);
  return sign;
};
const changeOriginParent = (origin: ItemPropsRequired) => {
  const { parent } = origin;
  if (parent?.children) {
    const index = parent.children.indexOf(origin);
    if (index > -1) {
      parent.children.slice(index, 1);
    }
  }
};
const changeTargetParent = function (
  parent: ItemPropsRequired,
  origin: ItemPropsRequired,
  g: ItemPropsRequired,
) {
  origin.parent = parent;
  if (parent.children) {
    if (g.children) {
      const index = parent.children.indexOf(g);
      if (index > -1) {
        parent.children.splice(index + 1, 0, origin);
      } else {
        // parent 传递 g会进来
        parent.children.push(origin);
      }
    } else {
      parent.children.push(origin);
    }
  } else {
    parent.children = [origin];
  }
};

export function Tree(props: TreeProps) {
  const root = useMemo(() => {
    return {
      level: 0,
      visible: true,
      expand: true,
      children: source,
      value: 'root',
    };
  }, [source]);
  const [dragUpdate, setDragUpdate] = useState(0);
  const data = useMemo(() => {
    return flatten(root.children, 1, root);
  }, [root, dragUpdate]);
  const [start, setStart] = useState(0);
  const forceUpdate = useState(0)[1];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setStart(ref.current.getBoundingClientRect().left); //为了找到起始
    }
  }, []);

  const callback = () => {
    forceUpdate((state) => state + 1);
  };
  const dragCallback = () => {
    setDragUpdate((state) => state + 1);
  };

  return (
    <div ref={ref}>
      {data
        .filter((v) => v.visible)
        .map((g) => (
          <div
            draggable
            onClick={() =>
              changeVisible(g, () => {
                forceUpdate((state) => state + 1);
              })
            }
            key={g.key}
            style={{
              paddingLeft: `${10 * g.level}px`,
              cursor: 'pointer',
            }}
            onDragStart={(e) => {
              e.dataTransfer.setData('divkey', `${g.key}`);
              e.dataTransfer.setDragImage(img, 29, 29);
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              const key = e.dataTransfer.getData('divkey');
              const left = e.clientX;
              const diff = left - start;
              const res = switchInsert(diff, g);
              switch (res) {
                case 1:
                  // insertTop(key, g, data, dragCallback);
                  break;
                case 2:
                  // insertMiddle(key, g, data, dragCallback);
                  break;
                case 3:
                  // insertLower(key, g, data, dragCallback);
                  break;

                default:
                  break;
              }
            }}
          >
            {g.value}
          </div>
        ))}
    </div>
  );
}
