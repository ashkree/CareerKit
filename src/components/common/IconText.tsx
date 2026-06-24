import type { LucideIcon } from "lucide-react";

type IconTextProps = {
  icon: LucideIcon;
  text?: string;
};

export default function IconText({ icon: Icon, text }: IconTextProps) {
  return (
    <p className="flex items-center gap-2 wrap-break-word">
      <Icon size="1em" />
      {text ? text : null}
    </p>
  );
}
