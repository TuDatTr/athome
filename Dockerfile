# Use the official Bun image
FROM oven/bun:latest AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build Tailwind CSS
RUN bun run build:css

# Create data directory for SQLite
RUN mkdir -p data

# Expose the port the app runs on
EXPOSE 3001

# Run the app
CMD ["bun", "run", "src/index.tsx"]
