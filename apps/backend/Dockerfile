FROM hayd/ubuntu-deno:1.8.2 as backend

WORKDIR /app

COPY ./apps/backend/src/lock.json ./apps/backend/src/deps.ts ./apps/backend/src/
COPY ./tools/waitForScript /wait

RUN deno cache --unstable ./apps/backend/src/deps.ts
RUN chmod +x /wait

EXPOSE 8000
CMD /wait && deno run --allow-net --allow-env --unstable --watch ./apps/backend/src/main.ts
