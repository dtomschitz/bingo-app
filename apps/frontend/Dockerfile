FROM node:12.10.0 AS frontend

WORKDIR /app

COPY package*.json nx.json workspace.json tsconfig.base.json babel.config.json ./
COPY ./tools/waitForScript /wait

RUN npm install -g nx
RUN npm install
RUN chmod +x /wait

EXPOSE 3000
CMD /wait && npm run frontend:start:docker
