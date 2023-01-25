#download parent image
FROM node:18-bullseye-slim

#set root dir
WORKDIR /usr/src/app

#copy package* json file to root dir(/usr/src/app)
COPY package*.json ./

#install package
RUN npm install

#copy /my-app to root dir 
COPY . .

#open container port 5000
EXPOSE 3000

#production mode
RUN npm run build --production

#install serve
RUN npm install -g serve

CMD ["serve", "-s", "build"]