-- Run as the Postgres admin (npm run db:setup). Safe to re-run.
-- Creates the app's limited role and its rights (spec §10: the running app
-- must not be able to CREATE/DROP anything).

-- 1. Login role. Set its password once with:
--    ALTER ROLE hireatech_app PASSWORD '...';
--    (run-sql does this automatically the first time; see README)

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'hireatech_app') THEN
    CREATE ROLE hireatech_app LOGIN;
  END IF;
END
$$;

-- 2. Allowed to connect to this database and use its public schema
GRANT CONNECT ON DATABASE hireatech TO hireatech_app;
GRANT USAGE ON SCHEMA public TO hireatech_app;

-- 3. Hardening: nobody may create new objects in this schema except the admin
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

-- 4. Rights on tables/sequences that ALREADY exist
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO hireatech_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO hireatech_app;

-- 5. Tables/sequences created LATER (by db:schema as admin) get the same rights automatically
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO hireatech_app;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO hireatech_app;
