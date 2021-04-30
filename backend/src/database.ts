import { MongoClient } from "https://deno.land/x/mongo@v0.22.0/mod.ts";

export class DatabaseConnection {
  public client: MongoClient;

  constructor(public dbName: string, public url: string) {
    this.client = {} as MongoClient;
  }

  public connect() {
    const client = new MongoClient();
    client.connect(this.url);
    this.client = client;
  }

  public getDatabase() {
    try {
      return this.client.database(this.dbName);
    } catch (e) {
      console.log(e);
    }
  }
}

const database = new DatabaseConnection(
  "saturn",
  "mongodb://root:rootPassword@localhost:27017"
);
database.connect();

export { database };
