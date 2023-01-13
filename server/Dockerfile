FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --silent

COPY . .

ENV PORT=5050

EXPOSE 5050

CMD ["npm", "start"]