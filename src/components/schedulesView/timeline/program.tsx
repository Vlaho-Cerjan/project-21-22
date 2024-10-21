import type {ProgramItem} from 'planby';
import {
  ProgramBox,
  ProgramContent,
  ProgramFlex,
  ProgramImage,
  ProgramStack,
  ProgramTitle,
  useProgram,
} from 'planby';

const CustomProgramItem = ({program, ...rest}: ProgramItem) => {
  const {styles, isLive, isMinWidth} = useProgram({
    program,
    ...rest,
  });

  const {data} = program;
  const {image, title, color} = data;

  // const sinceTime = formatTime(since);
  // const tillTime = formatTime(till);

  return (
    <ProgramBox width={styles.width} style={styles.position}>
      <ProgramContent
        style={{
          background: color,
          borderRadius: '6px',
        }}
        width={styles.width}
        isLive={isLive}
      >
        <ProgramFlex
          style={{
            alignItems: 'center',
          }}
        >
          {isLive && isMinWidth && <ProgramImage src={image} alt="Preview" />}
          <ProgramStack>
            <ProgramTitle>{title}</ProgramTitle>
          </ProgramStack>
        </ProgramFlex>
      </ProgramContent>
    </ProgramBox>
  );
};

export default CustomProgramItem;
