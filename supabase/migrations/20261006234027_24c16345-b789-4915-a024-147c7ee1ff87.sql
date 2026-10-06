CREATE TABLE public.citizen_reports (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 neighborhood text NOT NULL CHECK (neighborhood IN ('Campeche','Pântano do Sul','Armação','Rio Tavares','Ribeirão da Ilha','Costa de Dentro')),
 kind text NOT NULL CHECK (kind IN ('Água na rua','Via bloqueada','Bueiro obstruído')),
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published','rejected')),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT (id,neighborhood,kind) ON public.citizen_reports TO anon, authenticated;
GRANT SELECT ON public.citizen_reports TO anon, authenticated;
GRANT ALL ON public.citizen_reports TO service_role;
ALTER TABLE public.citizen_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Citizens submit pending structured reports" ON public.citizen_reports FOR INSERT TO anon, authenticated WITH CHECK (status='pending');
CREATE POLICY "Only published reports are public" ON public.citizen_reports FOR SELECT TO anon, authenticated USING (status='published');
CREATE OR REPLACE FUNCTION public.limit_citizen_reports() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 PERFORM pg_advisory_xact_lock(17042026);
 IF (SELECT count(*) FROM public.citizen_reports WHERE created_at > now() - interval '1 minute') >= 10 THEN
  RAISE EXCEPTION 'Muitos relatos neste momento. Tente novamente em um minuto.';
 END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER limit_report_submissions BEFORE INSERT ON public.citizen_reports FOR EACH ROW EXECUTE FUNCTION public.limit_citizen_reports();
CREATE OR REPLACE FUNCTION public.touch_report_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN NEW.updated_at=now(); RETURN NEW; END; $$;
CREATE TRIGGER touch_report_updated_at BEFORE UPDATE ON public.citizen_reports FOR EACH ROW EXECUTE FUNCTION public.touch_report_updated_at();