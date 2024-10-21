import * as React from 'react';

function EditMore(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        className="path"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          clipRule="evenodd"
          d="M20.05 14.293a1 1 0 00-1.414 0l-2.843 2.843a1 1 0 00-.293.707V20h2.157a1 1 0 00.707-.293l2.843-2.843a1 1 0 000-1.414l-1.157-1.157z"
        />
        <path d="M12 21H8a5 5 0 01-5-5V8a5 5 0 015-5h8a5 5 0 015 5v3" />
        <path d="M11.55 12a.05.05 0 110 0v0M15.05 12a.05.05 0 110 0v0M8.05 12a.05.05 0 110 0v0" />
      </g>
    </svg>
  );
}

const MemoEditMore = React.memo(EditMore);
export default MemoEditMore;
