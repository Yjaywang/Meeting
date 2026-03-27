#download parent image
FROM node:18-bullseye-slim

#enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

#set root dir
WORKDIR /usr/src/app

#copy package json file to root dir(/usr/src/app)
COPY package.json ./

#install package
RUN pnpm install

#copy /server to root dir
COPY . .

# Set the NODE_ENV environment variable to "production"
ENV NODE_ENV=production

#open container port 8000
EXPOSE 8000


CMD ["pnpm", "start"]