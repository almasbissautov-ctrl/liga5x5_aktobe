"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

function readNewsInput(formData: FormData) {
  return {
    title: String(formData.get("title") || "").trim(),
    excerpt: String(formData.get("excerpt") || "").trim(),
    content: String(formData.get("content") || "").trim(),
    coverImageUrl: String(formData.get("coverImageUrl") || "").trim(),
    isPublished: formData.get("isPublished") === "on",
  };
}

async function uniqueNewsSlug(title: string) {
  const base = slugify(title);
  let slug = base;
  let i = 1;
  while (await prisma.news.findFirst({ where: { slug } })) {
    i += 1;
    slug = `${base}-${i}`;
  }
  return slug;
}

export async function createNews(formData: FormData) {
  const input = readNewsInput(formData);
  if (!input.title) throw new Error("Укажите заголовок новости");
  if (!input.content) throw new Error("Укажите текст новости");

  const slug = await uniqueNewsSlug(input.title);

  await prisma.news.create({
    data: {
      slug,
      title: input.title,
      excerpt: input.excerpt || null,
      content: input.content,
      coverImageUrl: input.coverImageUrl || null,
      isPublished: input.isPublished,
      publishedAt: input.isPublished ? new Date() : null,
    },
  });

  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function updateNews(newsId: string, formData: FormData) {
  const input = readNewsInput(formData);
  if (!input.title) throw new Error("Укажите заголовок новости");
  if (!input.content) throw new Error("Укажите текст новости");

  const existing = await prisma.news.findUnique({ where: { id: newsId } });

  await prisma.news.update({
    where: { id: newsId },
    data: {
      title: input.title,
      excerpt: input.excerpt || null,
      content: input.content,
      coverImageUrl: input.coverImageUrl || null,
      isPublished: input.isPublished,
      publishedAt: input.isPublished ? existing?.publishedAt ?? new Date() : null,
    },
  });

  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function deleteNews(newsId: string) {
  await prisma.news.delete({ where: { id: newsId } });
  revalidatePath("/admin/news");
}
