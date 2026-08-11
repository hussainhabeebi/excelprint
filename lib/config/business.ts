/**
 * Business identity placeholders (spec sections 31/50 — never invent real
 * contact details, address, hours, or pricing). Values come from
 * environment variables so they can be set per-environment without a code
 * change; admin-editable overrides live in the `settings` table and should
 * take precedence once the admin settings screen exists (Phase 9+).
 */
export const businessConfig = {
  name: "Excel Printing",
  phone: process.env.NEXT_PUBLIC_EXCEL_PRINTING_PHONE || null,
  whatsapp: process.env.NEXT_PUBLIC_EXCEL_PRINTING_WHATSAPP || null,
  email: process.env.NEXT_PUBLIC_EXCEL_PRINTING_EMAIL || null,
  address: process.env.NEXT_PUBLIC_EXCEL_PRINTING_ADDRESS || null,
  mapsUrl: process.env.NEXT_PUBLIC_EXCEL_PRINTING_MAPS_URL || null,
  hours: process.env.NEXT_PUBLIC_EXCEL_PRINTING_HOURS || null,
  vatNumber: process.env.NEXT_PUBLIC_EXCEL_PRINTING_VAT_NUMBER || null,
} as const;
