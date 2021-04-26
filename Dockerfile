FROM node:15.8.0 as build

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

FROM node:15.8.0

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist/ ./
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules

ENTRYPOINT node ./main.js