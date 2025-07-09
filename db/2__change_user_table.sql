ALTER TABLE public.users DROP CONSTRAINT users_id_fkey;
ALTER TABLE public.users ADD COLUMN password text;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP FUNCTION IF EXISTS public.handle_new_user();
ALTER TABLE public.users ALTER COLUMN id SET DEFAULT gen_random_uuid();
