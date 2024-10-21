import * as React from 'react';

function RightGrey(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        className="path"
        d="M10.121 16.879L13 14a3 3 0 000-4.243L10.12 6.88"
        stroke="#323234"
        strokeOpacity={1}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoRightGrey = React.memo(RightGrey);
export default MemoRightGrey;
