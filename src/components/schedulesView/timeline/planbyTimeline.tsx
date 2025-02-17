import {
  TimelineBox,
  TimelineDivider,
  TimelineDividers,
  TimelineTime,
  TimelineWrapper,
  useTimeline,
} from 'planby';

interface TimelineProps {
  isBaseTimeFormat: boolean;
  isSidebar: boolean;
  dayWidth: number;
  hourWidth: number;
  numberOfHoursInDay: number;
  offsetStartHoursRange: number;
  sidebarWidth: number;
}

export function PlanbyTimeline({
  isBaseTimeFormat,
  isSidebar,
  dayWidth,
  hourWidth,
  numberOfHoursInDay,
  offsetStartHoursRange,
  sidebarWidth,
}: TimelineProps) {
  const {time, dividers, formatTime} = useTimeline(
    numberOfHoursInDay,
    isBaseTimeFormat,
  );

  const renderDividers = () =>
    dividers.map((_, index) => (
      <TimelineDivider key={index} width={hourWidth} />
    ));

  const renderTime = (index: number) => (
    <TimelineBox key={index} width={hourWidth}>
      <TimelineTime>
        {formatTime(index + offsetStartHoursRange).toLowerCase()}
      </TimelineTime>
      <TimelineDividers>{renderDividers()}</TimelineDividers>
    </TimelineBox>
  );

  return (
    <TimelineWrapper
      dayWidth={dayWidth}
      sidebarWidth={sidebarWidth}
      isSidebar={isSidebar}
    >
      {time.map((_, index) => renderTime(index))}
    </TimelineWrapper>
  );
}
