import * as React from 'react';

function FilterOld(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <path
        d="M10.125 7.5a.75.75 0 000-1.5v1.5zM5.248 6a.75.75 0 000 1.5V6zM7.874 10.5a.75.75 0 100 1.5v-1.5zm4.877 1.5a.75.75 0 000-1.5v1.5zm-2.626-6.002H5.248v1.5h4.877V6zm1.876 1.313h-1.125v1.5H12v-1.5zm-1.125 0h-1.5a1.5 1.5 0 001.5 1.5v-1.5zm0 0V6.186h-1.5v1.126h1.5zm0-1.126v-1.5a1.5 1.5 0 00-1.5 1.5h1.5zm0 0H12v-1.5h-1.125v1.5zm1.125 0h1.5a1.5 1.5 0 00-1.5-1.5v1.5zm0 0v1.126h1.5V6.186h-1.5zm0 1.126v1.5a1.5 1.5 0 001.5-1.5h-1.5zM7.874 12h4.877v-1.5H7.874v1.5zM6 10.688h1.125v-1.5H6v1.5zm1.125 0h1.5a1.5 1.5 0 00-1.5-1.5v1.5zm0 0v1.126h1.5v-1.126h-1.5zm0 1.126v1.5a1.5 1.5 0 001.5-1.5h-1.5zm0 0H6v1.5h1.125v-1.5zm-1.125 0h-1.5a1.5 1.5 0 001.5 1.5v-1.5zm0 0v-1.126h-1.5v1.126h1.5zm0-1.126v-1.5a1.5 1.5 0 00-1.5 1.5h1.5z"
        fill="#323234"
      />
    </svg>
  );
}

const MemoFilterOld = React.memo(FilterOld);
export default MemoFilterOld;
