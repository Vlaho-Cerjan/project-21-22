import React from 'react';
import type {ITooltip} from 'react-tooltip';
import {Tooltip} from 'react-tooltip';

import IsItMobile from '@/src/utils/IsItMobileDevice';

export default function ProjectTooltip({
  open,
  setOpen,
  ...props
}: ITooltip & {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  'data-testid'?: string;
}) {
  const [isMobile, setIsMobile] = React.useState(false);
  const startTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const endTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setIsMobile(IsItMobile());

    return () => {
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
      if (endTimeoutRef.current) clearTimeout(endTimeoutRef.current);
      setOpen(false);
    };
  }, []);

  React.useEffect(() => {
    // touchstart is used to detect mobile devices
    /* const touchstart = (e: TouchEvent) => {
      if (e.target) {
        if (
          (e.target as HTMLElement).getAttribute('data-tooltip-id') ===
            props.id ||
          (e.target as HTMLElement).closest(`[data-tooltip-id=${props.id}]`)
        ) {
        }
      }
    };

    const touchEnd = () => {};

    const touchMove = () => {};

    */
    const end = () => {
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
      if (endTimeoutRef.current) clearTimeout(endTimeoutRef.current);
      endTimeoutRef.current = setTimeout(() => {
        setOpen(false);
      }, 1000);
    };

    const mouseHover = (e: MouseEvent) => {
      if (e.target && e.target instanceof Element) {
        // if target is an svg with a parent that has a data-tooltip-id, then close the tooltip
        const svgTarget =
          (e.target.closest('svg') !== null ||
            (e.target as Element).tagName === 'svg' ||
            e.target.closest('[data-tooltip-id]')) &&
          !(
            (e.target as Element).getAttribute('data-tooltip-id') === props.id
          ) &&
          !(e.target as Element).closest(`[data-tooltip-id=${props.id}]`);
        if (svgTarget) {
          setOpen(false);
        }
        if (
          (e.target as Element).getAttribute('data-tooltip-id') === props.id ||
          (e.target as Element).closest(`[data-tooltip-id=${props.id}]`)
        ) {
          startTimeoutRef.current = setTimeout(() => {
            setOpen(true);
          }, 1500);
        }
      }
    };

    // document.addEventListener('touchstart', touchstart);
    // document.addEventListener('touchend', touchEnd);
    // document.addEventListener('touchmove', touchMove);
    if (!isMobile) {
      document.addEventListener('mouseover', mouseHover);
      document.addEventListener('mouseout', end);
    }

    return () => {
      // document.removeEventListener('touchstart', touchstart);
      // document.removeEventListener('touchend', touchEnd);
      // document.removeEventListener('touchmove', touchMove);
      if (!isMobile) {
        document.removeEventListener('mouseover', mouseHover);
        document.removeEventListener('mouseout', end);
        if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
        if (endTimeoutRef.current) clearTimeout(endTimeoutRef.current);
      }
      setOpen(false);
    };
  }, [props.content, isMobile]);

  React.useEffect(() => {
    if (open) {
      if (props['data-testid']) {
        const tooltip = document.getElementById(props.id || '');
        if (tooltip) {
          tooltip.setAttribute('data-testid', props['data-testid']);
        }
      }
    }
  }, [open]);

  return (
    <Tooltip
      {...props}
      data-testid={props['data-testid']}
      isOpen={props.isOpen ? props.isOpen && open : open}
      place={isMobile ? 'top-end' : props.place || 'bottom-end'}
      variant={props.variant || 'info'}
      delayShow={1500}
      delayHide={1500}
    />
  );
}
