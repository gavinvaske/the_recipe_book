import React, { PropsWithChildren } from 'react';
import './Dropdown.scss';

type Props = {
  isActive?: boolean
  classNames?: string
}

export const Dropdown = (props: PropsWithChildren<Props>) => {
  const { isActive, classNames, children } = props;

  return (
    <div className={`dropdown-menu ${classNames} ${isActive ? 'active' : ''}`}>
      {children}
    </div>
  )
}