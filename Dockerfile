FROM ghcr.io/puppeteer/puppeteer:24
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 7070
CMD [ "npm", "run", "start"]
