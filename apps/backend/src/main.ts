import { Database, GameDatabase, UserDatabase } from './database/index.ts';
import createApp from './app.ts';

/*
Connection to the mongo database with env variables
Pass the database instance to our services
Initialize the app at port 8000
*/

const user = Deno.env.get('DATABASE_USER');
const password = Deno.env.get('DATABASE_PASSWORD');
const database = new Database(
  'saturn',
  `mongodb://${user}:${password}@database:27017`,
);

await database.connect();

console.log('Server start at http://localhost:8000');

const app = await createApp({
  database: {
    game: new GameDatabase(database),
    user: new UserDatabase(database)
  }
});
await app.listen({ port: 8000 });