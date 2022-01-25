import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const BanIcon: React.FC<IconSvg> = ({ fill, bgColor, width, height }) => (
  <Svg
    fill={fill}
    bgColor={bgColor}
    width={width}
    height={height}
    viewBox="0 0 1024 1024"
    path="M512 85.333333a426.666667 426.666667 0 1 0 426.666667 426.666667A426.666667 426.666667 0 0 0 512 85.333333z m0 768a341.333333 341.333333 0 0 1-341.333333-341.333333 337.92 337.92 0 0 1 72.106666-209.066667L721.066667 781.226667A337.92 337.92 0 0 1 512 853.333333z m269.226667-132.266666L302.933333 242.773333A337.92 337.92 0 0 1 512 170.666667a341.333333 341.333333 0 0 1 341.333333 341.333333 337.92 337.92 0 0 1-72.106666 209.066667z"
  />
);

export default BanIcon;
