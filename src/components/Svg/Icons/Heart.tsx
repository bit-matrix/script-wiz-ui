import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const HeartIcon: React.FC<IconSvg> = ({ fill, bgColor, width, height }) => (
  <Svg
    fill={fill}
    bgColor={bgColor}
    width={width}
    height={height}
    viewBox="0 0 1024 1024"
    path="M967.111111 199.111111c-31.288889-56.888889-227.555556-247.466667-455.111111 28.444445C273.066667-48.355556 88.177778 142.222222 56.888889 199.111111c-56.888889 105.244444-22.755556 264.533333 56.888889 341.333333l398.222222 398.222223 398.222222-398.222223c79.644444-76.8 113.777778-236.088889 56.888889-341.333333z"
  />
);

export default HeartIcon;
