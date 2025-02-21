FROM node:18.20.6 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli@15

COPY . .

RUN ng build --configuration=production

FROM nginx:latest

COPY --from=build /app/dist/bp /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
