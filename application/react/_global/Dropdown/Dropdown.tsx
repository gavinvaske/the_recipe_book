import React, { PropsWithChildren, useEffect, useImperativeHandle } from 'react';
import './Dropdown.scss';
import { Closable, useDropdownContext } from '../../_context/dropdownProvider';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  isActive?: boolean;
  className?: string;
  onClose?: () => void
};

export const Dropdown = (props: PropsWithChildren<Props>) => {
  const { isActive, className, children, onClose } = props;
  const context = useDropdownContext();
  const [isOpen, setIsOpen] = React.useState(isActive || false);
  
  if (!context) {
    throw new Error('useDropdownContext() must be used within a DropdownProvider');
  }

  const { registerDropdown, unregisterDropdown } = context;
  const elementRef = React.useRef<Closable>(null);

  useImperativeHandle(elementRef, () => ({
    close: () => {
      if (isOpen && elementRef.current) {
        setIsOpen(false);
        onClose && onClose();
      }
    }
  }));

  useEffect(() => {
    setIsOpen(isActive || false);
  }, [isActive]);

  useEffect(() => {
    const uuid = uuidv4();

    registerDropdown(uuid, elementRef);

    return () => {
      unregisterDropdown(uuid);
    };
  }, []);

  return (
    <div className={`dropdown-menu ${className} ${isOpen ? 'active' : ''}`} ref={elementRef}>
      {children}
    </div>
  );
};