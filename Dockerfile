FROM ghcr.io/puppeteer/puppeteer:24
USER root
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
RUN npx puppeteer browsers install chrome
CMD [ "npm", "run", "start"]