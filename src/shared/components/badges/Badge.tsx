type BadgeProps = {
  name: string;
};

export default function Badge({ name }: BadgeProps) {
  return (
    <li
      key={name}
      className="py-1 px-2 rounded-lg text-sm bg-accent-amber-50 text-brand-900"
    >
      {name}
    </li>
  );
}
