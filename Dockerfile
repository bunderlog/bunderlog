# --- Stage 1: Build Go server ---
FROM golang:1.21-alpine AS server-build
WORKDIR /server-build
COPY apps/server/go.mod ./
COPY apps/server/main.go ./
RUN go mod download
COPY apps/server/ ./
RUN go build -o server main.go

# --- Stage 2: Build web app ---
FROM oven/bun:1.2 AS web-build
WORKDIR /web-build
COPY package.json ./
COPY bun.lock ./
COPY apps/web/src ./apps/web/src
COPY apps/web/package.json ./apps/web/package.json
COPY apps/web/tsconfig.json ./apps/web/tsconfig.json
COPY apps/web/tsconfig.app.json ./apps/web/tsconfig.app.json
COPY apps/web/tsconfig.node.json ./apps/web/tsconfig.node.json
COPY apps/web/vite.config.ts ./apps/web/vite.config.ts
COPY apps/web/index.html ./apps/web/index.html
# RUN bun install --frozen-lockfile
RUN bun install
WORKDIR /web-build/apps/web
RUN bunx vue-tsc -b 
RUN bunx vite build

# --- Stage 3: Final image ---
FROM alpine:3.19
WORKDIR /app
# Copy server binary
COPY --from=server-build /server-build/server ./server
# Copy web build output (assuming dist/ is the output dir)
COPY --from=web-build /web-build/apps/web/dist ./web
EXPOSE 8080
CMD ["./server"]
