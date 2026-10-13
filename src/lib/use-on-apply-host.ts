"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { onApplyHost } from "@/lib/apply-host";

/**
 * Whether the page is on the apply subdomain, for components that write
 * links (lib/apply-host). False on the server and in the first render, so
 * the markup matches the server's; true from the first effect on the
 * subdomain, before anyone can click. Re-read on every route change, since
 * ApplyMark sets the mark in a layout effect of the funnel's own layout.
 */
export function useOnApplyHost() {
  const pathname = usePathname();
  const [on, setOn] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOn(onApplyHost());
  }, [pathname]);
  return on;
}
