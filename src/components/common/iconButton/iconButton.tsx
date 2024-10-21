import React from 'react';
import type {ITooltip} from 'react-tooltip';
import {useLongPress} from 'use-long-press';

import ProjectTooltip from '../../tooltip/tooltip';

export default function IconButton({
  icon,
  containerProps,
  prevEl,
  nextEl,
  tooltipProps,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  icon: React.ReactNode;
  containerProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
  prevEl?: React.ReactNode;
  nextEl?: React.ReactNode;
  tooltipProps?: ITooltip;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const callback = React.useCallback(() => {
    setIsOpen(true);
  }, []);
  const bind = useLongPress(callback, {
    onFinish: () => setIsOpen(false),
    onCancel: () => setIsOpen(false),
    filterEvents: () => true, // All events can potentially trigger long press (same as 'undefined')
    threshold: 500, // In milliseconds
    captureEvent: true, // Event won't get cleared after React finish processing it
    cancelOnMovement: 25, // Square side size (in pixels) inside which movement won't cancel long press
    cancelOutsideElement: true, // Cancel long press when moved mouse / pointer outside element while pressing
  });

  return (
    <div
      {...containerProps}
      className={`iconContainer${
        containerProps?.className ? ` ${containerProps.className}` : ''
      }`}
    >
      <button
        {...props}
        {...bind()}
        aria-label="icon button"
        type={props.type ? props.type : 'button'}
        className={`iconButton${props.className ? ` ${props.className}` : ''}`}
      >
        {prevEl}
        {icon}
        {nextEl}
      </button>
      <ProjectTooltip
        {...tooltipProps}
        open={isOpen}
        setOpen={setIsOpen}
        data-testid={
          tooltipProps?.id ? tooltipProps?.id : props['data-tooltip-id']
        }
        id={tooltipProps?.id ? tooltipProps?.id : props['data-tooltip-id']}
      />
    </div>
  );
}
