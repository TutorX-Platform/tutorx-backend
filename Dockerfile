#FROM node:15.5.0-alpine3.10 as build
#WORKDIR /app
#ENV PATH /app/node_modules/.bin:$PATH
#ENV GENERATE_SOURCEMAP=false
#RUN export NODE_OPTIONS=--max_old_space_size=4096
#COPY package.json ./
#COPY package-lock.json ./
#RUN npm ci --silent
#RUN npm install express@4.17.1 -g --silent
#COPY . ./
##RUN npm run build

## production env
#FROM nginx:stable-alpine
##RUN rm /etc/nginx/conf.d/default.conf
##COPY --from=build /app/build /usr/share/nginx/html
##COPY default.conf /etc/nginx/conf.d
#EXPOSE 80
##EXPOSE 3000
#CMD ["nginx","-g","daemon off;"]

FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node","index.js"]

