import * as React from 'react';

function PlayButton(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 96 96" fill="none" {...props}>
      <circle cx={48} cy={48} r={48} fill="#1C1C1E" fillOpacity={0.76} />
      <path
        className="playIcon"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M38 37.336a5.351 5.351 0 012.665-4.643 5.182 5.182 0 015.29.067L63.45 43.424A5.354 5.354 0 0166 48a5.354 5.354 0 01-2.55 4.575L45.955 63.24a5.182 5.182 0 01-5.29.067A5.351 5.351 0 0138 58.664V37.336z"
        fill="#F6F6F6"
      />
    </svg>
  );
}

const MemoPlayButton = React.memo(PlayButton);
export default MemoPlayButton;
