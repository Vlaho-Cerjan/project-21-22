import * as React from 'react';

function GridLayout(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 26 26" fill="none" {...props}>
      <rect x={1} y={1} width={24} height={24} rx={3} fill="#007DFF" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.222 11H6.778A1.777 1.777 0 015 9.222V6.778C5 5.796 5.795 5 6.778 5h2.444C10.204 5 11 5.796 11 6.778v2.444C11 10.204 10.204 11 9.222 11zM19.222 11h-2.445A1.777 1.777 0 0115 9.222V6.778C15 5.796 15.795 5 16.777 5h2.445C20.204 5 21 5.796 21 6.778v2.444c0 .982-.796 1.778-1.778 1.778zM9.222 21H6.778A1.777 1.777 0 015 19.222v-2.444C5 15.796 5.795 15 6.778 15h2.444c.982 0 1.778.796 1.778 1.778v2.444C11 20.204 10.204 21 9.222 21zM19.222 21h-2.445A1.777 1.777 0 0115 19.222v-2.444c0-.982.795-1.778 1.777-1.778h2.445c.982 0 1.778.796 1.778 1.778v2.444c0 .982-.796 1.778-1.778 1.778z"
        fill="#fff"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        className="strokeRect"
        x={1}
        y={1}
        width={24}
        height={24}
        rx={3}
        stroke="#007DFF"
        strokeWidth={2}
        strokeMiterlimit={0}
        strokeLinejoin="bevel"
      />
    </svg>
  );
}

const MemoGridLayout = React.memo(GridLayout);
export default MemoGridLayout;
