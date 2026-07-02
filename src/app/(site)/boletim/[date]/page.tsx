import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IssueView } from "@/components/IssueView";
import { formatLongDate, isValidISODate } from "@/lib/date";
import { getIssueByDate } from "@/lib/queries";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { date: string };
}): Promise<Metadata> {
  if (!isValidISODate(params.date)) return { title: "Boletim" };
  const issue = await getIssueByDate(params.date);
  const dateLabel = formatLongDate(params.date);
  return {
    title: issue?.title ?? `Boletim de ${dateLabel}`,
    description:
      issue?.intro ?? `Edição médica de ${dateLabel}: avanços, evidência e impacto prático.`,
  };
}

export default function BoletimPage({
  params,
}: {
  params: { date: string };
}) {
  if (!isValidISODate(params.date)) {
    notFound();
  }
  return <IssueView date={params.date} />;
}
