import type { LucideIcon } from "lucide-react";

type IconTextProps = {
  icon: LucideIcon;
  iconClass?: string;
  text?: string;
};

export default function IconText({
  icon: Icon,
  iconClass,
  text,
}: IconTextProps) {
  return (
    <p className="flex items-center gap-2 wrap-break-word">
      {iconClass ? (
        <Icon size="1em" className={iconClass} />
      ) : (
        <Icon size="1em" />
      )}
      {text ? text : null}
    </p>
  );
}
