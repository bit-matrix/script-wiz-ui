import React from 'react';
import { SvgType } from './SvgType';
import './Svgstyle.scss';

export const Svg: React.FC<SvgType> = ({
  path,
  fill,
  bgColor,
  color,
  size,
  viewBox = '0 0 24 24',
  width = '2rem',
  height = '2rem',
  className = '',
  children,
}) => {
  const style = {
    fill: fill as 'fill',
    fontSize: size as 'fontSize',
    backgroundColor: bgColor as 'backgroundColor',
    color: color as 'color',
  };

  return (
    <svg className={`${className} svg-main`} style={style} viewBox={viewBox} width={width} height={height}>
      <path d={path} />
      {children}
    </svg>
  );
};
