import * as React from 'react';

function DownArrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.207 10a.5.5 0 00-.353.854l3.792 3.792a.5.5 0 00.708 0l3.792-3.792a.5.5 0 00-.353-.854H8.207z"
        fill="#323234"
      />
    </svg>
  );
}

const MemoDownArrow = React.memo(DownArrow);
export default MemoDownArrow;
