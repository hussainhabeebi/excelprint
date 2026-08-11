import { NextResponse, type NextRequest } from "next/server";
import { registerCustomerSchema } from "@/lib/validation/auth";
import { AuthError, registerCustomer } from "@/lib/auth/customer-auth";
import { verifyTurnstileToken } from "@/lib/security/turnstile";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = registerCustomerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const ipAddress = request.headers.get("cf-connecting-ip") ?? undefined;

  const turnstileOk = await verifyTurnstileToken(parsed.data.turnstileToken, ipAddress);
  if (!turnstileOk) {
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });
  }

  try {
    const session = await registerCustomer(parsed.data, {
      ipAddress,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: session.expiresAt,
    });
    return response;
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    throw error;
  }
}
