import {createElement, type DetailedHTMLProps} from 'react';

export default function Title({
  children,
  className,
  component,
  ...props
}: DetailedHTMLProps<
  React.HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
> & {
  component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}) {
  return createElement(
    component || 'p',
    {
      ...props,
      className: `title${className ? ` ${className}` : ''}`,
    },
    children,
  );
}
