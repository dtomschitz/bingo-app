FROM hayd/ubuntu-deno:1.8.2 as backend

WORKDIR /app

COPY ./apps/backend/src/lock.json ./apps/backend/src/deps.ts ./apps/backend/src/

RUN ls

RUN deno cache --unstable ./apps/backend/src/deps.ts

EXPOSE 8000
CMD deno run --allow-net --allow-env --unstable --watch ./apps/backend/src/main.ts 
