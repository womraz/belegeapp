# BelegeApp – Einrichtungsanleitung

## Was du brauchst
- Node.js (Version 18 oder höher) → https://nodejs.org
- Einen kostenlosen Supabase-Account → https://supabase.com

---

## Schritt 1: Supabase-Projekt einrichten

### 1a. Projekt erstellen
1. Gehe zu https://supabase.com und melde dich an (kostenlos)
2. Klicke auf **"New project"**
3. Wähle einen Namen (z.B. `belegeapp`) und ein Passwort
4. Wähle eine Region nahe bei dir (z.B. Frankfurt / EU)
5. Warte bis das Projekt erstellt ist (~1 Minute)

### 1b. Datenbanktabelle anlegen
1. Im Supabase-Dashboard: **SQL Editor → New Query**
2. Kopiere den Inhalt der Datei `supabase/schema.sql`
3. Füge ihn in den Editor ein und klicke **"Run"**

### 1c. Storage Bucket erstellen
1. Im Supabase-Dashboard: **Storage → New Bucket**
2. Name: `belege-dateien`
3. **Private** auswählen (nicht öffentlich)
4. Auf **"Create bucket"** klicken

### 1d. API-Schlüssel notieren
1. Im Dashboard: **Settings → API**
2. Notiere dir:
   - **Project URL** (z.B. `https://abcdef.supabase.co`)
   - **anon / public key** (langer String)

### 1e. Benutzer anlegen
1. Im Dashboard: **Authentication → Users → Invite user**
2. Gib deine E-Mail-Adresse ein
3. Du erhältst eine E-Mail – dort Passwort setzen

---

## Schritt 2: App konfigurieren

1. Öffne den Ordner `BelegeApp` im Terminal (Finder → Rechtsklick → „Im Terminal öffnen")
2. Kopiere die Beispiel-Konfiguration:
   ```
   cp .env.example .env
   ```
3. Öffne `.env` in einem Texteditor und trage deine Supabase-Werte ein:
   ```
   VITE_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
   VITE_SUPABASE_ANON_KEY=dein-anon-key
   ```

---

## Schritt 3: App starten

```bash
# Abhängigkeiten installieren (einmalig, dauert ~1 Minute)
npm install

# App im Entwicklungsmodus starten
npm run dev
```

Die App ist dann erreichbar unter: **http://localhost:5173**

Öffne diese Adresse in Firefox auf dem Mac.

---

## Schritt 4: Auf dem iPhone installieren (PWA)

1. Öffne die App-URL im **Safari**-Browser auf dem iPhone  
   (dein Mac und iPhone müssen im selben WLAN sein, oder du deployest die App – siehe unten)
2. Tippe auf das **Teilen-Symbol** (□ mit Pfeil nach oben)
3. Wähle **„Zum Home-Bildschirm"**
4. Die App erscheint nun wie eine native App auf dem Startbildschirm

> **Hinweis:** Für den iPhone-Zugriff muss entweder:
> - Der Mac im selben Netzwerk sein und du rufst `http://MAC-IP:5173` auf, oder
> - Die App wird deployed (empfohlen: Vercel, kostenlos – siehe unten)

---

## Optional: App kostenlos im Internet verfügbar machen (empfohlen)

Mit **Vercel** kannst du die App so hosten, dass sie von überall (Mac & iPhone) erreichbar ist:

1. Erstelle einen Account auf https://vercel.com (kostenlos)
2. Installiere die Vercel CLI: `npm install -g vercel`
3. Im BelegeApp-Ordner ausführen:
   ```bash
   npm run build
   vercel --prod
   ```
4. Trage die Supabase-Werte als Umgebungsvariablen in Vercel ein (Settings → Environment Variables)

---

## Funktionsübersicht

| Funktion | Beschreibung |
|---|---|
| **Beleg hochladen** | PDF oder Bild auswählen (Mac: Drag & Drop, iPhone: Kamera) |
| **OCR** | Text wird automatisch ausgelesen, Felder werden vorbelegt |
| **Metadaten** | Belegdatum, Bezahldatum, Betrag, Währung, Lieferant, Notizen |
| **Liste** | Alle Belege mit Sortierung (7 Optionen) |
| **Filter** | Nach Lieferant, Datumsbereich, Zahlungsstatus |
| **ZIP-Export** | Ausgewählte Belege + CSV-Index als ZIP herunterladen (Mac) |
| **Bearbeiten** | Metadaten jederzeit ändern |
| **Löschen** | Beleg inkl. Datei löschen |

---

## Fehlerbehebung

**„Supabase URL und Anon Key fehlen"**  
→ `.env` Datei existiert nicht oder wurde nicht korrekt befüllt

**OCR ergibt keine sinnvollen Werte**  
→ Die automatische Extraktion ist eine Hilfestellung – Felder können manuell korrigiert werden. Bei schlechter Qualität (handschriftlich, niedriger Scan-Auflösung) greift Tesseract an seine Grenzen.

**„belege-dateien bucket not found"**  
→ Bucket in Supabase Storage noch nicht angelegt (Schritt 1c)

**iPhone sieht die App nicht**  
→ Vercel-Deployment nutzen (empfohlen) oder Mac-IP im lokalen Netz verwenden
