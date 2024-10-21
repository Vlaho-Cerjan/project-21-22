import MemoCheck from '@/src/icons/check';
import MemoCheckTick from '@/src/icons/check-tick';

export default function Checkmark({
  value,
  setValue,
  name,
  parentName,
  title,
  label,
  type,
}: {
  value: boolean;
  setValue: (value: boolean) => void;
  name?: string;
  parentName?: string;
  title?: string;
  label?: string;
  type?: string;
}) {
  return (
    <div className="checkmarkContainer">
      <button
        data-testid={`checkmarkButton_${name}`}
        type="button"
        className="checkmark"
        onClick={() => setValue(!value)}
      >
        <span className="checkmarkMarkContainer">
          <MemoCheck />
          {value ? (
            <MemoCheckTick
              data-testid="checkmarkTick"
              className="checkmarkTick"
              style={{
                width: '8px',
                height: '7px',
              }}
            />
          ) : null}
        </span>
        <span className="checkmarkTitle">{title}</span>
      </button>
      <input
        aria-label={label}
        data-testid="checkmarkInput"
        hidden
        id={name}
        type={type || 'checkbox'}
        readOnly
        checked={value}
        name={parentName || name}
      />
    </div>
  );
}
