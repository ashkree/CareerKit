import type { LucideIcon } from "lucide-react";
import IconButton from "../buttons/IconButton";

type IconBadgeProps = {
  name: string;
  subtext?: string;
  icon: LucideIcon;
  onClick: () => void;
  ariaLabel?: string;
  className?: string;
};

export default function IconBadge({
  name,
  subtext,
  icon,
  onClick,
  ariaLabel,
  className = "py-1 px-2 rounded-lg text-sm bg-accent-amber-50 text-brand-900",
}: IconBadgeProps) {
  return (
    <li className={className}>
      <span className="flex gap-1 items-center">
        <div className="flex flex-col gap-0.5 flex-1">
          <p>{name}</p>
          {subtext && <p className="text-xs opacity-75">{subtext}</p>}
        </div>
        <IconButton
          icon={icon}
          onClick={onClick}
          ariaLabel={ariaLabel ?? `${name} action`}
          defaultStyle="text-text-secondary"
          hoverStyle="hover:bg-black/5"
        />
      </span>
    </li>
  );
}
