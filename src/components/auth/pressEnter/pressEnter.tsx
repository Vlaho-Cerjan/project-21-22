import MemoEnter from '@/src/icons/enter';

import Text from '../../common/text/text';

export default function PressEnter() {
  return (
    <>
      <Text data-testid="pressEnterText" className="greyText">
        Press <Text>Enter</Text>
      </Text>
      <div
        style={{
          marginLeft: '5px',
        }}
      >
        <MemoEnter
          data-testid="enterIcon"
          style={{
            width: '9.75px',
            height: '8.75px',
          }}
        />
      </div>
    </>
  );
}
