import type {ICellRendererParams} from 'ag-grid-enterprise';

export default function RewardRenderer(props: ICellRendererParams) {
  const {value} = props;

  // get value from string that is value% and convert it to the closest 10
  const rewardValue = value
    ? Math.round(Number(value.replace('%', '')) / 10) * 10
    : 0;

  return (
    props.value && (
      <span className="rewardTrackerContainer">
        <span
          className={`rewardTracker progress-${rewardValue}`}
          style={{
            width: props.value,
          }}
        />
      </span>
    )
  );
}
