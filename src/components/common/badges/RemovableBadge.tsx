import { X } from "lucide-react";
import IconBadge from "./IconBadge";

type RemovableBadgeProps = {
  name: string;
  onClick: () => void;
};

export default function RemovableBadge({ name, onClick }: RemovableBadgeProps) {
  return (
    <IconBadge
      name={name}
      icon={X}
      onClick={onClick}
      ariaLabel={`Remove ${name}`}
    />
  );
}
