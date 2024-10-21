import * as React from 'react';

function Play(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 8 8" fill="none" {...props}>
      <path
        clipRule="evenodd"
        d="M1 2c0-.36.218-.693.571-.87a1.248 1.248 0 011.134.013l3.749 2c.339.18.546.506.546.857s-.207.677-.546.858l-3.75 2c-.347.185-.78.19-1.133.012C1.218 6.693 1 6.36 1 6V2z"
        stroke="#707071"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoPlay = React.memo(Play);
export default MemoPlay;
