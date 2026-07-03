import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUpdateBySlug } from "@/lib/queries";
import { UpdateArticle } from "@/components/UpdateArticle";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const update = await getUpdateBySlug(params.slug);
  if (!update) return { title: "Atualização não encontrada" };
  return {
    title: update.title,
    description: update.short_summary ?? update.what_matters ?? undefined,
    openGraph: {
      title: update.title,
      description: update.short_summary ?? undefined,
      type: "article",
    },
  };
}

export default async function UpdatePage({
  params,
}: {
  params: { slug: string };
}) {
  const update = await getUpdateBySlug(params.slug);
  if (!update) notFound();
  return <UpdateArticle update={update} />;
}
