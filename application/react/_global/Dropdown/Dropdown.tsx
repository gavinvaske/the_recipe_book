import React, { forwardRef, PropsWithChildren, useEffect, useImperativeHandle } from 'react';
import './Dropdown.scss';
import { useUIContext } from '../../_context/UIProvider';
import { v4 as uuidv4 } from 'uuid';
import { ClosableHTMLElement } from '../../_context/UIProvider';


type Props = {
  isActive?: boolean
  classNames?: string
}

export const Dropdown = forwardRef((props: PropsWithChildren<Props>, ref: any) => {
  const { isActive, classNames, children } = props;
  const elementRef = React.useRef<ClosableHTMLElement>();
  const { registerUIElement, unregisterUIElement } = useUIContext();
  const [id, setId] = React.useState<string | null>(null);

  // Expose the close method to the parent component
  useImperativeHandle(ref, () => ({
    close: () => {
      if (elementRef.current && elementRef.current.close) {
        alert('Dropdown closed')
        elementRef.current.close();
      }
    }
  }));

  useEffect(() => {
    if (id) return;
    let uuid = uuidv4();
    setId(uuid);
    registerUIElement(uuid, elementRef);
    return () => {
      unregisterUIElement(uuid);
    };
  }, [registerUIElement, unregisterUIElement]);

  return (
    <div className={`dropdown-menu ${classNames} ${isActive ? 'active' : ''}`}>
      {children}
    </div>
  )
})