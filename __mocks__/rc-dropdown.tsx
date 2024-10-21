import type {DropdownProps} from 'rc-dropdown/lib/Dropdown';
import React, {useState} from 'react';

const RcDropdownMock: React.FC<DropdownProps> = ({
  children,
  overlay,
  onVisibleChange,
  visible: propVisible,
  overlayClassName,
  trigger = ['click'],
  onOverlayClick,
  ...props
}) => {
  // Manage internal visibility state if the visible prop is not controlled.
  const [isVisible, setIsVisible] = useState(false);
  const isControlled = typeof propVisible !== 'undefined';
  const visible = isControlled ? propVisible : isVisible;

  const handleTrigger = (event: React.MouseEvent | React.KeyboardEvent) => {
    if (trigger.includes('click') && event.type === 'click') {
      const newVisible = !visible;
      if (!isControlled) setIsVisible(newVisible);
      onVisibleChange?.(newVisible);
    }
    // Handle other triggers as necessary.
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    onOverlayClick?.(e.nativeEvent);
  };

  return (
    <div {...props}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child as React.ReactElement<any>, {
          onClick: handleTrigger,
          onKeyDown: handleTrigger,
        }),
      )}
      {visible && (
        <button
          type="button"
          className={overlayClassName}
          onClick={handleOverlayClick}
          data-testid="rc-dropdown-overlay"
        >
          {typeof overlay === 'function' ? overlay() : overlay}
        </button>
      )}
    </div>
  );
};

export default RcDropdownMock;
