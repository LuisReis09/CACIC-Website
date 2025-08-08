# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia somente package.json e package-lock.json para instalar dependências
COPY package*.json ./

RUN npm install

# Copia todo o restante do código
COPY . .

# Gera o build de produção do Next.js
RUN npm run build

# Etapa 2: Servir com Next.js
FROM node:20-alpine

WORKDIR /app

# Copia arquivos necessários da etapa de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# COPY --from=builder /app/next.config.js ./

EXPOSE 3000

CMD ["npm", "run", "start"]
