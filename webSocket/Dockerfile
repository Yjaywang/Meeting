# Build stage
FROM node:18-bullseye-slim AS build

#enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

#copy pnpm workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

#copy workspace package.json files for resolution
COPY server/package.json ./server/
COPY shared/package.json ./shared/
COPY my-app/package.json ./my-app/
COPY webSocket/package.json ./webSocket/

#install all dependencies (includes devDependencies for build)
RUN pnpm install --filter websocket... --frozen-lockfile

#copy webSocket source
COPY webSocket/ ./webSocket/
COPY shared/ ./shared/

#build TypeScript
RUN pnpm --filter websocket run build

# Production stage
FROM node:18-bullseye-slim

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

#copy pnpm workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

#copy workspace package.json files for resolution
COPY server/package.json ./server/
COPY shared/package.json ./shared/
COPY my-app/package.json ./my-app/
COPY webSocket/package.json ./webSocket/

#install production dependencies only
RUN pnpm install --filter websocket... --prod --frozen-lockfile

#copy compiled output from build stage
COPY --from=build /usr/src/app/webSocket/dist ./webSocket/dist

WORKDIR /usr/src/app/webSocket

ENV NODE_ENV=production

EXPOSE 8000

CMD ["pnpm", "start"]
