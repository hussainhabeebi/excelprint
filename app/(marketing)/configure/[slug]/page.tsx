import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getConfiguratorSchema } from "@/lib/catalog/configurator-queries";
import { ProductConfigurator } from "@/components/configurator/product-configurator";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const schema = await getConfiguratorSchema(slug);
  return schema ? { title: `Configure ${schema.productName}` } : {};
}

export default async function ConfigurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const schema = await getConfiguratorSchema(slug);

  if (!schema) notFound();

  if (schema.options.length === 0 || schema.quantityTiers.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold">Configuration coming soon</h1>
        <p className="mt-2 text-muted-foreground">
          This product doesn&apos;t have its configuration options set up yet.{" "}
          <Link href="/quote" className="text-brand hover:underline">
            Request a custom quote
          </Link>{" "}
          in the meantime.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href={`/product/${schema.productSlug}`} className="hover:text-foreground">
          {schema.productName}
        </Link>
      </nav>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight sm:text-3xl">Configure {schema.productName}</h1>
      <ProductConfigurator schema={schema} />
    </div>
  );
}
