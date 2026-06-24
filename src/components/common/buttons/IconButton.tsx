import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import IconText from "../IconText";

type IconButtonProps = {
  icon: LucideIcon;
  activeIcon?: LucideIcon;

  text?: string;
  activeText?: string;

  onClick: () => void | Promise<void>;

  defaultStyle?: string;
  hoverStyle?: string;
  activeStyle?: string;

  isActive?: boolean;
  activeDuration?: number;

  ariaLabel?: string;
};

export default function IconButton({
  icon,
  activeIcon,
  text,
  activeText,
  onClick,
  defaultStyle = "",
  hoverStyle = "",
  activeStyle = "",
  isActive,
  activeDuration,
  ariaLabel,
}: IconButtonProps) {
  const [internalActive, setInternalActive] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const active = isActive ?? internalActive;

  const DisplayIcon = active && activeIcon ? activeIcon : icon;
  const displayText = active ? (activeText ?? text) : text;

  const handleClick = async () => {
    await onClick();

    if (activeDuration) {
      setInternalActive(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setInternalActive(false);
      }, activeDuration);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`p-1.5 rounded-md transition-colors duration-200 ${
        active ? activeStyle : defaultStyle
      } ${active ? "" : hoverStyle}`}
      onClick={handleClick}
    >
      <span className="flex items-center gap-2">
        <IconText text={displayText} icon={DisplayIcon} />
      </span>
    </button>
  );
}
