#download parent image
FROM node:18-bullseye-slim

#set root dir
WORKDIR /usr/src/app

#copy package* json file to root dir(/usr/src/app)
COPY package*.json ./

#install package
RUN npm install

#copy /server to root dir 
COPY . .

# Set the NODE_ENV environment variable to "production"
ENV NODE_ENV=production

#open container port 8000
EXPOSE 8000


CMD ["npm", "start"]