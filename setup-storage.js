// One-off setup script: creates the "media" Supabase Storage bucket used
// for team logos, sponsor logos and player photos, plus the RLS policies
// that allow public read access and authenticated (admin) write access.
// Safe to run multiple times (idempotent). Safe to delete after running.
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.kbdncxochgnufqfetabq:yeOD3MA3UARAcwvw@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
    },
  },
});

const statements = [
  `insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
   values ('media', 'media', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
   on conflict (id) do update set
     public = excluded.public,
     file_size_limit = excluded.file_size_limit,
     allowed_mime_types = excluded.allowed_mime_types`,

  `drop policy if exists "media_public_read" on storage.objects`,
  `create policy "media_public_read" on storage.objects for select using (bucket_id = 'media')`,

  `drop policy if exists "media_auth_insert" on storage.objects`,
  `create policy "media_auth_insert" on storage.objects for insert to authenticated with check (bucket_id = 'media')`,

  `drop policy if exists "media_auth_update" on storage.objects`,
  `create policy "media_auth_update" on storage.objects for update to authenticated using (bucket_id = 'media') with check (bucket_id = 'media')`,

  `drop policy if exists "media_auth_delete" on storage.objects`,
  `create policy "media_auth_delete" on storage.objects for delete to authenticated using (bucket_id = 'media')`,
];

async function main() {
  for (const sql of statements) {
    await prisma.$executeRawUnsafe(sql);
    console.log("OK:", sql.trim().split("\n")[0].slice(0, 70));
  }
  console.log("\nБакет media и политики доступа настроены успешно.");
}

main()
  .catch((e) => {
    console.error("Ошибка:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
