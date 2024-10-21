import * as React from 'react';

function Filter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 14 15" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8.875 10v2.343c0 .43-.293.806-.71.91l-1.875.469a.938.938 0 01-1.165-.91V8.125L1.22 4.22A.748.748 0 011 3.69V1.75A.75.75 0 011.75 1h10.5a.75.75 0 01.75.75v.75" />
        <path d="M8.5 5.5L10 7l2.25-2.25" />
      </g>
    </svg>
  );
}

const MemoFilter = React.memo(Filter);
export default MemoFilter;
