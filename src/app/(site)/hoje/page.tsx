import type { Metadata } from "next";
import { IssueView } from "@/components/IssueView";
import { todayISO, formatLongDate } from "@/lib/date";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return {
    title: `Boletim de hoje — ${formatLongDate(todayISO())}`,
    description:
      "A edição médica de hoje: o que saiu, como funciona e se muda conduta no Brasil.",
  };
}

export default function HojePage() {
  return <IssueView date={todayISO()} />;
}
