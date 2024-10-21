import React from 'react';

import Counter from '@/src/components/common/counter/counter';
import MemoProjectPlayer from '@/src/icons/project-player';

export default function Devices({
  counter,
  setCounter,
}: {
  counter: number;
  setCounter:
    | ((number: number) => void)
    | React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="devices">
      <div className="orderImageContainer">
        <MemoProjectPlayer
          style={{
            width: '250px',
            height: '80px',
          }}
        />
      </div>
      <div className="counterContainer" style={{marginTop: '26px'}}>
        <Counter
          counter={counter}
          setCounter={setCounter}
          data-testid="projectPlayerCounter"
          max={5}
          min={1}
          maxLength={1}
          readOnly
          nextButtonClick={() => {
            if (counter < 5) setCounter(counter + 1);
          }}
          onChange={(e) => {
            // if value is bigger than 5, set to 5
            if (Number(e.currentTarget.value) > 5) {
              setCounter(5);
            }
          }}
        />
      </div>
    </div>
  );
}
