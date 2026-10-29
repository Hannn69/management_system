import { TaskDetailPageClient } from "@/components/dashboard/TaskDetailPageClient";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <TaskDetailPageClient slug={slug} />;
}
