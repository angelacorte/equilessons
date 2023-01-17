FROM node:alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

ENV PORT=4200

EXPOSE 4200

CMD /usr/src/app/node_modules/.bin/ng serve --host 0.0.0.0 --disable-host-check
