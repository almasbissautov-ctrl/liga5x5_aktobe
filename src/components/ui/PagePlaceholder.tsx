import type { LucideIcon } from "lucide-react";
import Container from "./Container";

type Props = {
  icon: LucideIcon;
  kicker?: string;
  title: string;
  description: string;
  badgeLabel: string;
};

export default function PagePlaceholder({ icon: Icon, kicker, title, description, badgeLabel }: Props) {
  return (
    <Container>
      <div className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-white">
            <Icon className="h-8 w-8" strokeWidth={1.75} />
          </div>
          {kicker && (
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue">{kicker}</p>
          )}
          <h1 className="text-3xl font-bold text-navy md:text-4xl">{title}</h1>
          <p className="mt-4 text-base text-slate-600 md:text-lg">{description}</p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
            {badgeLabel}
          </div>
        </div>
      </div>
    </Container>
  );
}
