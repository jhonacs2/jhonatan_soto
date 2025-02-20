# Etapa de construcción
FROM node:18.20.6 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli@15

COPY . .

RUN ng build --configuration=production

# Etapa de producción con Nginx
FROM nginx:latest

# Copia el build de Angular al directorio de Nginx
COPY --from=build /app/dist/bp /usr/share/nginx/html

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
