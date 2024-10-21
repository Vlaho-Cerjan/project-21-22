import * as React from 'react';

function DropDownRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.125 11.918a.5.5 0 00.854.353L10.52 9.73a.5.5 0 000-.708L7.98 6.48a.5.5 0 00-.854.353v5.086z"
        fill="#69696A"
      />
    </svg>
  );
}

const MemoDropDownRight = React.memo(DropDownRight);
export default MemoDropDownRight;
