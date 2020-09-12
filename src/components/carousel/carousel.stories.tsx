import React from 'react';
import { Carousel } from './';
import { withKnobs, text, boolean, color, select, number } from '@storybook/addon-knobs';

export default {
  title: 'Carousel',
  component: Carousel,
  decorators: [withKnobs],
};

export const demo = () => (
  <div>
    <Carousel autoplay speed={20}>
      <div style={{ height: '100%', width: '100%', background: 'red' }}>1</div>
      <div style={{ height: '100%', width: '100%', background: 'blue' }}>2</div>
      <div style={{ height: '100%', width: '100%', background: 'yellow' }}>3</div>
      <div style={{ height: '100%', width: '100%' }}>4</div>
    </Carousel>
  </div>
);
const DivElement = (height: number, index: number) => {
  return (
    <div
      style={{
        background: '#364d79',
      }}
      key={index}
    >
      <span
        style={{
          lineHeight: `${height}px`,
          color: 'white',
          fontSize: '20px',
          fontWeight: 800,
          width: '100%',
          textAlign: 'center',
          display: 'inline-block',
        }}
      >
        {index + 1}
      </span>
    </div>
  );
};
export const knobsCarousel = () => {
  const height = number('height', 300);
  const num = number('item number', 4);
  return (
    <div>
      <Carousel
        delay={number('delay', 300)}
        height={height}
        radioAppear={select(
          'radioAppear',
          Object.keys(color) as Array<keyof typeof color>,
          'primary',
        )}
        defaultIndex={number('defaultIndex', 0)}
        autoplay={boolean('autoplay', true)}
        viewportBoxshadow={text('viewportBoxshadow', '2px 2px 4px #d9d9d9')}
        autoplayReverse={boolean('autoplayReverse', false)}
        speed={number('speed', 500)}
        autoplayDelay={number('autoplayDelay', 5000)}
      >
        {new Array(4).fill(300).map((v, i) => DivElement(v, i))}
      </Carousel>
    </div>
  );
};
