import React, { forwardRef, PropsWithChildren, useEffect, useImperativeHandle } from 'react';
import './Dropdown.scss';
import { useDropdownContext } from '../../_context/dropdownProvider';
import { v4 as uuidv4 } from 'uuid';
import { ClosableHTMLElement } from '../../_context/dropdownProvider';

type Props = {
  isActive?: boolean
  classNames?: string
}

export const Dropdown = forwardRef((props: PropsWithChildren<Props>, ref: any) => {
  const { isActive, classNames, children } = props;
  const context = useDropdownContext();
  
  if (!context) { throw new Error('useDropdownContext() must be used within a DropdownProvider'); }

  const { registerDropdown, unregisterDropdown } = context;
  const elementRef = React.useRef<ClosableHTMLElement>(null);

  // Expose the close method to the parent component
  useImperativeHandle(ref, () => ({
    close: () => {
      console.log('trying to close')
      if (elementRef.current && elementRef.current.close) {
        console.log('Dropdown closed')
        elementRef.current.close();
      }
    }
  }));

  useEffect(() => {
    const uuid = uuidv4();

    registerDropdown(uuid, elementRef);
    return () => {
      unregisterDropdown(uuid);
    };
  }, []);

  return (
    <div className={`dropdown-menu ${classNames} ${isActive ? 'active' : ''}`} ref={elementRef}>
      {children}
    </div>
  )
})