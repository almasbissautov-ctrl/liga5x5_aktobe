import Image from "next/image";
import { cn } from "@/lib/cn";

export default function LogoBadge({
  size = 44,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-sm",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/logo.png"
        alt="Лига 5×5 Актобе"
        width={size}
        height={size}
        className="h-full w-full rounded-lg object-contain"
        priority={priority}
      />
    </span>
  );
}
