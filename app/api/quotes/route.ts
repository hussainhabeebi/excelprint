import { NextResponse, type NextRequest } from "next/server";
import { quoteRequestInputSchema } from "@/lib/validation/quotes";
import { createQuoteRequest } from "@/lib/quotes/mutations";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = quoteRequestInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const ipAddress = request.headers.get("cf-connecting-ip") ?? undefined;

  const turnstileOk = await verifyTurnstileToken(parsed.data.turnstileToken, ipAddress);
  if (!turnstileOk) {
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });
  }

  const { customerName, phone, email, company, productDescription, quantity, dimensions, material, deadline, description } =
    parsed.data;
  const quoteNumber = await createQuoteRequest({
    customerName,
    phone,
    email,
    company,
    productDescription,
    quantity,
    dimensions,
    material,
    deadline,
    description,
  });

  return NextResponse.json({ ok: true, quoteNumber });
}
