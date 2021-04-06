FROM hayd/ubuntu-deno:1.8.2

WORKDIR /app

COPY ./src/lock.json /app/src/lock.json
COPY ./src/deps.ts /app/src/deps.ts

RUN deno cache --lock=/app/src/lock.json /app/src/deps.ts

CMD deno run --allow-net --unstable --watch /app/src/main.ts 