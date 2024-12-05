import { HTMLAttributes } from 'react';

export interface IconBaseProps extends HTMLAttributes<HTMLDivElement> {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export type IconName = 'flip';