import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const CloseIcon: React.FC<IconSvg> = ({ fill, bgColor, width, height }) => (
  <Svg
    fill={fill}
    bgColor={bgColor}
    width={width}
    height={height}
    viewBox="0 0 16 16"
    path="M2.784 2.089l.069.058 5.146 5.147 5.146-5.147a.5.5 0 01.765.638l-.058.069L8.705 8l5.147 5.146a.5.5 0 01-.638.765l-.069-.058-5.146-5.147-5.146 5.147a.5.5 0 01-.765-.638l.058-.069L7.293 8 2.146 2.854a.5.5 0 01.638-.765z"
  />
);

export default CloseIcon;
