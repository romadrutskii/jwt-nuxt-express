FROM node:16.20.1-alpine3.18

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# RUN npx prisma migrate deploy

CMD ["npx", "prisma", "migrate", "deploy"]

# RUN npm run build

# CMD ["npm", "run", "serve"]