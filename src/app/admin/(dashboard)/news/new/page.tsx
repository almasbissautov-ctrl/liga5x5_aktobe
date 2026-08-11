import NewsForm from "@/components/admin/NewsForm";
import { createNews } from "@/lib/actions/news";

export default function NewNewsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Новая новость</h1>
      <NewsForm action={createNews} />
    </div>
  );
}
