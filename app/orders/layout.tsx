import { getCurrentUser } from "@/lib/auth/current-user";
import { AccountShell } from "@/components/customer/account-shell";

export default async function OrdersLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return <AccountShell user={user?.type === "customer" ? user : null}>{children}</AccountShell>;
}
