interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

/**
 * Shared shell for legal/policy pages. Content is drafted as a reasonable
 * starting template for a UAE printing e-commerce business, not
 * finalized legal advice — flagged via the notice below. Review with a
 * UAE-qualified legal advisor before treating any of it as binding.
 */
export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        This page is a standard template for a UAE printing business and has not been reviewed by a
        UAE-qualified legal advisor. Please have it reviewed before relying on it as binding.
      </div>

      <div className="prose prose-neutral mt-8 max-w-none prose-headings:font-semibold prose-a:text-brand">
        {children}
      </div>
    </div>
  );
}
