import * as React from 'react';

function Mcdonalds(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 70 62" fill="none" {...props}>
      <path
        d="M50.295 4.344c6.026 0 10.913 25.42 10.913 56.812H70C70 27.36 61.13 0 50.27 0 44.063 0 38.58 8.197 34.96 21.075 31.341 8.197 25.86 0 19.705 0 8.843 0 0 27.333 0 61.13h8.792c0-31.392 4.836-56.786 10.86-56.786 6.026 0 10.913 23.48 10.913 52.442h8.74c0-28.962 4.914-52.442 10.939-52.442"
        fill="#FC0"
      />
    </svg>
  );
}

const MemoMcdonalds = React.memo(Mcdonalds);
export default MemoMcdonalds;
