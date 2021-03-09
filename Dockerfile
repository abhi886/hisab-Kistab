FROM node:14.14.0-alpine
WORKDIR /usr/src/algo-app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000

RUN npm run lint:src
RUN npm run test
# RUN npm run build:prod

CMD ["npm", "run","dev"]