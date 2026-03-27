# Build stage
FROM node:18-bullseye-slim AS build

RUN corepack enable && corepack prepare pnpm@9.15.1 --activate

WORKDIR /usr/src/app

# Copy pnpm workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Copy workspace package.json files for resolution
COPY server/package.json ./server/
COPY shared/package.json ./shared/
COPY my-app/package.json ./my-app/
COPY webSocket/package.json ./webSocket/

# Install dependencies (includes devDependencies for build)
RUN pnpm install --filter websocket... --frozen-lockfile

# Copy source
COPY webSocket/ ./webSocket/
COPY shared/ ./shared/

# Build TypeScript
RUN pnpm --filter websocket run build

# Create production-ready deployment with only prod dependencies
RUN pnpm deploy --filter websocket --prod /prod/websocket


# Production stage
FROM node:18-bullseye-slim

WORKDIR /usr/src/app/webSocket

# Copy production node_modules from pnpm deploy
COPY --from=build /prod/websocket/node_modules ./node_modules

# Copy compiled output from build stage (includes webSocket/ and shared/)
COPY --from=build /usr/src/app/webSocket/dist ./dist

USER node

ENV NODE_ENV=production
EXPOSE 8000

CMD ["node", "dist/webSocket/server.js"]
