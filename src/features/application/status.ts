import {
  Award,
  Bookmark,
  CalendarCheck,
  Send,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type StatusConfig = {
  icon: LucideIcon;
  className: string;
  label: string;
};

export const statusConfig: Record<string, StatusConfig> = {
  saved: {
    icon: Bookmark,
    className: "bg-warning-bg text-warning",
    label: "Saved",
  },
  applied: {
    icon: Send,
    className: "bg-info-bg text-info",
    label: "Applied",
  },
  rejected: {
    icon: XCircle,
    className: "bg-danger-bg text-danger",
    label: "Rejected",
  },
  interview: {
    icon: CalendarCheck,
    className: "bg-success-bg text-success",
    label: "Interview",
  },
  offer_received: {
    icon: Award,
    className: "bg-brand-50 text-brand-600",
    label: "Offer Received",
  },
};
