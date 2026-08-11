import { ExternalLink } from "lucide-react";
import { detectVideoKind, getYouTubeEmbedUrl } from "@/lib/video";

export default function VideoEmbed({ url, title }: { url: string; title: string }) {
  const kind = detectVideoKind(url);
  const embedUrl = kind === "youtube" ? getYouTubeEmbedUrl(url) : null;

  if (embedUrl) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-900">
        <iframe
          src={embedUrl}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm font-medium text-blue hover:bg-slate-100"
    >
      <ExternalLink className="h-4 w-4" />
      {kind === "vk" ? "Смотреть на VK" : "Смотреть видео"}
    </a>
  );
}
