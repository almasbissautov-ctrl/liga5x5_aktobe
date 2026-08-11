import { Send } from "lucide-react";
import Container from "@/components/ui/Container";
import JoinForm from "@/components/forms/JoinForm";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";

export default async function JoinPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return (
    <Container>
      <div className="py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue text-white">
            <Send className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold text-navy md:text-4xl">{dict.join.cta}</h1>
          <p className="mt-3 text-slate-600">
            Заполните форму — и мы свяжемся с капитаном по указанным контактам. {dict.common.season}.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-xl">
          <JoinForm />
        </div>
      </div>
    </Container>
  );
}
