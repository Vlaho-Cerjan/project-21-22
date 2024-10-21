import * as React from 'react';

function FolderLarge(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 80 68" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.882 2a4 4 0 013.307 1.75l5.784 8.5A4 4 0 0040.28 14H66a8 8 0 018 8v9.074l.163.095a8 8 0 013.787 7.714l-2.222 20A8 8 0 0167.777 66H8.332A6.332 6.332 0 012 59.668V10a8 8 0 018-8"
        fill="#fff"
      />
      <path
        d="M74 31.085V22a8 8 0 00-8-8H40.28a4 4 0 01-3.307-1.75l-5.784-8.5A4 4 0 0027.883 2H10a8 8 0 00-8 8v49.668A6.332 6.332 0 008.332 66v0a6.332 6.332 0 006.294-5.633l2.583-23.25A8 8 0 0125.16 30H70a8 8 0 017.951 8.883l-2.222 20A8 8 0 0167.777 66H8.332"
        stroke="#C8C8CA"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoFolderLarge = React.memo(FolderLarge);
export default MemoFolderLarge;
