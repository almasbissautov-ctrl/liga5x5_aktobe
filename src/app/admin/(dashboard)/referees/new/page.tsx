import RefereeForm from "@/components/admin/RefereeForm";
import { createReferee } from "@/lib/actions/referees";

export default function NewRefereePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Новый судья</h1>
      <RefereeForm action={createReferee} />
    </div>
  );
}
