import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMosqueLegacy } from "@/components/icons/faMosqueLegacy";
import { cn } from "./cn";

/** The single loading mark used by every overlay in the app. */
export function LoadingMark({ className }: { className?: string }) {
  return (
    <div className={cn("app-loader-mark", className)} aria-hidden="true">
      <FontAwesomeIcon icon={faMosqueLegacy} className="app-loader-icon" />
    </div>
  );
}
