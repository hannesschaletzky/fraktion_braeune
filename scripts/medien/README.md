# Medien-Auswertung

Index über das Rohmaterial in `assets/` (nicht im Repo). Die Ergebnisse liegen in `assets/_index/` und
müssen nicht neu berechnet werden; die Skripte hier erzeugen sie bei Bedarf neu. Alle Skripte bekommen
`assets/_index` als ersten Parameter (`I` unten).

    I=assets/_index
    python3 -I scripts/medien/parse.py <export>/your_instagram_activity/media $I/ig/ig.json   # Posts, Reels, Stories mit Text und Datum
    python3 -I scripts/medien/index.py $I <export-ordner>      # Länge, Format, Lautstärke aller Videos → ig/videos.json
    python3 -I scripts/medien/transkribiere.py $I              # Whisper (Modell in $I/whisper) → ig/ton/<id>.txt
    python3 -I scripts/medien/klasse.py $I                     # Tonart je Story: MUSIK, CHOR, JUBEL, SPRACHE … → ig/klasse.json
    python3 -I scripts/medien/boegen.py $I                     # Stories den Turnieren zuordnen (events.py) → ig/nummern.json
    python3 -I scripts/medien/liste.py $I 2026-dortmund        # Übersicht: Nummer, Länge, Story-Text, Transkript
    node scripts/medien/abgleich.mjs $I                        # Postfotos ↔ Originaldateien (Bildvergleich) → ig/abgleich.json

Kontaktbögen zum Durchsehen: `raster.mjs` (Stories je Turnier), `streifen.mjs` (mehrere Bilder pro Video),
`postbogen.mjs` (Posts mit Text), `poster.mjs` (Vorschaubilder in public/videos), `gross.mjs` (einzelne Fotos groß).

`$I/tv/` enthält die Transkripte der Livestream-Mitschnitte (Grundlage für die Zitate in src/data/clips.ts).
