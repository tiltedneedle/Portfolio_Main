import { useId } from "react";
import { HONEYPOT } from "@/lib/honeypot";

/**
 * A field for bots. It is visually hidden, hidden from screen readers and
 * out of the tab order, so people never fill it in; the contact route drops
 * any submission that arrives with it filled. Not display:none, which some
 * bots know to skip.
 */
export function Honeypot() {
  const id = useId();
  return (
    <div aria-hidden="true" className="sr-only">
      <label htmlFor={id}>Leave this field empty</label>
      <input id={id} name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}
