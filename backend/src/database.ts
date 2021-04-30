import { MongoClient } from "https://deno.land/x/mongo@v0.22.0/mod.ts";

export class DatabaseConnection {
  client: MongoClient;

  constructor(public name: string, public url: string) {
    this.client = {} as MongoClient;
  }

  public async connect() {
    const client = new MongoClient();
    await client.connect(this.url);
    this.client = client;
  }

  public getDatabase() {
    return this.client.database(this.name);
  }
}

const database = new DatabaseConnection("saturn", "mongodb://localhost:27017");
await database.connect();

export { database };
