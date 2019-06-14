FROM node:8

COPY backend/ .
COPY package.json .
RUN npm install

CMD ["node", "entrypoint.js"]