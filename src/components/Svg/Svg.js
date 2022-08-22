import React from 'react';
import './Svg.scss';

const Svg = ({ path, fill, bgColor, color, size, viewBox = '0 0 24 24', width = '2rem', height = '2rem', className = '', children }) => {
  const style = {
    fill: fill,
    fontSize: size,
    backgroundColor: bgColor,
    color: color,
  };

  return (
    <svg className={`${className} svg-main`} style={style} viewBox={viewBox} width={width} height={height}>
      <path d={path} />
      {children}
    </svg>
  );
};

export default Svg;
