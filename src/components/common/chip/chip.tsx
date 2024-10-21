import Checkmark from '../checkmark/checkmark';

export default function Chip({
  value,
  setValue,
  title,
  name,
}: {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
  title: string;
}) {
  return (
    <div className="chip">
      <Checkmark value={value} setValue={setValue} title={title} name={name} />
    </div>
  );
}
