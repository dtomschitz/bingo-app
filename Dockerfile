### Backend ###
FROM hayd/ubuntu-deno:1.8.2 as backend

WORKDIR /app

COPY ./apps/backend/src/lock.json /app/src/lock.json
COPY ./apps/backend/src/deps.ts /app/src/deps.ts

RUN deno cache --unstable /app/src/deps.ts
CMD deno run --allow-net --allow-env --unstable --watch /app/src/main.ts 


### Frontend ###
FROM node:12.10.0 AS frontend

WORKDIR /app

COPY package*.json ./
COPY workspace.json ./
RUN npm ci -qy

RUN ls /app

CMD npm run start:frontend