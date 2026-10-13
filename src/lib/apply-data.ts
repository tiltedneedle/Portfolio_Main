/**
 * The apply funnel's words and lists, as the old apply.tiltedneedle.com
 * (a WordPress site) had them on 2026-10-13, read off its three pages:
 * the question, the two answers, the two forms and the five cities. The
 * site at apply.tiltedneedle.com now points here; the words are the
 * studio's and stay as written.
 */

export const PRICE_LINE = "Our services start from £15,000 per month. Is this within your budget?";
export const YES = "Yes, that works for us";
export const NO = "No, not right now";
export const CITIES = ["London", "Dubai", "Geneva", "Miami", "New York"];

export const ENQUIRY = {
  title: "Let's work together.",
  lead: "Tell us where to reach you and a member of the team will be in touch within one working day.",
  button: "Send enquiry",
  note: "We reply on WhatsApp, so please use a number you answer.",
};

export const REFERRAL = {
  title: "We are probably not the right fit at the moment.",
  lead: "We would still love to help. Leave your email below and we will introduce you to a trusted marketing agency that may be a better fit for your budget.",
  button: "Get a referral",
};

/** The dialling codes the old form offered, in its order, UK first. */
export const DIAL_CODES: Array<{ flag: string; code: string; country: string }> = [
  { flag: "🇬🇧", code: "+44", country: "United Kingdom" },
  { flag: "🇺🇸", code: "+1", country: "United States" },
  { flag: "🇨🇦", code: "+1", country: "Canada" },
  { flag: "🇦🇪", code: "+971", country: "United Arab Emirates" },
  { flag: "🇦🇺", code: "+61", country: "Australia" },
  { flag: "🇮🇪", code: "+353", country: "Ireland" },
  { flag: "🇫🇷", code: "+33", country: "France" },
  { flag: "🇩🇪", code: "+49", country: "Germany" },
  { flag: "🇪🇸", code: "+34", country: "Spain" },
  { flag: "🇮🇹", code: "+39", country: "Italy" },
  { flag: "🇳🇱", code: "+31", country: "Netherlands" },
  { flag: "🇧🇪", code: "+32", country: "Belgium" },
  { flag: "🇨🇭", code: "+41", country: "Switzerland" },
  { flag: "🇦🇹", code: "+43", country: "Austria" },
  { flag: "🇵🇹", code: "+351", country: "Portugal" },
  { flag: "🇸🇪", code: "+46", country: "Sweden" },
  { flag: "🇳🇴", code: "+47", country: "Norway" },
  { flag: "🇩🇰", code: "+45", country: "Denmark" },
  { flag: "🇫🇮", code: "+358", country: "Finland" },
  { flag: "🇵🇱", code: "+48", country: "Poland" },
  { flag: "🇬🇷", code: "+30", country: "Greece" },
  { flag: "🇲🇨", code: "+377", country: "Monaco" },
  { flag: "🇸🇦", code: "+966", country: "Saudi Arabia" },
  { flag: "🇶🇦", code: "+974", country: "Qatar" },
  { flag: "🇰🇼", code: "+965", country: "Kuwait" },
  { flag: "🇧🇭", code: "+973", country: "Bahrain" },
  { flag: "🇴🇲", code: "+968", country: "Oman" },
  { flag: "🇮🇱", code: "+972", country: "Israel" },
  { flag: "🇹🇷", code: "+90", country: "Turkey" },
  { flag: "🇪🇬", code: "+20", country: "Egypt" },
  { flag: "🇲🇦", code: "+212", country: "Morocco" },
  { flag: "🇿🇦", code: "+27", country: "South Africa" },
  { flag: "🇳🇬", code: "+234", country: "Nigeria" },
  { flag: "🇰🇪", code: "+254", country: "Kenya" },
  { flag: "🇮🇳", code: "+91", country: "India" },
  { flag: "🇵🇰", code: "+92", country: "Pakistan" },
  { flag: "🇨🇳", code: "+86", country: "China" },
  { flag: "🇭🇰", code: "+852", country: "Hong Kong" },
  { flag: "🇸🇬", code: "+65", country: "Singapore" },
  { flag: "🇲🇾", code: "+60", country: "Malaysia" },
  { flag: "🇮🇩", code: "+62", country: "Indonesia" },
  { flag: "🇹🇭", code: "+66", country: "Thailand" },
  { flag: "🇻🇳", code: "+84", country: "Vietnam" },
  { flag: "🇵🇭", code: "+63", country: "Philippines" },
  { flag: "🇯🇵", code: "+81", country: "Japan" },
  { flag: "🇰🇷", code: "+82", country: "South Korea" },
  { flag: "🇳🇿", code: "+64", country: "New Zealand" },
  { flag: "🇧🇷", code: "+55", country: "Brazil" },
  { flag: "🇲🇽", code: "+52", country: "Mexico" },
  { flag: "🇦🇷", code: "+54", country: "Argentina" },
  { flag: "🇨🇱", code: "+56", country: "Chile" },
  { flag: "🇨🇴", code: "+57", country: "Colombia" },
];
