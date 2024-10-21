import * as React from 'react';

function Attachment(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        className="path"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.9 11.832h-.01c-.59.76-.9 1.7-.9 2.66v0c0 2.48 2.01 4.49 4.5 4.49h5.5l-.01-.001c2.48 0 4.5-2.02 4.5-4.5 0-2.49-2.02-4.5-4.5-4.51h-2.81" />
        <path d="M20.1 12.168v-.01c.58-.77.89-1.71.89-2.67v0a4.5 4.5 0 00-4.5-4.5h-5.51c-2.49 0-4.5 2.01-4.5 4.5 0 2.48 2.01 4.5 4.5 4.49h2.8" />
      </g>
    </svg>
  );
}

const MemoAttachment = React.memo(Attachment);
export default MemoAttachment;
