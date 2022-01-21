import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const DownloadIcon: React.FC<IconSvg> = ({ fill, bgColor, width, height }) => (
  <Svg
    fill={fill}
    bgColor={bgColor}
    width={width}
    height={height}
    viewBox="0 0 1024 1024"
    path="M408 102.4l381.312 0c19.2 0 34.688 15.232 34.688 34.112l0 750.976c0 18.816-15.488 34.112-34.688 34.112L234.688 921.6c-19.136 0-34.688-15.296-34.688-34.112L200 307.2l208 0L408 102.4zM96 273.024l0 682.688C96 993.408 127.04 1024 165.312 1024l693.312 0c38.4 0 69.376-30.592 69.376-68.224L928 68.288C928 30.592 897.024 0 858.624 0L373.312 0 96 273.024zM442.688 477.824 442.688 614.4 329.6 614.4l182.656 180.928L696.128 614.4 581.376 614.4 581.376 477.824 442.688 477.824z"
  />
);

export default DownloadIcon;
