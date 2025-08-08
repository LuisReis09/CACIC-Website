FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma
COPY . .

# Gere o Prisma Client antes do build
RUN npx prisma generate

RUN npm run build

EXPOSE 4000

# Comando para rodar migrations e iniciar app
CMD npx prisma migrate deploy && npm run start:prod
