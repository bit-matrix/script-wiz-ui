import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const TrashIcon: React.FC<IconSvg> = ({ fill, bgColor, width, height }) => (
  <Svg
    fill={fill}
    bgColor={bgColor}
    width={width}
    height={height}
    viewBox="0 0 1024 1024"
    path="M960 256v32h-64v608a128 128 0 0 1-128 128H256a128 128 0 0 1-128-128V288H64V256H32V224a128 128 0 0 1 128-128h132.544A128 128 0 0 1 416 0h192a128 128 0 0 1 123.456 96H864a128 128 0 0 1 128 128v32h-32zM256 960h512a64 64 0 0 0 64-64V288H192l-4.448 608A68 68 0 0 0 256 960zM608 64h-192a63.808 63.808 0 0 0-55.104 32h302.176A63.808 63.808 0 0 0 608 64z m256 96H160a64 64 0 0 0-64 64h832a64 64 0 0 0-64-64zM320 416a32 32 0 0 1 32 32v352a32 32 0 0 1-64 0V448a32 32 0 0 1 32-32z m192 0a32 32 0 0 1 32 32v352a32 32 0 0 1-64 0V448a32 32 0 0 1 32-32z m192 0a32 32 0 0 1 32 32v352a32 32 0 0 1-64 0V448a32 32 0 0 1 32-32z"
  />
);

export default TrashIcon;
