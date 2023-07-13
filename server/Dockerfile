FROM node:16.20.1-alpine3.18

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

COPY .env ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "serve"]