import { Select } from "antd";

interface Props {
  allSeats: string[];
  reservedSeats: string[];
  selectedSeats: string[];
  onChange: (value: string[]) => void;
}

export default function SeatDropdown({
  allSeats,
  reservedSeats,
  selectedSeats,
  onChange,
}: Props) {
  const availableSeats = allSeats.filter(
    (seat: string) => !reservedSeats.includes(seat),
  );

  return (
    <Select
      mode="multiple"
      style={{ width: 300 }}
      placeholder="Select seats"
      value={selectedSeats}
      onChange={onChange}
      options={availableSeats.map((seat) => ({
        label: seat,
        value: seat,
      }))}
    />
  );
}
