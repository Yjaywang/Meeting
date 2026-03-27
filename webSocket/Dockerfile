#download parent image
FROM node:18-bullseye-slim

#enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

#set root dir
WORKDIR /usr/src/app

#copy pnpm workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

#copy workspace package.json files for resolution
COPY server/package.json ./server/
COPY shared/package.json ./shared/
COPY my-app/package.json ./my-app/
COPY webSocket/package.json ./webSocket/

#install production dependencies for webSocket
RUN pnpm install --filter websocket... --prod --frozen-lockfile

#copy webSocket source
COPY webSocket/ ./webSocket/
COPY shared/ ./shared/

WORKDIR /usr/src/app/webSocket

# Set the NODE_ENV environment variable to "production"
ENV NODE_ENV=production

#open container port 8000
EXPOSE 8000

CMD ["pnpm", "start"]
