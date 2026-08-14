import { notFound } from "next/navigation";
import { ReaderView } from "@/features/reader/ui/ReaderView";
import { getServices } from "@/lib/server/services";

export default async function ReaderPage({ params }: PageProps<"/reader/[id]">) {
  const { id } = await params;
  const document = await getServices().documentRepository.findById(id);
  if (!document) notFound();

  return <ReaderView document={document} />;
}
