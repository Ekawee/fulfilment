FROM node:10
RUN apt-get update -qq && apt-get upgrade -y
RUN npm install -g npm-check-updates
ENV APP_HOME=/usr/src/app
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
