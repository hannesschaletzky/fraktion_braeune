#!/usr/bin/env bash
# Kurze TV-Momente aus dem Rohmaterial (assets/, nicht im Repo) nach public/videos/:
# H.264 in 854 px (max. 1,3 MBit/s) Breite, AAC-Ton, Fast-Start fürs Web, dazu ein Vorschaubild.
# Braucht ffmpeg (brew install ffmpeg). Aufruf: scripts/videos.sh
set -euo pipefail
cd "$(dirname "$0")/.."

quelle=assets/2023_Timmendorf
ziel=public/videos
mkdir -p "$ziel"

# name | Datei | Start (s) | Länge (s)
while IFS='|' read -r name datei start laenge; do
  [[ -z "$name" || "$name" == \#* ]] && continue
  ffmpeg -nostdin -v error -y -ss "$start" -t "$laenge" -i "$quelle/$datei" \
    -vf "scale=854:-2" -c:v libx264 -preset slow -crf 28 -maxrate 1300k -bufsize 2600k -profile:v high -pix_fmt yuv420p \
    -c:a aac -b:a 96k -ac 2 -movflags +faststart -map_metadata -1 "$ziel/$name.mp4"
  ffmpeg -nostdin -v error -y -ss "$(echo "$start + 1" | bc)" -i "$quelle/$datei" -frames:v 1 -vf "scale=960:-2" -q:v 5 "$ziel/$name.jpg"
  echo "$name: $(du -k "$ziel/$name.mp4" | cut -f1) KB"
done <<'LISTE'
friesenjung|Friesenjung1.mov|0|14
dancecam|harlemshake1.mov|6|16
taube|taube3.mov|32|13
biertaufe|Biertaufe.mov|0|7
harlemshake|harlemshake2.mov|0|21
aufmpferd|aufmPferd1.mov|0|6.4
LISTE
