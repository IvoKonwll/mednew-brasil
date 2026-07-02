import type { Metadata } from "next";
import { IssueView } from "@/components/IssueView";
import { yesterdayISO, formatLongDate } from "@/lib/date";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return {
    title: `Boletim de ontem — ${formatLongDate(yesterdayISO())}`,
    description: "A edição médica de ontem, revisitada.",
  };
}

export default function OntemPage() {
  return <IssueView date={yesterdayISO()} />;
}
