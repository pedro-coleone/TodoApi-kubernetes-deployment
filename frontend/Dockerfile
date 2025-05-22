# Build stage: usando Node 18 Alpine para construir o frontend React/Vite
FROM node:18-alpine AS build

WORKDIR /app

# Copia arquivos de dependências e instalar pacotes pra aproveitar cache
COPY package*.json ./
RUN npm install

# Copia o restante do código e construir a aplicação
COPY . .
RUN npm run build

# Production stage: usa Nginx Alpine para servir o build estático
FROM nginx:alpine

# Copia arquivos construídos do estágio anterior para a pasta padrão do nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expoe a porta 80 para acesso HTTP
EXPOSE 80

# Roda nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]
