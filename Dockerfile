# syntax=docker/dockerfile:1

# Die Seite baut GitHub Actions vorher (npm run build, mit Bild-Cache), das Image packt nur dist/ in Caddy.
FROM caddy:2.11.9-alpine
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY dist /srv
EXPOSE 80
