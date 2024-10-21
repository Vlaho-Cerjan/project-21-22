import * as React from 'react';

function Members(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          clipRule="evenodd"
          d="M16.333 21H4.667A1.667 1.667 0 013 19.333V7.667C3 6.746 3.746 6 4.667 6h11.667C17.254 6 18 6.746 18 7.667v11.667c0 .92-.746 1.666-1.667 1.666v0z"
        />
        <path d="M12.268 10.166a2.501 2.501 0 11-3.538 3.536 2.501 2.501 0 013.538-3.536M15 18.434a2.383 2.383 0 00-.594-.866v0a2.367 2.367 0 00-1.614-.634H8.208c-.6 0-1.174.227-1.614.634v0c-.26.241-.463.537-.594.866" />
        <path d="M6 6V4.667C6 3.746 6.746 3 7.667 3h11.667C20.254 3 21 3.746 21 4.667v11.667c0 .92-.746 1.666-1.667 1.666H18" />
      </g>
    </svg>
  );
}

const MemoMembers = React.memo(Members);
export default MemoMembers;
