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

#copy /my-app to root dir
COPY . .

#open container port 3000
EXPOSE 3000

#production mode
RUN pnpm run build

#install serve
RUN pnpm add -g serve

CMD ["serve", "-s", "build"]