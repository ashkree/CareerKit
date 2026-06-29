import type { LucideIcon } from "lucide-react";
import IconText from "../IconText";

type IconPillProps = {
  icon: LucideIcon;
  text: string;
  className?: string;
};

export default function IconPill({
  icon,
  text,
  className = "",
}: IconPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 py-0.5 px-3 rounded-full text-xs font-medium ${className}`}
    >
      <IconText icon={icon} text={text} />
    </span>
  );
}
