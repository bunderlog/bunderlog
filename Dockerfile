# --- Stage 1: Build Go server ---
FROM golang:1.21-alpine AS server-build
WORKDIR /app/server
COPY apps/server/go.mod ./
COPY apps/server/main.go ./
RUN go mod download
COPY apps/server/ ./
RUN go build -o server main.go

# --- Stage 2: Build web app ---
FROM oven/bun:1.2 AS web-build
WORKDIR /app/web
COPY apps/web/package.json ./
COPY bun.lock ./
COPY apps/web/tsconfig.json ./
COPY apps/web/tsconfig.app.json ./
COPY apps/web/tsconfig.node.json ./
COPY apps/web/vite.config.ts ./
COPY apps/web/src ./src
RUN bun install --frozen-lockfile && bun run build

# --- Stage 3: Final image ---
FROM alpine:3.19
WORKDIR /app
# Copy server binary
COPY --from=server-build /app/server/server ./server
# Copy web build output (assuming dist/ is the output dir)
COPY --from=web-build /app/web/dist ./web-dist
EXPOSE 8080
CMD ["./server"]
