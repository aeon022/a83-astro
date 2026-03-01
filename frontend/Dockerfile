# Dateipfad: frontend/Dockerfile

# --- STAGE 1: Build ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- STAGE 2: Runtime ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Astro Build und Dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# --- NEU: Keystatic Lifeline ---
# Keystatic braucht Zugriff auf die Rohdaten und die Config zur Laufzeit
COPY --from=builder /app/src ./src
COPY --from=builder /app/keystatic.config.ts ./keystatic.config.ts
# Falls du Bilder über Keystatic verwaltest, die im public Ordner liegen, nimm den auch mit:
COPY --from=builder /app/public ./public

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]