import * as React from 'react';

function ListView(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 6.44h11M20 12H9M9 17.56h11M4.5 5.939v0a.5.5 0 10.5.5v0a.5.5 0 00-.5-.5M4.5 11.5v0a.5.5 0 10.5.5v0a.5.5 0 00-.5-.5M4.5 17.061v0a.5.5 0 10.5.5v0a.5.5 0 00-.5-.5" />
      </g>
    </svg>
  );
}

const MemoListView = React.memo(ListView);
export default MemoListView;
