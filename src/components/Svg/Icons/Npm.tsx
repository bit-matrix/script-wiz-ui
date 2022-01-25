import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const NpmIcon: React.FC<IconSvg> = ({ fill, bgColor, width, height }) => (
  <Svg
    fill={fill}
    bgColor={bgColor}
    width={width}
    height={height}
    viewBox="0 0 1024 1024"
    path="M170.666667 426.666667v170.666666h85.333333v-128h42.666667v128h42.666666v-170.666666H170.666667m213.333333 0v213.333333h85.333333v-42.666667h85.333334v-170.666666H384m128 42.666666v85.333334h-42.666667v-85.333334h42.666667m85.333333-42.666666v170.666666h85.333334v-128h42.666666v128h42.666667v-128h42.666667v128h42.666666v-170.666666h-256M128 384h768v256h-384v42.666667H341.333333v-42.666667H128V384z"
  />
);

export default NpmIcon;
