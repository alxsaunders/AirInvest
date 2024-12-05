import React, { useState } from 'react';
import { IconBaseProps } from './types';
import { getIconPath } from './iconUtils';
import './Icon.css';

export const Icon: React.FC<IconBaseProps> = ({
  name,
  size = 24,
  color = 'white',
  className = '',
  onClick,
  style,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const iconPath = getIconPath(name);
  
  return (
    <div 
      className={`icon-wrapper ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      {...props}
    >
      <img 
        src={iconPath}
        alt={`${name} icon`}
        style={{
          width: '100%',
          height: '100%',
          filter: isHovered 
            ? 'invert(37%) sepia(98%) saturate(1906%) hue-rotate(205deg) brightness(101%) contrast(107%)' // Blue
            : color === 'white' 
              ? 'brightness(0) invert(1)' // White
              : undefined
        }}
      />
    </div>
  );
};

export default Icon;