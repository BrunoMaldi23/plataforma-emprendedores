import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { OfferingsManager } from "@/features/dashboard/components/offerings-manager";
import { getDemoBusiness, getOfferingsFor } from "@/lib/repository";

export const metadata: Metadata = { title: "Productos y servicios" };

export default function OfferingsPage() {
  const business = getDemoBusiness();
  return (
    <>
      <PageHeader title="Productos y servicios" description="Lo que ofreces, con precio referencial o «a cotizar»." />
      <OfferingsManager businessId={business.id} initial={getOfferingsFor(business.id)} />
    </>
  );
}
