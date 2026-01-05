FROM ghcr.io/puppeteer/puppeteer:24
WORKDIR /usr/src/app
COPY . .
RUN npm install
CMD [ "npm", "run", "start"]