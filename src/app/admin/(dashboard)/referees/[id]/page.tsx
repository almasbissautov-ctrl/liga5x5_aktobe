import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import RefereeForm from "@/components/admin/RefereeForm";
import { updateReferee } from "@/lib/actions/referees";

export default async function EditRefereePage({ params }: { params: { id: string } }) {
  const referee = await prisma.referee.findUnique({ where: { id: params.id } });
  if (!referee) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Судья: {referee.fullName}</h1>
      <RefereeForm action={updateReferee.bind(null, referee.id)} defaultValues={referee} />
    </div>
  );
}
