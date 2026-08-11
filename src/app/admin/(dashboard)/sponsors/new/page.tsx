import SponsorForm from "@/components/admin/SponsorForm";
import { createSponsor } from "@/lib/actions/sponsors";

export default function NewSponsorPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Новый спонсор</h1>
      <SponsorForm action={createSponsor} />
    </div>
  );
}
