import * as React from 'react';

function Folder(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <path
        d="M15.75 8.453V6.75a1.5 1.5 0 00-1.5-1.5H9.428a.75.75 0 01-.62-.328L7.722 3.328A.75.75 0 007.103 3H3.75a1.5 1.5 0 00-1.5 1.5v9.313c0 .655.532 1.187 1.187 1.187v0c.605 0 1.114-.455 1.18-1.056l.485-4.36a1.5 1.5 0 011.49-1.334H15a1.5 1.5 0 011.49 1.666l-.416 3.75A1.5 1.5 0 0114.584 15H3.436"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoFolder = React.memo(Folder);
export default MemoFolder;
