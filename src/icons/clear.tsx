import * as React from 'react';

function Clear(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path fill="transparent" d="M0 0h24v24H0z" />
      <path
        className="path"
        d="M8 8l8 8M16 8l-8 8"
        stroke="#323234"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoClear = React.memo(Clear);
export default MemoClear;
