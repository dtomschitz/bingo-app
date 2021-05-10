FROM node:12.10.0 AS frontend

WORKDIR /app

COPY package*.json nx.json workspace.json tsconfig.base.json babel.config.json ./

RUN ls /app

RUN npm install -g nx
RUN npm install

EXPOSE 3000
CMD npm run frontend:start:docker