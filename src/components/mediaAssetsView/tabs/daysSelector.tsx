import Chip from '../../common/chip/chip';

export default function DaysSelector({
  days,
  daysSelected,
  setDaysSelected,
}: {
  days: string[];
  daysSelected: string[];
  setDaysSelected: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <div className="daysContainer">
      {days.map((day) => (
        <Chip
          key={day}
          value={daysSelected.includes(day)}
          setValue={(value) => {
            if (value) {
              setDaysSelected((prev) => [...prev, day]);
            } else {
              setDaysSelected((prev) =>
                prev.filter((prevDay) => prevDay !== day),
              );
            }
          }}
          title={day}
          name={day}
        />
      ))}
    </div>
  );
}
