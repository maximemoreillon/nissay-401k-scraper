# Keep in sync with the puppeteer version in package-lock.json
FROM ghcr.io/puppeteer/puppeteer:25.16.0
USER root
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD [ "npm", "run", "start"]
