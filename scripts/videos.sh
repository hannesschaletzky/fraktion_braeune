#!/usr/bin/env bash
# Kurze TV-Momente aus dem Rohmaterial (assets/, nicht im Repo) nach public/videos/:
# H.264 in 854 px Breite (max. 1,3 MBit/s), AAC-Ton mit kurzem Ein- und Ausblenden, Fast-Start fürs Web,
# dazu ein Vorschaubild. Braucht ffmpeg (brew install ffmpeg). Aufruf: scripts/videos.sh
#
# Schnitte möglichst an Satzgrenzen des Livestream-Kommentars (geprüft mit whisper-cli), sonst klingt
# der Anfang abgehackt. Biertaufe und Aufm Pferd sind schon im Original nur Satzfetzen.
set -euo pipefail
cd "$(dirname "$0")/.."

quelle=assets/2023_09_Timmendorf
ziel=public/videos
mkdir -p "$ziel"

# name | Datei | Start (s) | Länge (s)
while IFS='|' read -r name datei start laenge; do
  [[ -z "$name" || "$name" == \#* ]] && continue
  aus=$(echo "$laenge - 0.5" | bc)
  ffmpeg -nostdin -v error -y -ss "$start" -t "$laenge" -i "$quelle/$datei" \
    -vf "scale=854:-2" -c:v libx264 -preset slow -crf 28 -maxrate 1300k -bufsize 2600k -profile:v high -pix_fmt yuv420p \
    -af "afade=t=in:d=0.3,afade=t=out:st=$aus:d=0.5" \
    -c:a aac -b:a 96k -ac 2 -movflags +faststart -map_metadata -1 "$ziel/$name.mp4"
  ffmpeg -nostdin -v error -y -ss "$(echo "$start + 1" | bc)" -i "$quelle/$datei" -frames:v 1 -vf "scale=640:-2" -c:v libwebp -quality 72 "$ziel/$name.webp"
  echo "$name: $(( $(stat -f %z "$ziel/$name.mp4") / 1024 )) KB"
done <<'LISTE'
friesenjung|ordner_Friesenjung1.mov|0|14
dancecam|ordner_harlemshake1.mov|10|19
taube|ordner_taube3.mov|22.6|23.3
biertaufe|ordner_Biertaufe.mov|0|7
harlemshake|ordner_harlemshake2.mov|0|21
aufmpferd|ordner_aufmPferd1.mov|0|6.4
LISTE
