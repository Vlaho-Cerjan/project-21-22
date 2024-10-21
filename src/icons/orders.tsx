import * as React from 'react';

function Orders(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 19" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 17.209H3c-.53 0-1.04-.18-1.414-.502C1.21 16.385 1 15.949 1 15.495v-9c0-.71.672-1.286 1.5-1.286h13c.828 0 1.5.576 1.5 1.286v3.857" />
        <path d="M12.5 5.21v-.856c0-1.657-1.567-3-3.5-3v0c-1.933 0-3.5 1.343-3.5 3v.857" />
        <path
          clipRule="evenodd"
          d="M13.214 16.44l2.89-2.476a.388.388 0 00.13-.412.468.468 0 00-.35-.304l-4-.951a.56.56 0 00-.487.11.388.388 0 00-.128.417l1.11 3.428a.471.471 0 00.354.3.558.558 0 00.481-.111z"
        />
        <path d="M16.25 16.567l-1.591-1.364M9 10.354l-.5-.429M12.5 9.924l.5-.428M8 13.781l.5-.428" />
      </g>
    </svg>
  );
}

const MemoOrders = React.memo(Orders);
export default MemoOrders;
