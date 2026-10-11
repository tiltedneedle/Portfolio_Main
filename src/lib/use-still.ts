import { useSyncExternalStore } from "react";
import { isStill, onStillChange } from "@/lib/still";

/** Whether the visitor has paused the site's motion (lib/still.ts). False on
 *  the server and through hydration, then the real answer. */
export function useStill() {
  return useSyncExternalStore(onStillChange, isStill, () => false);
}
