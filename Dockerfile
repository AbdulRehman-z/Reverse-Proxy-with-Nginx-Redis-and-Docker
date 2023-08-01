FROM node:alpine3.18

#working directory
WORKDIR /usr/app

#install dependencies
COPY package.json .
COPY . .

#default command
CMD ["npm", "start"]