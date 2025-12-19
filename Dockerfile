# --- Stage 1: Dependencies ---
FROM oven/bun:latest AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# --- Stage 2: Build ---
FROM oven/bun:latest AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build:css

# --- Stage 3: Runtime ---
FROM oven/bun:latest AS runner
WORKDIR /app

# Only copy necessary files for execution
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/data ./data 

# Ensure data directory exists
RUN mkdir -p data

ENV NODE_ENV=production
EXPOSE 3001

CMD ["bun", "run", "src/index.tsx"]