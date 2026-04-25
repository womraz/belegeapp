-- BelegeApp – Supabase Datenbankschema
-- Ausführen in: Supabase Dashboard → SQL Editor → New Query

-- ============================================================
-- 1. Tabelle: belege
-- ============================================================
CREATE TABLE IF NOT EXISTS public.belege (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Datei
  file_path       TEXT NOT NULL,          -- Pfad in Supabase Storage
  file_name       TEXT NOT NULL,          -- Originaldateiname
  file_type       TEXT NOT NULL,          -- 'pdf' oder 'image'
  file_size       BIGINT,                 -- Bytes

  -- OCR
  ocr_text        TEXT,                   -- Roher OCR-Text

  -- Metadaten
  belegdatum      DATE,                   -- Datum des Belegs
  bezahldatum     DATE,                   -- Datum der Zahlung
  betrag          NUMERIC(12, 2),         -- Betrag
  waehrung        TEXT DEFAULT 'EUR',     -- Währung (ISO 4217)
  lieferant       TEXT,                   -- Lieferant / Aussteller
  notizen         TEXT,                   -- Freie Notizen

  -- Systemfelder
  erfassungsdatum TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index für schnelles Filtern/Sortieren
CREATE INDEX IF NOT EXISTS idx_belege_user_id      ON public.belege(user_id);
CREATE INDEX IF NOT EXISTS idx_belege_belegdatum   ON public.belege(belegdatum);
CREATE INDEX IF NOT EXISTS idx_belege_bezahldatum  ON public.belege(bezahldatum);
CREATE INDEX IF NOT EXISTS idx_belege_lieferant    ON public.belege(lieferant);

-- ============================================================
-- 2. Row Level Security (RLS)
-- ============================================================
ALTER TABLE public.belege ENABLE ROW LEVEL SECURITY;

-- Jeder Benutzer sieht nur seine eigenen Belege
CREATE POLICY "Eigene Belege lesen"   ON public.belege
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Eigene Belege erstellen" ON public.belege
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Eigene Belege bearbeiten" ON public.belege
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Eigene Belege löschen" ON public.belege
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 3. Storage Bucket: belege-dateien
-- ============================================================
-- Muss manuell im Dashboard angelegt werden:
-- Storage → New Bucket → Name: "belege-dateien" → Private

-- Storage Policies (nach Bucket-Erstellung ausføhren):
CREATE POLICY "Eigene Dateien hochladen"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'belege-dateien' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Eigene Dateien lesen"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'belege-dateien' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Eigene Dateien löschen"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'belege-dateien' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- 4. Automatisches updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER belege_updated_at
  BEFORE UPDATE ON public.belege
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
