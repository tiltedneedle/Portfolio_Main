"use client";

import { useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { CutLink } from "@/components/room/CutLink";
import { ApplyLink } from "@/components/ApplyLink";
import { Honeypot } from "@/components/Honeypot";
import { HONEYPOT } from "@/lib/honeypot";
import { submitForm } from "@/lib/submit-form";
import { EASE_OUT_EXPO, SETTLED, lifted } from "@/lib/design-tokens";
import { DIAL_CODES, ENQUIRY, REFERRAL } from "@/lib/apply-data";
import { cn } from "@/lib/utils";

/**
 * The apply funnel's two forms, one component: the enquiry from someone
 * whose budget fits (name, email, phone, Instagram, brand, goals) and the
 * referral request from someone whose does not (name, email, phone). The
 * words are the old apply site's (lib/apply-data); the fields are the
 * site's underline fields, as on the contact form and the careers form.
 * The phone is a dialling code and a number, because the studio replies
 * on WhatsApp. "Back" is a cut to the question.
 */
const fieldClass =
  "w-full rounded-none border-0 border-b border-[color:var(--rule-strong)] bg-transparent px-0 py-3 text-[17px] text-[color:var(--ink)] outline-none transition-colors duration-300 placeholder:text-[color:var(--ink-faint)] focus:border-[color:var(--ink)]";
const labelClass = "mono mb-3 block";
const selectClass = cn(fieldClass, "cursor-pointer appearance-none pr-8 [&>option]:bg-[#141416] [&>option]:py-2 [&>option]:text-[#f2efe9]");

export function ApplyForm({ kind }: { kind: "enquiry" | "referral" }) {
  const copy = kind === "enquiry" ? ENQUIRY : REFERRAL;
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  // The mailto fallback is a hand-off, not a send. Say so rather than claiming delivery.
  const [handedOff, setHandedOff] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) || "").trim();
    const result = await submitForm({
      type: kind,
      name: [field("first"), field("last")].filter(Boolean).join(" "),
      email: field("email"),
      code: field("code"),
      phone: field("phone"),
      handle: field("handle"),
      company: field("company"),
      message: field("message"),
      trap: String(data.get(HONEYPOT) || ""),
    });
    setSubmitting(false);
    if (result.ok) {
      setHandedOff(result.handedOff);
      setSent(true);
    } else setError(result.error);
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <m.div
          key="success"
          role="status"
          initial={lifted(16, reduced)}
          animate={SETTLED}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="border-t border-[color:var(--rule)] py-14"
        >
          <h2 className="display text-[clamp(40px,5vw,72px)]">
            {handedOff ? (
              <span>
                Almost <span className="em-serif">there.</span>
              </span>
            ) : kind === "enquiry" ? (
              <span>
                Enquiry <span className="em-serif">sent.</span>
              </span>
            ) : (
              <span>
                Request <span className="em-serif">sent.</span>
              </span>
            )}
          </h2>
          <p className="mt-5 max-w-[48ch] text-[17px] leading-relaxed text-[color:var(--ink-mid)]">
            {handedOff
              ? "Your email app has opened with the message ready. Send it and a member of the team will be in touch within one working day."
              : "A member of the team will be in touch within one working day."}
          </p>
          {/* CutLink sends "/" to www from the subdomain (lib/apply-host) */}
          <CutLink href="/" className="slate-link mt-10 inline-block text-[13px] text-[color:var(--ink)]" data-cursor="Cut">
            &larr; Back to the site
          </CutLink>
        </m.div>
      ) : (
        <m.form
          key="form"
          onSubmit={onSubmit}
          initial={lifted(16, reduced)}
          animate={SETTLED}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="grid grid-cols-1 gap-x-10 gap-y-7 border-t border-[color:var(--rule)] pt-12 md:grid-cols-2"
        >
          <Honeypot />
          <div>
            <label htmlFor="ap-first" className={labelClass}>
              Name
            </label>
            <input id="ap-first" name="first" type="text" required autoComplete="given-name" placeholder="Alex" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="ap-last" className={labelClass}>
              Last name
            </label>
            <input id="ap-last" name="last" type="text" required autoComplete="family-name" placeholder="Whitfield" className={fieldClass} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="ap-email" className={labelClass}>
              Email
            </label>
            <input id="ap-email" name="email" type="email" required autoComplete="email" placeholder="alex@brand.com" className={fieldClass} />
          </div>
          <div className="grid grid-cols-[minmax(0,9.5rem)_1fr] gap-x-6 md:col-span-2 md:grid-cols-[minmax(0,11rem)_1fr] md:gap-x-10">
            <div>
              <label htmlFor="ap-code" className={labelClass}>
                Code
              </label>
              <div className="relative">
                {/* The closed box shows flag and code, as the old form did;
                    the country is in the open list (the box is too narrow
                    for "United Kingdom", and the flag may draw as "GB"). */}
                <select id="ap-code" name="code" required defaultValue="+44" autoComplete="tel-country-code" aria-label="Country code" className={selectClass}>
                  {DIAL_CODES.map((c) => (
                    <option key={c.country} value={c.code} label={`${c.flag} ${c.code}`}>
                      {c.flag} {c.code} {c.country}
                    </option>
                  ))}
                </select>
                <span aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[12px] text-[color:var(--ink-mid)]">
                  &#9662;
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="ap-phone" className={labelClass}>
                Phone number
              </label>
              <input id="ap-phone" name="phone" type="tel" required autoComplete="tel-national" inputMode="tel" placeholder="7700 900123" className={fieldClass} />
            </div>
          </div>
          {kind === "enquiry" && (
            <>
              <div>
                <label htmlFor="ap-handle" className={labelClass}>
                  Instagram handle
                </label>
                <input id="ap-handle" name="handle" type="text" autoComplete="off" placeholder="@yourbrand" className={fieldClass} />
              </div>
              <div>
                <label htmlFor="ap-company" className={labelClass}>
                  Company or brand
                </label>
                <input id="ap-company" name="company" type="text" autoComplete="organization" placeholder="Brand name" className={fieldClass} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="ap-message" className={labelClass}>
                  What are you looking to achieve?
                </label>
                <textarea id="ap-message" name="message" rows={4} placeholder="A few lines on your goals" className={cn(fieldClass, "resize-none")} />
              </div>
            </>
          )}

          <div className="flex flex-wrap items-center gap-6 pt-2 md:col-span-2">
            <button type="submit" disabled={submitting} className="pill pill-solid px-8 py-3.5 text-[15px] disabled:opacity-60">
              {submitting ? "Sending" : copy.button}
            </button>
            <span className={submitting ? "lamp" : "hidden"} aria-hidden="true" />
            <ApplyLink step="" className="slate-link text-[13px]">
              &larr; Back
            </ApplyLink>
            <p aria-live="polite" className="text-[13px] text-[color:var(--ink-mid)]">
              {error}
            </p>
          </div>
          {kind === "enquiry" && <p className="mono text-[color:var(--ink-mid)] md:col-span-2">{ENQUIRY.note}</p>}
        </m.form>
      )}
    </AnimatePresence>
  );
}
