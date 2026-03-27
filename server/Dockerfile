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

#install production dependencies for server
RUN pnpm install --filter server... --prod --frozen-lockfile

#copy server source
COPY server/ ./server/
COPY shared/ ./shared/

WORKDIR /usr/src/app/server

# Set the NODE_ENV environment variable to "production"
ENV NODE_ENV=production

#open container port 5000
EXPOSE 5000

CMD ["pnpm", "start"]
