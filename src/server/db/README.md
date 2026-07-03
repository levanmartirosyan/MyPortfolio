# Database

This project uses Drizzle with Postgres.

Preferred production configuration:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="long-random-secret"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="strong-password"
```

If you use Supabase, copy the Postgres connection string from Supabase Database settings into
`DATABASE_URL`. The app can derive the direct host from `SUPABASE_URL` + `SUPABASE_DB_PASSWORD`, but
the exact Supabase connection string is more reliable, especially when Supabase recommends the pooler
host for your project.

Useful commands:

```bash
bun run db:generate
bun run db:push
bun run db:studio
```

At runtime, the app also creates the required portfolio tables if they are missing and seeds the
default portfolio content once.
